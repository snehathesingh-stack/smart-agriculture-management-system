package com.smartagriculture.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Entity
public class Crop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Crop name is required")
    private String cropName;

    @NotBlank(message = "Season is required")
    private String season;

    @NotNull(message = "Expected yield is required")
    @Positive(message = "Expected yield must be positive")
    private Double expectedYield;

    @NotNull(message = "Actual yield is required")
    @Positive(message = "Actual yield must be positive")
    private Double actualYield;

    @NotNull(message = "Market price is required")
    @Positive(message = "Market price must be positive")
    private Double marketPrice;

    @ManyToOne
    @JoinColumn(name = "farmer_id")
    private Farmer farmer;

    // Getters & Setters

    public Long getId() {
        return id;
    }

    public String getCropName() {
        return cropName;
    }

    public void setCropName(String cropName) {
        this.cropName = cropName;
    }

    public String getSeason() {
        return season;
    }

    public void setSeason(String season) {
        this.season = season;
    }

    public Double getExpectedYield() {
        return expectedYield;
    }

    public void setExpectedYield(Double expectedYield) {
        this.expectedYield = expectedYield;
    }

    public Double getActualYield() {
        return actualYield;
    }

    public void setActualYield(Double actualYield) {
        this.actualYield = actualYield;
    }

    public Double getMarketPrice() {
        return marketPrice;
    }

    public void setMarketPrice(Double marketPrice) {
        this.marketPrice = marketPrice;
    }

    public Farmer getFarmer() {
        return farmer;
    }

    public void setFarmer(Farmer farmer) {
        this.farmer = farmer;
    }
}