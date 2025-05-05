package com.resume.builder.controller;

import com.resume.builder.dto.ResumeRequest;
import com.resume.builder.model.Resume;
import com.resume.builder.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = "http://localhost:3000") // Update if frontend runs elsewhere
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    // POST: Create a new resume
    @PostMapping
    public ResponseEntity<Resume> createResume(@RequestBody ResumeRequest resumeRequest, Authentication authentication) {
        String username = authentication.getName();
        Resume createdResume = resumeService.createResume(username, resumeRequest);
        return ResponseEntity.ok(createdResume);
    }

    // Add more endpoints if needed, like fetchAllResumes, updateResume, deleteResume etc.
}
