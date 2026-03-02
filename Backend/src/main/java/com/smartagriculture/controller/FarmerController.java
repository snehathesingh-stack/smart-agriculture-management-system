package com.smartagriculture.controller;

import com.smartagriculture.entity.Farmer;
import com.smartagriculture.repository.FarmerRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/farmers")
@CrossOrigin(origins = "*")
public class FarmerController {

    private final FarmerRepository farmerRepository;

    public FarmerController(FarmerRepository farmerRepository) {
        this.farmerRepository = farmerRepository;
    }

    @PostMapping
    public Farmer addFarmer(@RequestBody Farmer farmer) {
        return farmerRepository.save(farmer);
    }

    @GetMapping
    public List<Farmer> getAllFarmers() {
        return farmerRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public void deleteFarmer(@PathVariable Long id) {
        farmerRepository.deleteById(id);
    }
}