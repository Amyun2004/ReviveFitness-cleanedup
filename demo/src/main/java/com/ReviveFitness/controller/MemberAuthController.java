package com.ReviveFitness.controller;

import com.ReviveFitness.dto.MemberLoginRequest;
import com.ReviveFitness.model.Member;
import com.ReviveFitness.security.JwtProvider;
import com.ReviveFitness.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/members")
public class MemberAuthController {

    @Autowired private MemberService memberService;
    @Autowired private JwtProvider jwtProvider;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody MemberLoginRequest req) {
        try {
            // authenticate or throw
            Member m = memberService.authenticate(req.getEmail(), req.getPassword());

            // issue a JWT—using email as the subject
            String token = jwtProvider.generateToken(m.getEmail());

            // update last login timestamp (optional)
            memberService.updateLastLogin(m.getId());

            // return token + profile info
            return ResponseEntity.ok(Map.of(
                "token", token,
                "id",    m.getId(),
                "email", m.getEmail(),
                "name",  m.getName(),
                "joinDate", m.getJoinDate().toString()
            ));
        } catch (BadCredentialsException ex) {
            return ResponseEntity
                   .status(HttpStatus.UNAUTHORIZED)
                   .body(Map.of("error", "Invalid email or password"));
        }
    }
}
