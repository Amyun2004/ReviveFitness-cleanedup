package com.ReviveFitness.controller;

import com.ReviveFitness.dto.MemberDTO;
import com.ReviveFitness.dto.ProgramDTO;
import com.ReviveFitness.dto.CurrentChallengeDTO;
import com.ReviveFitness.model.Member;
import com.ReviveFitness.repository.MemberRepository;
import com.ReviveFitness.service.MemberService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/members")
public class MemberController {

    @Autowired
    private MemberService memberService;

    @Autowired
    private MemberRepository memberRepository;


    // ==== LOGIN ====

    public static class LoginRequest {
        public String email;
        public String password;
    }

    // @PostMapping("/login")
    public ResponseEntity<MemberDTO> login(@RequestBody LoginRequest req) {
        Member m = memberRepository.findByEmail(req.email)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (!m.getPassword().equals(req.password)) {
            throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        MemberDTO dto = new MemberDTO(
            m.getId(),
            m.getName(),
            m.getEmail(),
            m.getJoinDate()
        );
        return ResponseEntity.ok(dto);
    }


    // ==== PROGRAMS ====

    @PostMapping("/{memberId}/programs/{programId}")
    public ResponseEntity<Void> enrollInProgram(
        @PathVariable Long memberId,
        @PathVariable Long programId) {
      memberService.enrollInProgram(memberId, programId);
      return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{memberId}/programs/{programId}")
    public ResponseEntity<Void> leaveProgram(
        @PathVariable Long memberId,
        @PathVariable Long programId) {
      memberService.leaveProgram(memberId, programId);
      return ResponseEntity.noContent().build();
    }

    @GetMapping("/{memberId}/programs")
    public ResponseEntity<List<ProgramDTO>> listMemberPrograms(
        @PathVariable Long memberId) {
      List<ProgramDTO> dtos = memberService.getMemberPrograms(memberId).stream()
        .map(p -> new ProgramDTO(
            p.getId(),
            p.getName(),
            p.getDescription(),
            p.getImageUrl(),
            p.getDuration(),
            p.getBenefits()
        ))
        .collect(Collectors.toList());
      return ResponseEntity.ok(dtos);
    }


    // ==== CHALLENGES ====

    @PostMapping("/{memberId}/challenges/{challengeId}")
    public ResponseEntity<Void> joinChallenge(
        @PathVariable Long memberId,
        @PathVariable Long challengeId) {
      memberService.joinChallenge(memberId, challengeId);
      return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{memberId}/challenges/{challengeId}")
    public ResponseEntity<Void> leaveChallenge(
        @PathVariable Long memberId,
        @PathVariable Long challengeId) {
      memberService.leaveChallenge(memberId, challengeId);
      return ResponseEntity.noContent().build();
    }

    @GetMapping("/{memberId}/challenges")
    public ResponseEntity<List<CurrentChallengeDTO>> listMemberChallenges(
        @PathVariable Long memberId) {
      List<CurrentChallengeDTO> dtos = memberService.getMemberChallenges(memberId).stream()
        .map(c -> new CurrentChallengeDTO(
            c.getId(),
            c.getTitle(),
            c.getDescription(),
            c.getImageUrl()
        ))
        .collect(Collectors.toList());
      return ResponseEntity.ok(dtos);
    }


    // ==== PROFILE PHOTO UPLOAD ====

    @PostMapping("/{id}/upload-photo")
    public ResponseEntity<?> uploadProfilePhoto(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) {
        try {
            String photoUrl = memberService.saveProfilePhoto(id, file);
            return ResponseEntity.ok(Map.of("photoUrl", photoUrl));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                                 .body(Map.of("message", e.getReason()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body(Map.of("message", "Failed to upload photo"));
        }
    }
}
