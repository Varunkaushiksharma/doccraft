package com.doccraft.docx_converter.controller;

import com.doccraft.docx_converter.model.ConversionRecord;
import com.doccraft.docx_converter.model.User;
import com.doccraft.docx_converter.repo.ConversionRecordRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class HistoryController {

    private final ConversionRecordRepository recordRepo;

    // ── GET /api/history?page=0&size=10 ──────────────────────────────────────
    @GetMapping
    public ResponseEntity<?> getHistory(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        if (user == null) return ResponseEntity.status(401).build();

        Page<ConversionRecord> records = recordRepo
                .findByUserIdOrderByCreatedAtDesc(user.getId(), PageRequest.of(page, size));

        return ResponseEntity.ok(Map.of(
                "records", records.getContent().stream().map(r -> Map.of(
                        "id", r.getId(),
                        "originalFilename", r.getOriginalFilename(),
                        "fromFormat", r.getFromFormat(),
                        "toFormat", r.getToFormat(),
                        "toolId", r.getToolId(),
                        "fileSizeKb", r.getFileSizeKb(),
                        "status", r.getStatus(),
                        "createdAt", r.getCreatedAt().toString()
                )).toList(),
                "totalPages", records.getTotalPages(),
                "totalElements", records.getTotalElements(),
                "currentPage", page
        ));
    }

    // ── DELETE /api/history/{id} ──────────────────────────────────────────────
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRecord(
            @PathVariable Long id,
            @AuthenticationPrincipal User user) {

        if (user == null) return ResponseEntity.status(401).build();

        return recordRepo.findById(id)
                .filter(r -> r.getUser() != null && r.getUser().getId().equals(user.getId()))
                .map(r -> {
                    recordRepo.delete(r);
                    return ResponseEntity.ok(Map.of("message", "Deleted"));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
