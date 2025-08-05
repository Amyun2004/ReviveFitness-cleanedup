package com.ReviveFitness.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MemberLoginRequest {
    private String email;
    private String password;
}
