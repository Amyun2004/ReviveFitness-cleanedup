package com.ReviveFitness.dto;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainerDTO {
    private Long id;
    private String imgUrl;
    private String name;
    private String title;
    private String bio;
    private List<String> achievements;
}