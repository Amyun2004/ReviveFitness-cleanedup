package com.ReviveFitness.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminLoginRequest {
    private String adminId;
    private String password;
}