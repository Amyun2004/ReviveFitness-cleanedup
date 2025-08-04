package com.ReviveFitness.dto;

import java.time.LocalDate;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@Builder
public class MemberDTO {
    
    private Long id;
    private String name;
    private String email;
    private LocalDate joinDate;

    public MemberDTO(Long id, String name, String email, LocalDate joinDate){
        this.id = id;
        this.name = name;
        this.email = email;
        this.joinDate = joinDate;
    }

}
