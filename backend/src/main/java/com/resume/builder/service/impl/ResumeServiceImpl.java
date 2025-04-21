package com.resume.builder.service.impl;

import com.resume.builder.dto.ResumeRequest;
import com.resume.builder.model.*;
import com.resume.builder.repository.ResumeRepository;
import com.resume.builder.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ResumeServiceImpl implements ResumeService {
    private final ResumeRepository resumeRepository;

    @Override
    @Transactional
    public Resume createResume(ResumeRequest request, User user) {
        Resume resume = new Resume();
        resume.setFullName(request.getFullName());
        resume.setEmail(request.getEmail());
        resume.setPhone(request.getPhone());
        resume.setTitle(request.getTitle());
        resume.setSummary(request.getSummary());
        resume.setSkills(request.getSkills());
        resume.setUser(user);

        // Map education
        request.getEducationList().forEach(edu -> edu.setResume(resume));
        resume.setEducationList(request.getEducationList());

        // Map experience
        request.getExperienceList().forEach(exp -> exp.setResume(resume));
        resume.setExperienceList(request.getExperienceList());

        return resumeRepository.save(resume);
    }

}