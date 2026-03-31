package com.smartagri.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
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
}