package com.ReviveFitness.repository;

import com.ReviveFitness.model.Program;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProgramRepository extends JpaRepository<Program, Long> {
}
