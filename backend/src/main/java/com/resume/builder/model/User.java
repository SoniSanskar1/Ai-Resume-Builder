package com.resume.builder.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    // @Column(unique = true)
    // private String username;

    private LocalDateTime createdAt = LocalDateTime.now();

    // One user can have many resumes
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY, orphanRemoval = true)
    private List<Resume> resumes;

    // Constructor to avoid null values for some fields during object creation
    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    // Optional: Add a method to add a resume to a user (helps maintain
    // bidirectional relationship)
    public void addResume(Resume resume) {
        resumes.add(resume);
        resume.setUser(this); // Establish the reverse relationship
    }

    // Optional: Add a method to remove a resume from a user
    public void removeResume(Resume resume) {
        resumes.remove(resume);
        resume.setUser(null); // Break the reverse relationship
    }
}
