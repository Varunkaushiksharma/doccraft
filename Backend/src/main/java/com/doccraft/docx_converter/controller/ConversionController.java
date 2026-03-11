package com.doccraft.docx_converter.controller;

import com.doccraft.docx_converter.model.User;
import com.doccraft.docx_converter.services.ConversionService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.*;
import org.springframework.lang.NonNull;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.List;

@RestController
@RequestMapping("/api/convert")
@RequiredArgsConstructor
public class ConversionController {

    private final ConversionService conversionService;

    // ── POST /api/convert/pdf-to-word ─────────────────────────────────────────
    @PostMapping("/pdf-to-word")
    public ResponseEntity<Resource> pdfToWord(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user,
            HttpServletRequest req) throws Exception {

        Path output = conversionService.convertPdfToDocx(file, user, req.getRemoteAddr());
        return buildFileResponse(output, "converted.docx",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    }

    // ── POST /api/convert/word-to-pdf ─────────────────────────────────────────
    @PostMapping("/word-to-pdf")
    public ResponseEntity<Resource> wordToPdf(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user,
            HttpServletRequest req) throws Exception {

        Path output = conversionService.convertDocxToPdf(file, user, req.getRemoteAddr());
        return buildFileResponse(output, "converted.pdf", MediaType.APPLICATION_PDF_VALUE);
    }

    // ── POST /api/convert/pdf-to-jpg ──────────────────────────────────────────
    @PostMapping("/pdf-to-jpg")
    public ResponseEntity<Resource> pdfToJpg(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user,
            HttpServletRequest req) throws Exception {

        Path output = conversionService.convertPdfToJpg(file, user, req.getRemoteAddr());
        return buildFileResponse(output, "converted.jpg", MediaType.IMAGE_JPEG_VALUE);
    }

    // ── POST /api/convert/jpg-to-pdf ──────────────────────────────────────────
    @PostMapping("/jpg-to-pdf")
    public ResponseEntity<Resource> jpgToPdf(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user,
            HttpServletRequest req) throws Exception {

        Path output = conversionService.convertJpgToPdf(file, user, req.getRemoteAddr());
        return buildFileResponse(output, "converted.pdf", MediaType.APPLICATION_PDF_VALUE);
    }

    // ── POST /api/convert/merge-pdf ───────────────────────────────────────────
    @PostMapping("/merge-pdf")
    public ResponseEntity<Resource> mergePdf(
            @RequestParam("files") List<MultipartFile> files,
            @AuthenticationPrincipal User user,
            HttpServletRequest req) throws Exception {

        if (files == null || files.size() < 2) {
            return ResponseEntity.badRequest().build();
        }
        Path output = conversionService.mergePdfs(files, user, req.getRemoteAddr());
        return buildFileResponse(output, "merged.pdf", MediaType.APPLICATION_PDF_VALUE);
    }

    // ── POST /api/convert/compress-pdf ────────────────────────────────────────
    @PostMapping("/compress-pdf")
    public ResponseEntity<Resource> compressPdf(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user,
            HttpServletRequest req) throws Exception {

        Path output = conversionService.compressPdf(file, user, req.getRemoteAddr());
        return buildFileResponse(output, "compressed.pdf", MediaType.APPLICATION_PDF_VALUE);
    }

    // ── Helper ────────────────────────────────────────────────────────────────
    private ResponseEntity<Resource> buildFileResponse(@NonNull Path path,@NonNull String filename, @NonNull String contentType)
            throws MalformedURLException {
        var uri = path.toUri();
        if (uri == null) {
            throw new MalformedURLException("URI cannot be null");
        }
        Resource resource = new UrlResource(uri);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + filename + "\"")
                .body(resource);
    }
}
