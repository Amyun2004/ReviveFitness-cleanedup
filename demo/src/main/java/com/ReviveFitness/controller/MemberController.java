package com.ReviveFitness.controller;

import com.ReviveFitness.model.Member;
import com.ReviveFitness.dto.ProgramDTO;
import com.ReviveFitness.service.MemberService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile; // Added this import
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RestController
@RequestMapping("/api/members")
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @GetMapping
    public List<Member> getAllMembers() {
        List<Member> members = memberService.getAllMembers();
        members.forEach(m -> m.setPassword(null));
        return members;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Member> getMemberById(@PathVariable Long id) {
        Optional<Member> member = memberService.getMemberById(id);
        return member.map(m -> {
            m.setPassword(null);
            return ResponseEntity.ok(m);
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get programs for a specific member
    @GetMapping("/{id}/programs")
    public ResponseEntity<List<ProgramDTO>> getMemberPrograms(@PathVariable Long id) {
        try {
            List<ProgramDTO> programs = memberService.getMemberPrograms(id);
            return ResponseEntity.ok(programs);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createMember(@Valid @RequestBody Member member) {
        try {
            Member created = memberService.createMember(member);
            created.setPassword(null); // Don't return password
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            // Return specific error message
            return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "An error occurred while creating the account"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Member> updateMember(@PathVariable Long id, @Valid @RequestBody Member member) {
        try {
            Member updated = memberService.updateMember(id, member);
            updated.setPassword(null);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMember(@PathVariable Long id) {
        try {
            memberService.deleteMember(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginMember(@RequestBody Map<String, String> loginData) {
        String email = loginData.get("email");
        String password = loginData.get("password");

        Optional<Member> memberOptional = memberService.authenticateMember(email, password);

        if (memberOptional.isPresent()) {
            Member member = memberOptional.get();
            member.setPassword(null);
            return ResponseEntity.ok(member);
        }

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Collections.singletonMap("message", "Invalid email or password."));
    }

    @PutMapping("/{id}/programs")
    public ResponseEntity<?> updateMemberPrograms(
            @PathVariable Long id, 
            @RequestBody List<Long> programIds) {
        try {
            memberService.updateMemberPrograms(id, programIds);
            List<ProgramDTO> updatedPrograms = memberService.getMemberPrograms(id);
            return ResponseEntity.ok(updatedPrograms);
        } catch (RuntimeException e) {
            return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Failed to update programs"));
        }
    }

    @PostMapping("/{id}/upload-photo")
    public ResponseEntity<?> uploadProfilePhoto(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        try {
            String photoUrl = memberService.saveProfilePhoto(id, file);
            return ResponseEntity.ok(Map.of("photoUrl", photoUrl));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", "Failed to upload photo"));
        }
    }
}