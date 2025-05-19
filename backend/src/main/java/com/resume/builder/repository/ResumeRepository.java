package com.resume.builder.repository;

import com.resume.builder.model.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
// import java.util.List;

public interface ResumeRepository extends JpaRepository<Resume, Long> {
    // List<Resume> findByUserUsername(String username);
}
