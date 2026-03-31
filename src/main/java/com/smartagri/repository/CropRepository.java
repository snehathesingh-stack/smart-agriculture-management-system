package com.smartagri.repository;

import com.smartagri.entity.CropRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CropRepository extends JpaRepository<CropRecord, Long> {
    List<CropRecord> findByFarmerId(Long farmerId);
}