package com.ReviveFitness.repository;

import com.ReviveFitness.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByMember_Id(Long memberId);
    long countByCheckInTimeBetween(LocalDateTime start, LocalDateTime end);
}
