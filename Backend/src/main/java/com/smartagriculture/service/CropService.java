package com.smartagriculture.service;

import com.smartagriculture.entity.Crop;
import com.smartagriculture.entity.Farmer;
import com.smartagriculture.repository.CropRepository;
import com.smartagriculture.repository.FarmerRepository;
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

    public Crop addCrop(Long farmerId, Crop crop) {
        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));

        crop.setFarmer(farmer);
        return cropRepository.save(crop);
    }

    public List<Crop> getCropsByFarmer(Long farmerId) {
        return cropRepository.findByFarmerId(farmerId);
    }

    public Double calculateRevenue(Long farmerId) {
        List<Crop> crops = cropRepository.findByFarmerId(farmerId);

        return crops.stream()
                .mapToDouble(c ->
                        c.getActualYield() * c.getMarketPrice())
                .sum();
    }
}