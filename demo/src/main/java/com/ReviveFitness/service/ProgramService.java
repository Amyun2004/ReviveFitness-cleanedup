package com.ReviveFitness.service;

import com.ReviveFitness.model.Program;
import com.ReviveFitness.repository.ProgramRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProgramService {

    @Autowired
    private ProgramRepository programRepository;

    public Program createProgram(Program program) {
        return programRepository.save(program);
    }

    public List<Program> getAllPrograms() {
        return programRepository.findAll();
    }

    public Optional<Program> getProgramById(Long id) {
        return programRepository.findById(id);
    }

    public Program updateProgram(Long id, Program programDetails) {
        Program existingProgram = programRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Program not found with id: " + id));
        
        // FIX: Update the program name
        existingProgram.setName(programDetails.getName());
        
        existingProgram.setDescription(programDetails.getDescription());
        return programRepository.save(existingProgram);
    }

    public void deleteProgram(Long id) {
        if (!programRepository.existsById(id)) {
            throw new RuntimeException("Program not found with id: " + id);
        }
        programRepository.deleteById(id);
    }
}