package com.doccraft.docx_converter.repo;

import com.doccraft.docx_converter.model.ConversionRecord;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ConversionRecordRepository extends JpaRepository<ConversionRecord, Long> {

    Page<ConversionRecord> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    List<ConversionRecord> findByExpiresAtBefore(LocalDateTime now);
}
