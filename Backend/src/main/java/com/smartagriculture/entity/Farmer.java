package com.smartagriculture.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "farmer")
public class Farmer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    private String phone;

    @NotBlank
    private String location;

    @NotNull
    private Double landArea;

    @NotBlank
    private String soilType;

    @OneToMany(mappedBy = "farmer", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Crop> crops;

    // Getters & Setters

    public Long getId() { return id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public Double getLandArea() { return landArea; }
    public void setLandArea(Double landArea) { this.landArea = landArea; }

    public String getSoilType() { return soilType; }
    public void setSoilType(String soilType) { this.soilType = soilType; }
}