package com.ReviveFitness.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminLoginResponse {
    private Long id;
    private String adminId;
    private String name;
    private String email;
    private String role;
    private String message;
}