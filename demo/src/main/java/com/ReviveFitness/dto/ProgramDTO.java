package com.ReviveFitness.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@Builder
public class ProgramDTO {
    private Long id;
    private String name;
    private String description;
    private String imgUrl;
    private String cost;
    private String duration;

    public ProgramDTO(Long id, String name, String description, String imgUrl, String cost, String duration){

        this.id = id;
        this.name = name;
        this.description = description;
        this.imgUrl = imgUrl;
        this.cost = cost;
        this.duration = duration;
    }
}