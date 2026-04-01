package com.smartagri.entity;

import jakarta.persistence.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
public class Farmer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String location;
    private String soilType;
    private Double landSize;

    @OneToMany(mappedBy = "farmer", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<CropRecord> crops;

    // ── Getters ──────────────────────────────
    public Long getId()         { return id; }
    public String getName()     { return name; }
    public String getLocation() { return location; }
    public String getSoilType() { return soilType; }
    public Double getLandSize() { return landSize; }
    public List<CropRecord> getCrops() { return crops; }

    // ── Setters ──────────────────────────────
    public void setId(Long id)             { this.id = id; }
    public void setName(String name)       { this.name = name; }
    public void setLocation(String loc)    { this.location = loc; }
    public void setSoilType(String soil)   { this.soilType = soil; }
    public void setLandSize(Double size)   { this.landSize = size; }
    public void setCrops(List<CropRecord> crops) { this.crops = crops; }
}