package com.resume.builder.controller;

import com.resume.builder.dto.ResumeRequest;
import com.resume.builder.model.Resume;
import com.resume.builder.model.User;
import com.resume.builder.service.ResumeService;
import com.resume.builder.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class ResumeController {
    private final ResumeService resumeService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createResume(@RequestBody ResumeRequest resumeRequest, Authentication authentication) {
        String email = authentication.getName(); // this gets the email/username of the authenticated user
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Resume savedResume = resumeService.createResume(resumeRequest, user);
        return ResponseEntity.ok(savedResume);
    }

}