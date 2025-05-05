package com.resume.builder.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

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

    @ElementCollection
    @CollectionTable(name = "skills", joinColumns = @JoinColumn(name = "resume_id"))
    @Column(name = "skill")
    private List<String> skills;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "additional_skills", joinColumns = @JoinColumn(name = "resume_id"))
    @Column(name = "additional_skill")
    private List<String> additionalSkills;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "hobbies", joinColumns = @JoinColumn(name = "resume_id"))
    @Column(name = "hobby")
    private List<String> hobbies;
    private String contactEmail;
    private String contactPhone;
    private String address;

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Education> educationList;

    @OneToMany(mappedBy = "resume", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Experience> experienceList;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDateTime createdAt = LocalDateTime.now();
}
