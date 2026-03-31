package com.smartagri.controller;

import com.smartagri.entity.Farmer;
import com.smartagri.service.FarmerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/farmers")
@CrossOrigin(origins = "*")
public class FarmerController {

    private final FarmerService farmerService;

    public FarmerController(FarmerService farmerService) {
        this.farmerService = farmerService;
    }

    // GET all farmers (admin)
    @GetMapping
    public List<Farmer> getFarmers() {
        return farmerService.getAll();
    }

    // POST add farmer (admin adds)
    @PostMapping
    public Farmer addFarmer(@RequestBody Farmer farmer) {
        return farmerService.save(farmer);
    }

    // GET single farmer by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getFarmer(@PathVariable Long id) {
        return farmerService.getById(id)
                .map(f -> ResponseEntity.ok(f))
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE farmer
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFarmer(@PathVariable Long id) {
        farmerService.delete(id);
        return ResponseEntity.ok(Map.of("message", "Farmer deleted"));
    }
}