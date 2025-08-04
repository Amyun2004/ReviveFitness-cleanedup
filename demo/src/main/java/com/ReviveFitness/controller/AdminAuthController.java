package com.ReviveFitness.controller;

import com.ReviveFitness.model.Admin;
import com.ReviveFitness.service.AdminService;
import com.ReviveFitness.dto.AdminLoginRequest;
import com.ReviveFitness.dto.AdminLoginResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RestController
@RequestMapping("/api/admin")
public class AdminAuthController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(@RequestBody AdminLoginRequest loginRequest) {
        try {
            Admin admin = adminService.authenticateAdmin(
                loginRequest.getAdminId(), 
                loginRequest.getPassword()
            );
            
            if (admin != null) {
                // Update last login
                adminService.updateLastLogin(admin.getId());
                
                // Create response
                AdminLoginResponse response = AdminLoginResponse.builder()
                    .id(admin.getId())
                    .adminId(admin.getAdminId())
                    .name(admin.getName())
                    .email(admin.getEmail())
                    .role("admin")
                    .message("Login successful")
                    .build();
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid admin credentials"));
            }
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "An error occurred during login"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutAdmin() {
        // In a real application, you might want to invalidate tokens here
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    // Add this to your existing AdminController for the dashboard stats
    @GetMapping("/stats")
    public ResponseEntity<?> getAdminStats() {
        try {
            Map<String, Object> stats = adminService.getDashboardStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error fetching stats"));
        }
    }
}