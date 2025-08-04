// src/main/java/com/ReviveFitness/repository/CurrentChallengeRepository.java
package com.ReviveFitness.repository;

import com.ReviveFitness.model.CurrentChallenge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CurrentChallengeRepository extends JpaRepository<CurrentChallenge, Long> {
}