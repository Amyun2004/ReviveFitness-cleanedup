package com.ReviveFitness.service;

import com.ReviveFitness.model.Admin;
import com.ReviveFitness.repository.AdminRepository;
import com.ReviveFitness.repository.MemberRepository;
import com.ReviveFitness.repository.ProgramRepository;
import com.ReviveFitness.repository.AttendanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.HashMap;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;
    
    @Autowired
    private MemberRepository memberRepository;
    
    @Autowired
    private ProgramRepository programRepository;
    
    @Autowired
    private AttendanceRepository attendanceRepository;

    public Admin authenticateAdmin(String adminId, String password) {
        Admin admin = adminRepository.findByAdminId(adminId);
        
        if (admin != null && admin.getIsActive()) {
            // WARNING: This is comparing plain text passwords - NOT secure!
            // You should use BCrypt in production
            if (admin.getPassword().equals(password)) {
                return admin;
            }
        }
        return null;
    }

    public void updateLastLogin(Long adminId) {
        Admin admin = adminRepository.findById(adminId).orElse(null);
        if (admin != null) {
            admin.setLastLogin(LocalDateTime.now());
            adminRepository.save(admin);
        }
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Get total counts
        stats.put("totalMembers", memberRepository.count());
        stats.put("totalPrograms", programRepository.count());
        stats.put("totalActiveAdmins", adminRepository.countByIsActive(true));
        
        // Get today's attendance
        LocalDateTime startOfDay = LocalDateTime.now().toLocalDate().atStartOfDay();
        LocalDateTime endOfDay = startOfDay.plusDays(1);
        stats.put("todayAttendance", 
            attendanceRepository.countByCheckInTimeBetween(startOfDay, endOfDay));
        
        return stats;
    }
}