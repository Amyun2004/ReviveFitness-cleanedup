package com.ReviveFitness.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "current_challenges")
public class CurrentChallenge {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String imageUrl;
    // … any other existing fields …

    @ManyToMany(mappedBy = "challenges")
    private Set<Member> participants = new HashSet<>();

    // — Constructors, getters, setters —

    public CurrentChallenge() {}

    // id
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    // title
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    // description
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    // imageUrl
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    // participants
    public Set<Member> getParticipants() { return participants; }
    public void setParticipants(Set<Member> participants) { this.participants = participants; }
}
