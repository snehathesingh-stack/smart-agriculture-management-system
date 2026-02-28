package com.smartagriculture.repository;

import com.smartagriculture.entity.Crop;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CropRepository extends JpaRepository<Crop, Long> {

    // For pagination
    Page<Crop> findByFarmerId(Long farmerId, Pageable pageable);

    // For seasonal filter
    Page<Crop> findByFarmerIdAndSeason(Long farmerId,
                                       String season,
                                       Pageable pageable);

    // For revenue calculation (non-paginated)
    List<Crop> findByFarmerId(Long farmerId);
}