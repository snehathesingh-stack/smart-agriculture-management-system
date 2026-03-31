package com.smartagri.service;

import com.smartagri.entity.Farmer;
import com.smartagri.repository.FarmerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FarmerService {

    private final FarmerRepository farmerRepository;

    public FarmerService(FarmerRepository farmerRepository) {
        this.farmerRepository = farmerRepository;
    }

    public Farmer save(Farmer farmer) {
        return farmerRepository.save(farmer);
    }

    public List<Farmer> getAll() {
        return farmerRepository.findAll();
    }

    public Optional<Farmer> getById(Long id) {
        return farmerRepository.findById(id);
    }

    public void delete(Long id) {
        farmerRepository.deleteById(id);
    }
}