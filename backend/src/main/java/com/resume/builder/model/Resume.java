package com.resume.builder.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Data
@Table(name = "resumes")
public class Resume {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String email;
    private String phone;
    private String title;
    private String summary;

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // 👈 Add this
    private List<Education> educationList;

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference // 👈 Add this
    private List<Experience> experienceList;

    @ElementCollection
    @CollectionTable(name = "skills", joinColumns = @JoinColumn(name = "resume_id"))
    @Column(name = "skill_name") // 👈 fix column name
    private List<String> skills;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDateTime createdAt = LocalDateTime.now();
}
