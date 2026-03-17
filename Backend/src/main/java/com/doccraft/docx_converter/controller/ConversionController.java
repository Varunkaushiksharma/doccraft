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

    // for uptimerobot so render server should never sleep
    @GetMapping("/health")
    public String health(){
        return "OK";
    }

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

      // Splits every page into its own PDF and returns a ZIP file.
    @PostMapping("/split-pdf")
    public ResponseEntity<Resource> splitPdf(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user,
            HttpServletRequest req) throws Exception {
 
        Path output = conversionService.splitPdf(file, user, req.getRemoteAddr());
        return buildFileResponse(output, "split_pages.zip", "application/zip");
    }
 
    // ── POST /api/convert/split-pdf-range ─────────────────────────────────────
    // Splits a specific page range and returns a single PDF.
    // Body params: startPage (int), endPage (int)
    @PostMapping("/split-pdf-range")
    public ResponseEntity<Resource> splitPdfByRange(
            @RequestParam("file") MultipartFile file,
            @RequestParam("startPage") int startPage,
            @RequestParam("endPage") int endPage,
            @AuthenticationPrincipal User user,
            HttpServletRequest req) throws Exception {
 
        Path output = conversionService.splitPdfByRange(file, startPage, endPage, user, req.getRemoteAddr());
        return buildFileResponse(output, "split.pdf", MediaType.APPLICATION_PDF_VALUE);
    }
 
    // ── POST /api/convert/rotate-pdf ─────────────────────────────────────────
    // Rotates pages of a PDF.
    // Body params:
    //   degrees   : 90 | 180 | 270
    //   pageTarget: "all"  OR  comma-separated 1-indexed page numbers e.g. "1,3,5"
    @PostMapping("/rotate-pdf")
    public ResponseEntity<Resource> rotatePdf(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "degrees", defaultValue = "90") int degrees,
            @RequestParam(value = "pageTarget", defaultValue = "all") String pageTarget,
            @AuthenticationPrincipal User user,
            HttpServletRequest req) throws Exception {
 
        Path output = conversionService.rotatePdf(file, degrees, pageTarget, user, req.getRemoteAddr());
        return buildFileResponse(output, "rotated.pdf", MediaType.APPLICATION_PDF_VALUE);
    }
 
    // ── POST /api/convert/protect-pdf ────────────────────────────────────────
    // Password-protects a PDF.
    // Body params:
    //   userPassword  : password required to open the file (required)
    //   ownerPassword : password required to change permissions (optional)
    @PostMapping("/protect-pdf")
    public ResponseEntity<Resource> protectPdf(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userPassword") String userPassword,
            @RequestParam(value = "ownerPassword", defaultValue = "") String ownerPassword,
            @AuthenticationPrincipal User user,
            HttpServletRequest req) throws Exception {
 
        Path output = conversionService.passwordProtectPdf(file, userPassword, ownerPassword, user, req.getRemoteAddr());
        return buildFileResponse(output, "protected.pdf", MediaType.APPLICATION_PDF_VALUE);
    }

      // ── POST /api/convert/pdf-to-excel ────────────────────────────────────────
    @PostMapping("/pdf-to-excel")
    public ResponseEntity<Resource> pdfToExcel(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User user,
            HttpServletRequest req) throws Exception {
 
        Path output = conversionService.convertPdfToExcel(file, user, req.getRemoteAddr());
        return buildFileResponse(output, "converted.xlsx",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
    }
 
    // ── POST /api/convert/unlock-pdf ──────────────────────────────────────────
    // Body params:
    //   password: the current PDF password (optional — tries empty string if blank)
    @PostMapping("/unlock-pdf")
    public ResponseEntity<Resource> unlockPdf(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "password", defaultValue = "") String password,
            @AuthenticationPrincipal User user,
            HttpServletRequest req) throws Exception {
 
        Path output = conversionService.unlockPdf(file, password, user, req.getRemoteAddr());
        return buildFileResponse(output, "unlocked.pdf", MediaType.APPLICATION_PDF_VALUE);
    }
}
