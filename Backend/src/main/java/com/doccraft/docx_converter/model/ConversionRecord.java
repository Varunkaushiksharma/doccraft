package com.doccraft.docx_converter.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "conversion_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConversionRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "original_filename", nullable = false)
    private String originalFilename;

    @Column(name = "converted_filename")
    private String convertedFilename;

    @Column(name = "from_format", nullable = false, length = 20)
    private String fromFormat;

    @Column(name = "to_format", nullable = false, length = 20)
    private String toFormat;

    @Column(name = "tool_id", nullable = false)
    private String toolId;

    @Column(name = "file_size_kb")
    private Long fileSizeKb;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.PENDING;

    @Column(name = "error_message", length = 1000)
    private String errorMessage;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Column(name = "output_path")
    private String outputPath;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public enum Status {
        PENDING, SUCCESS, FAILED
    }
}
