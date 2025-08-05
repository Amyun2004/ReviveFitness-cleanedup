package com.ReviveFitness.service;

import com.ReviveFitness.model.Trainer;
import com.ReviveFitness.model.Achievement;
import com.ReviveFitness.repository.TrainerRepository;
import com.ReviveFitness.dto.TrainerDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.ArrayList;

@Service
public class TrainerService {

    @Autowired
    private TrainerRepository trainerRepository;

    public List<Trainer> getAllTrainers() {
        return trainerRepository.findAll();
    }

    public Optional<Trainer> getTrainerById(Long id) {
        return trainerRepository.findById(id);
    }

    @Transactional
    public Trainer createTrainer(TrainerDTO trainerDTO) {
        Trainer trainer = new Trainer();
        trainer.setName(trainerDTO.getName());
        trainer.setTitle(trainerDTO.getTitle());
        trainer.setBio(trainerDTO.getBio());
        trainer.setImgUrl(trainerDTO.getImgUrl());
        
        // Save trainer first
        trainer = trainerRepository.save(trainer);
        
        // Add achievements
        if (trainerDTO.getAchievements() != null && !trainerDTO.getAchievements().isEmpty()) {
            List<Achievement> achievements = new ArrayList<>();
            for (String achievementText : trainerDTO.getAchievements()) {
                Achievement achievement = new Achievement();
                achievement.setAchievement(achievementText);
                achievement.setTrainer(trainer);
                achievements.add(achievement);
            }
            trainer.setAchievements(achievements);
            trainer = trainerRepository.save(trainer);
        }
        
        return trainer;
    }

    @Transactional
    public Trainer updateTrainer(Long id, TrainerDTO trainerDTO) {
        Trainer trainer = trainerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trainer not found with id: " + id));
        
        trainer.setName(trainerDTO.getName());
        trainer.setTitle(trainerDTO.getTitle());
        trainer.setBio(trainerDTO.getBio());
        trainer.setImgUrl(trainerDTO.getImgUrl());
        
        // Clear existing achievements
        if (trainer.getAchievements() != null) {
            trainer.getAchievements().clear();
        } else {
            trainer.setAchievements(new ArrayList<>());
        }
        
        // Add new achievements
        if (trainerDTO.getAchievements() != null && !trainerDTO.getAchievements().isEmpty()) {
            for (String achievementText : trainerDTO.getAchievements()) {
                Achievement achievement = new Achievement();
                achievement.setAchievement(achievementText);
                achievement.setTrainer(trainer);
                trainer.getAchievements().add(achievement);
            }
        }
        
        return trainerRepository.save(trainer);
    }

    @Transactional
    public void deleteTrainer(Long id) {
        if (!trainerRepository.existsById(id)) {
            throw new RuntimeException("Trainer not found with id: " + id);
        }
        trainerRepository.deleteById(id);
    }

    public TrainerDTO convertToDTO(Trainer trainer) {
        TrainerDTO dto = new TrainerDTO();
        dto.setId(trainer.getId());
        dto.setName(trainer.getName());
        dto.setTitle(trainer.getTitle());
        dto.setBio(trainer.getBio());
        dto.setImgUrl(trainer.getImgUrl());
        
        if (trainer.getAchievements() != null) {
            dto.setAchievements(
                trainer.getAchievements().stream()
                    .map(Achievement::getAchievement)
                    .collect(Collectors.toList())
            );
        } else {
            dto.setAchievements(new ArrayList<>());
        }
        
        return dto;
    }
}