package com.smartagri.controller;

import com.smartagri.entity.CropRecord;
import com.smartagri.entity.Farmer;
import com.smartagri.repository.CropRepository;
import com.smartagri.repository.FarmerRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class CropController {

    private final CropRepository cropRepo;
    private final FarmerRepository farmerRepo;

    public CropController(CropRepository cropRepo, FarmerRepository farmerRepo) {
        this.cropRepo = cropRepo;
        this.farmerRepo = farmerRepo;
    }

    // ✅ Add crop for a farmer
    @PostMapping("/crops/{farmerId}")
    public ResponseEntity<?> addCrop(@PathVariable Long farmerId, @RequestBody CropRecord crop) {
        Farmer farmer = farmerRepo.findById(farmerId).orElse(null);
        if (farmer == null) return ResponseEntity.notFound().build();
        crop.setFarmer(farmer);
        crop.setDate(LocalDate.now().toString());
        return ResponseEntity.ok(cropRepo.save(crop));
    }

    // ✅ Get crops for a farmer
    @GetMapping("/crops/{farmerId}")
    public List<CropRecord> getCrops(@PathVariable Long farmerId) {
        return cropRepo.findByFarmerId(farmerId);
    }

    // ✅ Crop suggestions based on soil type
    @GetMapping("/suggestions/{soilType}")
    public ResponseEntity<?> getSuggestions(@PathVariable String soilType) {
        Map<String, List<Map<String,String>>> map = Map.of(
                "Red Laterite", List.of(
                        Map.of("crop","Groundnut","yield","1.2–1.6 T/acre","season","Kharif","water","Medium"),
                        Map.of("crop","Paddy","yield","3.2–4.0 T/acre","season","Kharif","water","High"),
                        Map.of("crop","Ragi","yield","0.8–1.2 T/acre","season","Kharif","water","Low"),
                        Map.of("crop","Tomato","yield","8–12 T/acre","season","Rabi","water","Medium")
                ),
                "Black Cotton", List.of(
                        Map.of("crop","Cotton","yield","0.4–0.6 T/acre","season","Kharif","water","Medium"),
                        Map.of("crop","Sorghum","yield","1.8–2.4 T/acre","season","Kharif","water","Low"),
                        Map.of("crop","Chickpea","yield","0.6–0.9 T/acre","season","Rabi","water","Low"),
                        Map.of("crop","Sunflower","yield","0.9–1.1 T/acre","season","Rabi","water","Low")
                ),
                "Alluvial", List.of(
                        Map.of("crop","Wheat","yield","3.2–4.0 T/acre","season","Rabi","water","Medium"),
                        Map.of("crop","Sugarcane","yield","35–50 T/acre","season","Kharif","water","High"),
                        Map.of("crop","Rice","yield","3.5–4.5 T/acre","season","Kharif","water","High"),
                        Map.of("crop","Potato","yield","12–18 T/acre","season","Rabi","water","Medium")
                ),
                "Sandy Loam", List.of(
                        Map.of("crop","Groundnut","yield","1.4–1.8 T/acre","season","Kharif","water","Medium"),
                        Map.of("crop","Watermelon","yield","15–20 T/acre","season","Zaid","water","Medium"),
                        Map.of("crop","Cowpea","yield","0.5–0.8 T/acre","season","Kharif","water","Low"),
                        Map.of("crop","Sesame","yield","0.4–0.6 T/acre","season","Kharif","water","Low")
                ),
                "Clay", List.of(
                        Map.of("crop","Paddy","yield","3.5–4.5 T/acre","season","Kharif","water","High"),
                        Map.of("crop","Jute","yield","2.0–3.0 T/acre","season","Kharif","water","High"),
                        Map.of("crop","Sugarcane","yield","38–52 T/acre","season","Kharif","water","High"),
                        Map.of("crop","Taro","yield","8–12 T/acre","season","Kharif","water","High")
                )
        );

        List<Map<String,String>> result = map.getOrDefault(soilType, map.get("Red Laterite"));
        return ResponseEntity.ok(Map.of("soil", soilType, "suggestions", result));
    }
}