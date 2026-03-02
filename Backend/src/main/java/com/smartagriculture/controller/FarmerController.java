package com.smartagriculture.controller;

import com.smartagriculture.entity.Farmer;
import com.smartagriculture.response.ApiResponse;
import com.smartagriculture.service.FarmerService;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/farmers")
public class FarmerController {

    private final FarmerService farmerService;

    public FarmerController(FarmerService farmerService) {
        this.farmerService = farmerService;
    }

    // =========================
    // CREATE Farmer
    // =========================
    @PostMapping
    public ResponseEntity<ApiResponse<Farmer>> addFarmer(
            @Valid @RequestBody Farmer farmer) {

        Farmer savedFarmer = farmerService.saveFarmer(farmer);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Farmer created successfully",
                        savedFarmer
                )
        );
    }

    // =========================
    // GET All Farmers
    // =========================
    @GetMapping
    public ResponseEntity<ApiResponse<List<Farmer>>> getAllFarmers() {

        List<Farmer> farmers = farmerService.getAllFarmers();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Farmers fetched successfully",
                        farmers
                )
        );
    }

    // =========================
    // GET Farmers with Pagination
    // =========================
    @GetMapping("/paginated")
    public ResponseEntity<ApiResponse<Page<Farmer>>> getFarmersPaginated(
            Pageable pageable) {

        Page<Farmer> farmerPage = farmerService.getFarmers(pageable);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Farmers fetched with pagination",
                        farmerPage
                )
        );
    }

    // =========================
    // DELETE Farmer
    // =========================
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteFarmer(
            @PathVariable Long id) {

        farmerService.deleteFarmer(id);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Farmer deleted successfully",
                        null
                )
        );
    }

    // =========================
    // UPDATE Farmer
    // =========================
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Farmer>> updateFarmer(
            @PathVariable Long id,
            @Valid @RequestBody Farmer farmer) {

        Farmer updatedFarmer = farmerService.updateFarmer(id, farmer);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        200,
                        "Farmer updated successfully",
                        updatedFarmer
                )
        );
    }
}