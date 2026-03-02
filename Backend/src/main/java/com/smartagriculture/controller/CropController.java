package com.smartagriculture.controller;

import com.smartagriculture.entity.Crop;
import com.smartagriculture.service.CropService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/farmers/{farmerId}/crops")
@CrossOrigin(origins = "*")
public class CropController {

    private final CropService cropService;

    public CropController(CropService cropService) {
        this.cropService = cropService;
    }

    @PostMapping
    public Crop addCrop(@PathVariable Long farmerId,
                        @RequestBody Crop crop) {
        return cropService.addCrop(farmerId, crop);
    }

    @GetMapping
    public List<Crop> getCrops(@PathVariable Long farmerId) {
        return cropService.getCropsByFarmer(farmerId);
    }

    @GetMapping("/revenue")
    public Double getRevenue(@PathVariable Long farmerId) {
        return cropService.calculateRevenue(farmerId);
    }
}