package com.smartagriculture.controller;

import com.smartagriculture.entity.Crop;
import com.smartagriculture.response.ApiResponse;
import com.smartagriculture.response.YieldSummary;
import com.smartagriculture.service.CropService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/farmers/{farmerId}/crops")
public class CropController {

    private final CropService cropService;

    public CropController(CropService cropService) {
        this.cropService = cropService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Crop>> addCrop(
            @PathVariable Long farmerId,
            @Valid @RequestBody Crop crop) {

        Crop savedCrop = cropService.addCrop(farmerId, crop);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Crop added successfully",
                        savedCrop
                )
        );
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Crop>>> getCrops(
            @PathVariable Long farmerId,
            @RequestParam(required = false) String season,
            Pageable pageable) {

        Page<Crop> crops =
                cropService.getCrops(farmerId, season, pageable);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Crops fetched successfully",
                        crops
                )
        );
    }

    @GetMapping("/revenue")
    public ResponseEntity<ApiResponse<Double>> getRevenue(
            @PathVariable Long farmerId) {

        Double revenue =
                cropService.calculateTotalRevenue(farmerId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Total revenue calculated successfully",
                        revenue
                )
        );
    }

    @GetMapping("/yield-summary")
    public ResponseEntity<ApiResponse<YieldSummary>> getYieldSummary(
            @PathVariable Long farmerId) {

        YieldSummary summary =
                cropService.calculateYieldSummary(farmerId);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Yield summary calculated successfully",
                        summary
                )
        );
    }
}