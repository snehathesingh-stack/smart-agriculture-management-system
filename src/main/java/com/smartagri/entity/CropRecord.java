package com.smartagri.entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonBackReference;

@Entity
public class CropRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String crop;
    private String yieldValue;
    private String date;

    @ManyToOne
    @JoinColumn(name = "farmer_id")
    @JsonBackReference
    private Farmer farmer;

    // getters setters

    public Long getId() { return id; }

    public String getCrop() { return crop; }
    public void setCrop(String crop) { this.crop = crop; }

    public String getYieldValue() { return yieldValue; }
    public void setYieldValue(String yieldValue) { this.yieldValue = yieldValue; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public Farmer getFarmer() { return farmer; }
    public void setFarmer(Farmer farmer) { this.farmer = farmer; }
}