package com.smartagriculture.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "crop")
public class Crop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(name = "crop_name")
    private String cropName;

    @NotBlank
    private String season;

    @NotNull
    @Positive
    @Column(name = "expected_yield")
    private Double expectedYield;

    @NotNull
    @Positive
    @Column(name = "actual_yield")
    private Double actualYield;

    @NotNull
    @Positive
    @Column(name = "market_price")
    private Double marketPrice;

    @ManyToOne
    @JoinColumn(name = "farmer_id", nullable = false)
    @JsonIgnore
    private Farmer farmer;

    // Getters & Setters

    public Long getId() { return id; }

    public String getCropName() { return cropName; }
    public void setCropName(String cropName) { this.cropName = cropName; }

    public String getSeason() { return season; }
    public void setSeason(String season) { this.season = season; }

    public Double getExpectedYield() { return expectedYield; }
    public void setExpectedYield(Double expectedYield) { this.expectedYield = expectedYield; }

    public Double getActualYield() { return actualYield; }
    public void setActualYield(Double actualYield) { this.actualYield = actualYield; }

    public Double getMarketPrice() { return marketPrice; }
    public void setMarketPrice(Double marketPrice) { this.marketPrice = marketPrice; }

    public Farmer getFarmer() { return farmer; }
    public void setFarmer(Farmer farmer) { this.farmer = farmer; }
}