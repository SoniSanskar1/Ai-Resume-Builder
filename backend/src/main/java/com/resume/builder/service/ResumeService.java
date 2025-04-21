package com.resume.builder.service;

import com.resume.builder.dto.ResumeRequest;
import com.resume.builder.model.Resume;
import com.resume.builder.model.User;

public interface ResumeService {
    Resume createResume(ResumeRequest request, User user);
}