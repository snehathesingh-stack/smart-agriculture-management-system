package com.smartagriculture.service;

import com.smartagriculture.entity.Farmer;
import com.smartagriculture.exception.ResourceNotFoundException;
import com.smartagriculture.repository.FarmerRepository;

import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Service
public class FarmerService {

    private final FarmerRepository farmerRepository;

    public FarmerService(FarmerRepository farmerRepository) {
        this.farmerRepository = farmerRepository;
    }

    // =========================
    // SAVE Farmer
    // =========================
    public Farmer saveFarmer(Farmer farmer) {
        return farmerRepository.save(farmer);
    }

    // =========================
    // GET All Farmers
    // =========================
    public List<Farmer> getAllFarmers() {
        return farmerRepository.findAll();
    }

    // =========================
    // GET Farmers with Pagination
    // =========================
    public Page<Farmer> getFarmers(Pageable pageable) {
        return farmerRepository.findAll(pageable);
    }

    // =========================
    // DELETE Farmer
    // =========================
    public void deleteFarmer(Long id) {

        Farmer farmer = farmerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Farmer not found with id: " + id)
                );

        farmerRepository.delete(farmer);
    }

    // =========================
    // UPDATE Farmer
    // =========================
    public Farmer updateFarmer(Long id, Farmer farmerDetails) {

        Farmer farmer = farmerRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Farmer not found with id: " + id)
                );

        farmer.setName(farmerDetails.getName());
        farmer.setPhone(farmerDetails.getPhone());
        farmer.setLocation(farmerDetails.getLocation());
        farmer.setLandArea(farmerDetails.getLandArea());
        farmer.setSoilType(farmerDetails.getSoilType());

        return farmerRepository.save(farmer);
    }
}