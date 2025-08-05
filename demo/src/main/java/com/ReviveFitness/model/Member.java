package com.ReviveFitness.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "members")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String password;

    @Column(name = "join_date")
    private LocalDate joinDate;

    @Column(name = "profile_photo_url")
    private String profilePhotoUrl;

    @ManyToMany
    @JoinTable(
        name = "member_programs",
        joinColumns = @JoinColumn(name = "member_id"),
        inverseJoinColumns = @JoinColumn(name = "program_id")
    )
    private Set<Program> programs = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "member_challenges",
        joinColumns = @JoinColumn(name = "member_id"),
        inverseJoinColumns = @JoinColumn(name = "challenge_id")
    )
    private Set<CurrentChallenge> challenges = new HashSet<>();

    public Member() {}

    // — Getters & Setters —

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDate getJoinDate() {
        return joinDate;
    }
    public void setJoinDate(LocalDate joinDate) {
        this.joinDate = joinDate;
    }

    public String getProfilePhotoUrl() {
        return profilePhotoUrl;
    }
    public void setProfilePhotoUrl(String profilePhotoUrl) {
        this.profilePhotoUrl = profilePhotoUrl;
    }

    public Set<Program> getPrograms() {
        return programs;
    }
    public void setPrograms(Set<Program> programs) {
        this.programs = programs;
    }

    public Set<CurrentChallenge> getChallenges() {
        return challenges;
    }
    public void setChallenges(Set<CurrentChallenge> challenges) {
        this.challenges = challenges;
    }
}
