package com.ReviveFitness.repository;

import com.ReviveFitness.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    Admin findByAdminId(String adminId);
    Admin findByEmail(String email);
    Long countByIsActive(Boolean isActive);
}
