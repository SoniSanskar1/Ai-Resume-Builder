package com.resume.builder.service;

import com.resume.builder.dto.ResumeRequest;
import com.resume.builder.model.Resume;

public interface ResumeService {
    Resume createResume(String username, ResumeRequest resumeRequest);
}
