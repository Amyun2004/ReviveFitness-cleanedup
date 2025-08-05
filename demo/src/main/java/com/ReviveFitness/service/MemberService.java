package com.ReviveFitness.service;

import com.ReviveFitness.model.Member;
import com.ReviveFitness.model.Program;
import com.ReviveFitness.model.CurrentChallenge;
import com.ReviveFitness.repository.MemberRepository;
import com.ReviveFitness.repository.ProgramRepository;
import com.ReviveFitness.repository.CurrentChallengeRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class MemberService {

    @Autowired
    private MemberRepository memberRepo;

    @Autowired
    private ProgramRepository programRepo;

    @Autowired
    private CurrentChallengeRepository challengeRepo;

    @Transactional
    public void enrollInProgram(Long memberId, Long programId) {
        Member m = memberRepo.findById(memberId)
            .orElseThrow(() -> new EntityNotFoundException("Member not found"));
        Program p = programRepo.findById(programId)
            .orElseThrow(() -> new EntityNotFoundException("Program not found"));
        m.getPrograms().add(p);
        memberRepo.save(m);
    }

    @Transactional
    public void leaveProgram(Long memberId, Long programId) {
        Member m = memberRepo.findById(memberId)
            .orElseThrow(() -> new EntityNotFoundException("Member not found"));
        Program p = programRepo.findById(programId)
            .orElseThrow(() -> new EntityNotFoundException("Program not found"));
        m.getPrograms().remove(p);
        memberRepo.save(m);
    }

    @Transactional
    public List<Program> getMemberPrograms(Long memberId) {
        return memberRepo.findById(memberId)
            .map(mem -> new ArrayList<>(mem.getPrograms()))
            .orElseThrow(() -> new EntityNotFoundException("Member not found"));
    }

    @Transactional
    public void joinChallenge(Long memberId, Long challengeId) {
        Member m = memberRepo.findById(memberId)
            .orElseThrow(() -> new EntityNotFoundException("Member not found"));
        CurrentChallenge c = challengeRepo.findById(challengeId)
            .orElseThrow(() -> new EntityNotFoundException("Challenge not found"));
        m.getChallenges().add(c);
        memberRepo.save(m);
    }

    @Transactional
    public void leaveChallenge(Long memberId, Long challengeId) {
        Member m = memberRepo.findById(memberId)
            .orElseThrow(() -> new EntityNotFoundException("Member not found"));
        CurrentChallenge c = challengeRepo.findById(challengeId)
            .orElseThrow(() -> new EntityNotFoundException("Challenge not found"));
        m.getChallenges().remove(c);
        memberRepo.save(m);
    }

    @Transactional
    public List<CurrentChallenge> getMemberChallenges(Long memberId) {
        return memberRepo.findById(memberId)
            .map(mem -> new ArrayList<>(mem.getChallenges()))
            .orElseThrow(() -> new EntityNotFoundException("Member not found"));
    }

    /**
     * Save an uploaded profile photo file and update the Member.
     * Returns a URL (or path) that clients can use.
     */
    @Transactional
    public String saveProfilePhoto(Long memberId, MultipartFile file) {
        Member m = memberRepo.findById(memberId)
            .orElseThrow(() -> new EntityNotFoundException("Member not found"));

        String filename = "member-" + memberId + "-" + file.getOriginalFilename();
        File dest = new File("uploads/" + filename);
        try {
            dest.getParentFile().mkdirs();
            file.transferTo(dest);
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file", e);
        }

        String url = "/uploads/" + filename;
        m.setProfilePhotoUrl(url);
        memberRepo.save(m);
        return url;
    }
}
