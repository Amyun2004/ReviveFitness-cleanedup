package com.ReviveFitness.controller;

import com.ReviveFitness.model.Trainer;
import com.ReviveFitness.service.TrainerService;
import com.ReviveFitness.dto.TrainerDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:5174"})
@RestController
@RequestMapping("/api/trainers")
public class TrainerController {

    @Autowired
    private TrainerService trainerService;

    @GetMapping
    public ResponseEntity<List<TrainerDTO>> getAllTrainers() {
        List<Trainer> trainers = trainerService.getAllTrainers();
        List<TrainerDTO> trainerDTOs = trainers.stream()
            .map(trainerService::convertToDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(trainerDTOs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainerDTO> getTrainerById(@PathVariable Long id) {
        return trainerService.getTrainerById(id)
                .map(trainerService::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<TrainerDTO> createTrainer(@RequestBody TrainerDTO trainerDTO) {
        Trainer created = trainerService.createTrainer(trainerDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(trainerService.convertToDTO(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrainerDTO> updateTrainer(@PathVariable Long id, @RequestBody TrainerDTO trainerDTO) {
        try {
            Trainer updated = trainerService.updateTrainer(id, trainerDTO);
            return ResponseEntity.ok(trainerService.convertToDTO(updated));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTrainer(@PathVariable Long id) {
        try {
            trainerService.deleteTrainer(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}