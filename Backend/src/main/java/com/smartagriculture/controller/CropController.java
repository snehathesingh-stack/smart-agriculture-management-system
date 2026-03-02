package com.smartagriculture.controller;

import com.smartagriculture.entity.Crop;
import com.smartagriculture.response.ApiResponse;
import com.smartagriculture.service.CropService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/farmers/{farmerId}/crops")
@CrossOrigin(origins = "*")
public class CropController {

    private final CropService cropService;

    public CropController(CropService cropService) {
        this.cropService = cropService;
    }

    // =============================
    // Add Crop
    // =============================
    @PostMapping
    public ApiResponse<Crop> addCrop(
            @PathVariable Long farmerId,
            @Valid @RequestBody Crop crop) {

        return new ApiResponse<>(
                200,
                "Crop added successfully",
                cropService.addCrop(farmerId, crop)
        );
    }

    // =============================
    // Get Crops (Paginated)
    // =============================
    @GetMapping
    public ApiResponse<Page<Crop>> getCrops(
            @PathVariable Long farmerId,
            Pageable pageable) {

        return new ApiResponse<>(
                200,
                "Crops fetched successfully",
                cropService.getCrops(farmerId, pageable)
        );
    }

    // =============================
    // Get Crops by Season
    // =============================
    @GetMapping("/season")
    public ApiResponse<Page<Crop>> getCropsBySeason(
            @PathVariable Long farmerId,
            @RequestParam String season,
            Pageable pageable) {

        return new ApiResponse<>(
                200,
                "Seasonal crops fetched successfully",
                cropService.getCropsBySeason(farmerId,
                        season,
                        pageable)
        );
    }

    // =============================
    // Delete Crop
    // =============================
    @DeleteMapping("/{cropId}")
    public ApiResponse<String> deleteCrop(
            @PathVariable Long cropId) {

        cropService.deleteCrop(cropId);

        return new ApiResponse<>(
                200,
                "Crop deleted successfully",
                null
        );
    }

    // =============================
    // Revenue Summary
    // =============================
    @GetMapping("/revenue-summary")
    public ApiResponse<Double> getRevenue(
            @PathVariable Long farmerId) {

        return new ApiResponse<>(
                200,
                "Total revenue calculated",
                cropService.calculateTotalRevenue(farmerId)
        );
    }

    // =============================
    // Yield Summary
    // =============================
    @GetMapping("/yield-summary")
    public ApiResponse<Double> getYield(
            @PathVariable Long farmerId) {

        return new ApiResponse<>(
                200,
                "Total yield calculated",
                cropService.calculateTotalYield(farmerId)
        );
    }
}