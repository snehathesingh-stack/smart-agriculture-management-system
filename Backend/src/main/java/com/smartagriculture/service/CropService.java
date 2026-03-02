package com.smartagriculture.service;

import com.smartagriculture.entity.Crop;
import com.smartagriculture.entity.Farmer;
import com.smartagriculture.repository.CropRepository;
import com.smartagriculture.repository.FarmerRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CropService {

    private final CropRepository cropRepository;
    private final FarmerRepository farmerRepository;

    public CropService(CropRepository cropRepository,
                       FarmerRepository farmerRepository) {
        this.cropRepository = cropRepository;
        this.farmerRepository = farmerRepository;
    }

    // =============================
    // Add Crop
    // =============================
    public Crop addCrop(Long farmerId, Crop crop) {

        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        crop.setFarmer(farmer);

        return cropRepository.save(crop);
    }

    // =============================
    // Get Crops (Paginated)
    // =============================
    public Page<Crop> getCrops(Long farmerId, Pageable pageable) {
        return cropRepository.findByFarmerId(farmerId, pageable);
    }

    // =============================
    // Get Crops by Season
    // =============================
    public Page<Crop> getCropsBySeason(Long farmerId,
                                       String season,
                                       Pageable pageable) {

        return cropRepository.findByFarmerIdAndSeason(farmerId,
                season,
                pageable);
    }

    // =============================
    // Delete Crop
    // =============================
    public void deleteCrop(Long cropId) {
        cropRepository.deleteById(cropId);
    }

    // =============================
    // Calculate Total Revenue
    // =============================
    public Double calculateTotalRevenue(Long farmerId) {

        List<Crop> crops = cropRepository.findByFarmerId(farmerId);

        return crops.stream()
                .mapToDouble(crop ->
                        crop.getActualYield() * crop.getMarketPrice())
                .sum();
    }

    // =============================
    // Calculate Total Yield
    // =============================
    public Double calculateTotalYield(Long farmerId) {

        List<Crop> crops = cropRepository.findByFarmerId(farmerId);

        return crops.stream()
                .mapToDouble(Crop::getActualYield)
                .sum();
    }
}