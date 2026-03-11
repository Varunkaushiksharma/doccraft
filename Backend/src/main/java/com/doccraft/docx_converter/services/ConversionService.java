package com.doccraft.docx_converter.services;

import com.doccraft.docx_converter.model.ConversionRecord;
import com.doccraft.docx_converter.model.User;
import com.doccraft.docx_converter.repo.ConversionRecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.apache.pdfbox.Loader;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.file.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class ConversionService {

    private final ConversionRecordRepository recordRepo;

    @Value("${doccraft.upload.dir}")
    private String uploadDir;

    @Value("${doccraft.output.dir}")
    private String outputDir;

    @Value("${doccraft.file.expiry-minutes}")
    private int expiryMinutes;

    // ── PDF → DOCX ───────────────────────────────────────────────────────────
    public Path convertPdfToDocx(MultipartFile file, User user, String ip) throws IOException {
        ensureDirs();
        Path inputPath = saveUpload(file);
        String outFilename = UUID.randomUUID() + ".docx";
        Path outputPath = Paths.get(outputDir, outFilename);

        try (PDDocument pdf = Loader.loadPDF(inputPath.toFile())) {
            PDFTextStripper stripper = new PDFTextStripper();
            XWPFDocument docx = new XWPFDocument();

            for (int i = 1; i <= pdf.getNumberOfPages(); i++) {
                stripper.setStartPage(i);
                stripper.setEndPage(i);
                String pageText = stripper.getText(pdf);

                for (String line : pageText.split("\n")) {
                    XWPFParagraph para = docx.createParagraph();
                    XWPFRun run = para.createRun();
                    run.setText(line);
                    run.setFontFamily("Calibri");
                    run.setFontSize(11);
                }

                // Insert page break between pages
                if (i < pdf.getNumberOfPages()) {
                    XWPFParagraph breakPara = docx.createParagraph();
                    breakPara.setPageBreak(true);
                }
            }

            try (FileOutputStream fos = new FileOutputStream(outputPath.toFile())) {
                docx.write(fos);
            }
            docx.close();
        }

        saveRecord(file, outFilename, "PDF", "DOCX", "pdf-to-word", outputPath, user, ip, ConversionRecord.Status.SUCCESS);
        return outputPath;
    }

    // ── DOCX → PDF ───────────────────────────────────────────────────────────
    // Strategy 1: LibreOffice headless (best quality — install LibreOffice on server)
    // Strategy 2: Fallback — extract text from DOCX and write to PDF via PDFBox
    public Path convertDocxToPdf(MultipartFile file, User user, String ip) throws IOException {
        ensureDirs();
        Path inputPath = saveUpload(file);
        String outFilename = UUID.randomUUID() + ".pdf";
        Path outputPath = Paths.get(outputDir, outFilename);

        // Try LibreOffice first (recommended for production)
        if (isLibreOfficeAvailable()) {
            convertWithLibreOffice(inputPath, outputPath);
        } else {
            // Fallback: text-only PDF using PDFBox
            convertDocxToPdfFallback(inputPath, outputPath);
        }

        saveRecord(file, outFilename, "DOCX", "PDF", "word-to-pdf", outputPath, user, ip, ConversionRecord.Status.SUCCESS);
        return outputPath;
    }

    private boolean isLibreOfficeAvailable() {
        try {
            Process p = Runtime.getRuntime().exec(new String[]{"libreoffice", "--version"});
            return p.waitFor() == 0;
        } catch (Exception e) {
            return false;
        }
    }

    private void convertWithLibreOffice(Path input, Path output) throws IOException {
        try {
            ProcessBuilder pb = new ProcessBuilder(
                "libreoffice", "--headless", "--convert-to", "pdf",
                "--outdir", outputDir,
                input.toAbsolutePath().toString()
            );
            pb.redirectErrorStream(true);
            Process p = pb.start();
            int exitCode = p.waitFor();
            if (exitCode != 0) throw new IOException("LibreOffice exited with code: " + exitCode);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IOException("LibreOffice conversion was interrupted");
        }
    }

    private void convertDocxToPdfFallback(Path inputPath, Path outputPath) throws IOException {
        // Extract text from DOCX, write to PDF
        try (XWPFDocument docx = new XWPFDocument(new FileInputStream(inputPath.toFile()));
             PDDocument pdf = new PDDocument()) {

            List<String> lines = new ArrayList<>();
            for (XWPFParagraph para : docx.getParagraphs()) {
                lines.add(para.getText());
            }

            // Write lines to PDF pages
            int linesPerPage = 45;
            int currentLine = 0;
            PDType1Font font = new PDType1Font(Standard14Fonts.FontName.HELVETICA);

            while (currentLine < lines.size()) {
                PDPage page = new PDPage(PDRectangle.A4);
                pdf.addPage(page);

                try (PDPageContentStream cs = new PDPageContentStream(pdf, page)) {
                    cs.beginText();
                    cs.setFont(font, 11);
                    cs.newLineAtOffset(50, 780);
                    cs.setLeading(16f);

                    int end = Math.min(currentLine + linesPerPage, lines.size());
                    for (int i = currentLine; i < end; i++) {
                        String text = lines.get(i);
                        if (text == null) text = "";
                        // Sanitize — PDFBox can't handle non-WinAnsi chars
                        text = text.replaceAll("[^\\x00-\\xFF]", "?");
                        cs.showText(text);
                        cs.newLine();
                    }
                    cs.endText();
                    currentLine = end;
                }
            }

            if (pdf.getNumberOfPages() == 0) pdf.addPage(new PDPage());
            pdf.save(outputPath.toFile());
        }
    }

    // ── PDF → JPG ────────────────────────────────────────────────────────────
    public Path convertPdfToJpg(MultipartFile file, User user, String ip) throws IOException {
        ensureDirs();
        Path inputPath = saveUpload(file);
        String outFilename = UUID.randomUUID() + ".jpg";
        Path outputPath = Paths.get(outputDir, outFilename);

        try (PDDocument pdf = Loader.loadPDF(inputPath.toFile())) {
            PDFRenderer renderer = new PDFRenderer(pdf);
            // Render first page at 150 DPI
            BufferedImage image = renderer.renderImageWithDPI(0, 150, ImageType.RGB);
            ImageIO.write(image, "JPEG", outputPath.toFile());
        }

        saveRecord(file, outFilename, "PDF", "JPG", "pdf-to-jpg", outputPath, user, ip, ConversionRecord.Status.SUCCESS);
        return outputPath;
    }

    // ── JPG → PDF ────────────────────────────────────────────────────────────
    public Path convertJpgToPdf(MultipartFile file, User user, String ip) throws IOException {
        ensureDirs();
        Path inputPath = saveUpload(file);
        String outFilename = UUID.randomUUID() + ".pdf";
        Path outputPath = Paths.get(outputDir, outFilename);

        try (PDDocument pdf = new PDDocument()) {
            BufferedImage image = ImageIO.read(inputPath.toFile());
            PDPage page = new PDPage(new PDRectangle(image.getWidth(), image.getHeight()));
            pdf.addPage(page);

            var pdImage = org.apache.pdfbox.pdmodel.graphics.image.LosslessFactory.createFromImage(pdf, image);
            try (PDPageContentStream cs = new PDPageContentStream(pdf, page)) {
                cs.drawImage(pdImage, 0, 0, image.getWidth(), image.getHeight());
            }
            pdf.save(outputPath.toFile());
        }

        saveRecord(file, outFilename, "JPG", "PDF", "jpg-to-pdf", outputPath, user, ip, ConversionRecord.Status.SUCCESS);
        return outputPath;
    }

    // ── Merge PDFs ───────────────────────────────────────────────────────────
    public Path mergePdfs(List<MultipartFile> files, User user, String ip) throws IOException {
        ensureDirs();
        String outFilename = UUID.randomUUID() + ".pdf";
        Path outputPath = Paths.get(outputDir, outFilename);

        List<PDDocument> docs = new ArrayList<>();
        try (PDDocument merged = new PDDocument()) {
            for (MultipartFile f : files) {
                Path p = saveUpload(f);
                PDDocument doc = Loader.loadPDF(p.toFile());
                docs.add(doc);
                for (var page : doc.getPages()) {
                    merged.addPage(page);
                }
            }
            merged.save(outputPath.toFile());
        } finally {
            for (PDDocument d : docs) {
                try { d.close(); } catch (IOException ignored) {}
            }
        }

        saveRecord(files.get(0), outFilename, "PDF", "PDF", "merge-pdf", outputPath, user, ip, ConversionRecord.Status.SUCCESS);
        return outputPath;
    }

    // ── Compress PDF ─────────────────────────────────────────────────────────
    public Path compressPdf(MultipartFile file, User user, String ip) throws IOException {
        ensureDirs();
        Path inputPath = saveUpload(file);
        String outFilename = UUID.randomUUID() + ".pdf";
        Path outputPath = Paths.get(outputDir, outFilename);

        try (PDDocument pdf = Loader.loadPDF(inputPath.toFile())) {
            // PDFBox will re-serialize and apply basic compression
            pdf.save(outputPath.toFile());
        }

        saveRecord(file, outFilename, "PDF", "PDF", "compress-pdf", outputPath, user, ip, ConversionRecord.Status.SUCCESS);
        return outputPath;
    }

    // ── Helpers ──────────────────────────────────────────────────────────────
    private Path saveUpload(MultipartFile file) throws IOException {
        String safeFilename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path dest = Paths.get(uploadDir, safeFilename);
        Files.copy(file.getInputStream(), dest, StandardCopyOption.REPLACE_EXISTING);
        return dest;
    }

    private void saveRecord(MultipartFile file, String outFilename,
                            String from, String to, String toolId,
                            Path outputPath, User user, String ip,
                            ConversionRecord.Status status) {
        ConversionRecord record = ConversionRecord.builder()
                .originalFilename(file.getOriginalFilename())
                .convertedFilename(outFilename)
                .fromFormat(from)
                .toFormat(to)
                .toolId(toolId)
                .fileSizeKb(file.getSize() / 1024)
                .status(status)
                .outputPath(outputPath.toString())
                .ipAddress(ip)
                .user(user)
                .expiresAt(LocalDateTime.now().plusMinutes(expiryMinutes))
                .build();
        recordRepo.save(record);
    }

    private void ensureDirs() throws IOException {
        Files.createDirectories(Paths.get(uploadDir));
        Files.createDirectories(Paths.get(outputDir));
    }

    // ── Scheduled File Cleanup (every 10 min) ────────────────────────────────
    @Scheduled(fixedDelay = 600_000)
    public void cleanExpiredFiles() {
        List<ConversionRecord> expired = recordRepo.findByExpiresAtBefore(LocalDateTime.now());
        for (ConversionRecord record : expired) {
            try {
                if (record.getOutputPath() != null) {
                    Files.deleteIfExists(Paths.get(record.getOutputPath()));
                }
                recordRepo.delete(record);
                log.info("Cleaned up expired file: {}", record.getConvertedFilename());
            } catch (IOException e) {
                log.error("Failed to delete expired file: {}", record.getOutputPath(), e);
            }
        }
    }
}
