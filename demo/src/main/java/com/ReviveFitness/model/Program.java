package com.ReviveFitness.model;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "programs")
public class Program {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // FIX: Changed 'title' to 'name' to match the database column
    private String name;

    private String description;

    private String duration;

    private String benefits;

    private String imageUrl;
}