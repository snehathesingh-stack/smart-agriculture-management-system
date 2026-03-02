package com.smartagriculture.service;

import com.smartagriculture.response.YieldSummary;
import com.smartagriculture.entity.Crop;
import com.smartagriculture.entity.Farmer;
import com.smartagriculture.exception.ResourceNotFoundException;
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

    // CREATE Crop under Farmer
    public Crop addCrop(Long farmerId, Crop crop) {

        Farmer farmer = farmerRepository.findById(farmerId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Farmer not found with id: " + farmerId));

        crop.setFarmer(farmer);

        return cropRepository.save(crop);
    }

    // GET Crops with Pagination + Optional Season Filter
    public Page<Crop> getCrops(Long farmerId,
                               String season,
                               Pageable pageable) {

        if (!farmerRepository.existsById(farmerId)) {
            throw new ResourceNotFoundException(
                    "Farmer not found with id: " + farmerId);
        }

        if (season != null && !season.isEmpty()) {
            return cropRepository
                    .findByFarmerIdAndSeason(farmerId,
                            season,
                            pageable);
        }

        return cropRepository
                .findByFarmerId(farmerId,
                        pageable);
    }

    // CALCULATE Revenue
    public Double calculateTotalRevenue(Long farmerId) {

        if (!farmerRepository.existsById(farmerId)) {
            throw new ResourceNotFoundException(
                    "Farmer not found with id: " + farmerId);
        }

        List<Crop> crops = cropRepository
                .findByFarmerId(farmerId);

        return crops.stream()
                .mapToDouble(crop ->
                        crop.getActualYield() * crop.getMarketPrice())
                .sum();
    }

    // YIELD SUMMARY ANALYTICS
    public YieldSummary calculateYieldSummary(Long farmerId) {

        if (!farmerRepository.existsById(farmerId)) {
            throw new ResourceNotFoundException(
                    "Farmer not found with id: " + farmerId);
        }

        List<Crop> crops = cropRepository.findByFarmerId(farmerId);

        double totalExpected = crops.stream()
                .mapToDouble(Crop::getExpectedYield)
                .sum();

        double totalActual = crops.stream()
                .mapToDouble(Crop::getActualYield)
                .sum();

        double difference = totalActual - totalExpected;

        double performance = totalExpected == 0
                ? 0
                : (totalActual / totalExpected) * 100;

        return new YieldSummary(
                totalExpected,
                totalActual,
                difference,
                performance
        );
    }
}