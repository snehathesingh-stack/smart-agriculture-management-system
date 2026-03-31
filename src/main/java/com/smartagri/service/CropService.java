package com.smartagri.service;

import com.smartagri.entity.CropRecord;
import com.smartagri.entity.Farmer;
import com.smartagri.repository.CropRepository;
import com.smartagri.repository.FarmerRepository;
import org.springframework.stereotype.Service;

@Service
public class CropService {

    private final CropRepository cropRepo;
    private final FarmerRepository farmerRepo;

    public CropService(CropRepository cropRepo, FarmerRepository farmerRepo) {
        this.cropRepo = cropRepo;
        this.farmerRepo = farmerRepo;
    }

    public CropRecord addCrop(Long farmerId, CropRecord crop) {
        Farmer farmer = farmerRepo.findById(farmerId).orElseThrow();
        crop.setFarmer(farmer);
        return cropRepo.save(crop);
    }
}
