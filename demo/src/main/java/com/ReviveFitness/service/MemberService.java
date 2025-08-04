package com.ReviveFitness.service;

import com.ReviveFitness.model.Member;
import com.ReviveFitness.dto.ProgramDTO;
import com.ReviveFitness.repository.MemberRepository;
import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile; // Added this import

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException; // Added this import
import java.nio.file.Files; // Added this import
import java.nio.file.Path; // Added this import
import java.nio.file.Paths; // Added this import
import java.nio.file.StandardCopyOption; // Added this import
import java.util.Optional;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.time.LocalDate;
import org.springframework.util.StringUtils; // Added this import


@Service
public class MemberService {

    // Correct way to initialize a logger
    private static final Logger logger = LoggerFactory.getLogger(MemberService.class);

    // Added this constant for the upload directory
    private static final String UPLOAD_DIR = "uploads/profile-photos";

    private final MemberRepository memberRepository;
    
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public List<Member> getAllMembers() {
        return memberRepository.findAll();
    }

    public Optional<Member> getMemberById(Long id) {
        return memberRepository.findById(id);
    }
    
    // Get programs for a specific member - returns DTOs that match frontend expectations
    public List<ProgramDTO> getMemberPrograms(Long memberId) {
        // First check if member exists
        if (!memberRepository.existsById(memberId)) {
            throw new RuntimeException("Member not found with id: " + memberId);
        }
        
        // Query matching your actual database schema
        String sql = """
            SELECT p.id, p.name, p.description, p.cost, p.duration, p.img_url
            FROM programs p
            INNER JOIN member_programs mp ON p.id = mp.program_id
            WHERE mp.member_id = ?
            """;
        
        return jdbcTemplate.query(sql, new Object[]{memberId}, (rs, rowNum) -> {
            ProgramDTO program = new ProgramDTO();
            program.setId(rs.getLong("id"));
            program.setName(rs.getString("name"));
            program.setDescription(rs.getString("description"));
            program.setCost(rs.getString("cost"));
            program.setDuration(rs.getString("duration"));
            program.setImgUrl(rs.getString("img_url"));
            return program;
        });
    }
    
    public Member createMember(Member member) {
        // Check if email already exists
        Optional<Member> existingMember = memberRepository.findByEmail(member.getEmail());
        if (existingMember.isPresent()) {
            throw new IllegalArgumentException("An account with this email already exists");
        }
        
        // Validate the password before saving
        if (!isPasswordValid(member.getPassword())) {
            throw new IllegalArgumentException(
                "Password must be at least 8 characters long and contain " +
                "at least one uppercase letter, one lowercase letter, one number, " +
                "and one special character."
            );
        }
        
        // Set join date if not provided
        if (member.getJoinDate() == null) {
            member.setJoinDate(LocalDate.now());
        }
        
        return memberRepository.save(member);
    }
    
    public Member updateMember(Long id, Member memberDetails) {
        Member existingMember = memberRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found with id " + id));

        existingMember.setName(memberDetails.getName());
        existingMember.setEmail(memberDetails.getEmail());
        existingMember.setJoinDate(memberDetails.getJoinDate());
        existingMember.setProfilePhotoUrl(memberDetails.getProfilePhotoUrl());

        return memberRepository.save(existingMember);
    }

    public void deleteMember(Long id) {
        if (!memberRepository.existsById(id)) {
            throw new RuntimeException("Member not found with id " + id);
        }
        memberRepository.deleteById(id);
    }
    
    public Optional<Member> authenticateMember(String email, String password) {
        Optional<Member> memberOptional = memberRepository.findByEmail(email);

        if (memberOptional.isPresent()) {
            Member member = memberOptional.get();
            if (member.getPassword().equals(password)) {
                return memberOptional;
            }
        }
        return Optional.empty();
    }
    
    private boolean isPasswordValid(String password) {
        String regex = "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])(?=\\S+$).{8,}$";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(password);
        return matcher.matches();
    }

    public void updateMemberPrograms(Long memberId, List<Long> programIds) {
        // Check if member exists
        if (!memberRepository.existsById(memberId)) {
            throw new RuntimeException("Member not found with id: " + memberId);
        }
        
        // First, delete all existing enrollments for this member
        String deleteSql = "DELETE FROM member_programs WHERE member_id = ?";
        jdbcTemplate.update(deleteSql, memberId);
        
        // Then, insert new enrollments
        if (programIds != null && !programIds.isEmpty()) {
            String insertSql = "INSERT INTO member_programs (member_id, program_id) VALUES (?, ?)";
            for (Long programId : programIds) {
                jdbcTemplate.update(insertSql, memberId, programId);
            }
        }
        
        logger.info("Updated programs for member {}: {} programs", memberId, 
            programIds != null ? programIds.size() : 0);
    }

    // New method for saving the profile photo
    public String saveProfilePhoto(Long memberId, MultipartFile file) {
        // Check if member exists
        if (!memberRepository.existsById(memberId)) {
            throw new RuntimeException("Member not found with id: " + memberId);
        }
        
        // Ensure the upload directory exists
        Path uploadPath = Paths.get(UPLOAD_DIR);
        try {
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }

        // Get the file name and extension
        String originalFileName = Optional.ofNullable(file.getOriginalFilename())
                                  .map(StringUtils::cleanPath)
                                  .orElse("");
        String fileExtension = "";
        try {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        } catch (Exception e) {
            fileExtension = "";
        }
        
        // Create a unique file name to prevent overwrites
        String newFileName = memberId + "-profile" + fileExtension;
        Path filePath = uploadPath.resolve(newFileName);
        
        try {
            // Copy file to the target location
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new RuntimeException("Could not store file " + newFileName, e);
        }
        
        // Return the URL to the file
        return "/uploads/profile-photos/" + newFileName;
    }
}