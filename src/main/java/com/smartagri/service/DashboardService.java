package com.smartagri.service;

import com.smartagri.repository.CropRepository;
import com.smartagri.repository.FarmerRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    private final FarmerRepository farmerRepository;
    private final CropRepository cropRepository;

    public DashboardService(FarmerRepository farmerRepository, CropRepository cropRepository) {
        this.farmerRepository = farmerRepository;
        this.cropRepository = cropRepository;
    }

    public Map<String, Object> getStats() {
        Map<String, Object> data = new HashMap<>();
        data.put("totalFarmers", farmerRepository.count());
        data.put("totalCrops", cropRepository.count());
        data.put("avgTemperature", 29.5);
        return data;
    }
}