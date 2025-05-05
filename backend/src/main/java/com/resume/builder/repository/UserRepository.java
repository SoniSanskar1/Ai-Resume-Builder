package com.resume.builder.repository;

import com.resume.builder.model.User;
import com.resume.builder.model.Resume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    // Optional<User> findByUsername(String username);

    // ✅ Final: Fetch User with Resumes and their Experiences
    @Query("SELECT DISTINCT u FROM User u " +
           "LEFT JOIN FETCH u.resumes r " +
           "LEFT JOIN FETCH r.experienceList " +
           "WHERE u.email = :email")
    Optional<User> findByEmailWithResumesAndExperience(@Param("email") String email);
}
