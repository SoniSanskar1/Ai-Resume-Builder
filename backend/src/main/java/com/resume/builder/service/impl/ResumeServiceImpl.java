package com.resume.builder.service.impl;

import com.resume.builder.dto.ResumeRequest;
import com.resume.builder.model.*;
import com.resume.builder.repository.*;
import com.resume.builder.service.ResumeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ResumeServiceImpl implements ResumeService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private EducationRepository educationRepository;

    @Autowired
    private ExperienceRepository experienceRepository;

    @Override
    public Resume createResume(String email, ResumeRequest resumeRequest) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        Resume resume = new Resume();
        resume.setUser(user);
        resume.setFullName(resumeRequest.getFullName());
        resume.setEmail(resumeRequest.getEmail());
        resume.setPhone(resumeRequest.getPhone());
        resume.setTitle(resumeRequest.getTitle());
        resume.setSummary(resumeRequest.getSummary());
        resume.setSkills(resumeRequest.getSkills());
        resume.setHobbies(resumeRequest.getHobbies());
        resume.setAdditionalSkills(resumeRequest.getAdditionalSkills());
        resume.setContactEmail(resumeRequest.getContactEmail());
        resume.setContactPhone(resumeRequest.getContactPhone());
        resume.setAddress(resumeRequest.getAddress());

        Resume savedResume = resumeRepository.save(resume);

        // Save education entries
        List<Education> educations = resumeRequest.getEducationList().stream().map(edu -> {
            Education education = new Education();
            education.setInstitution(edu.getInstitution());  // Matching ResumeRequest DTO field to model field
            education.setDegree(edu.getDegree());
            education.setYear(edu.getYear());
            education.setResume(savedResume);
            return education;
        }).collect(Collectors.toList());

        educationRepository.saveAll(educations);

        // Save experience or fresher status
        if (resumeRequest.isFresher()) {
            Experience fresherExp = new Experience();
            fresherExp.setFresher(true);
            fresherExp.setResume(savedResume);
            experienceRepository.save(fresherExp);
        } else {
            List<Experience> experiences = resumeRequest.getExperienceList().stream().map(exp -> {
                Experience experience = new Experience();
                experience.setCompany(exp.getCompany());
                experience.setPosition(exp.getPosition());
                experience.setDuration(exp.getDuration());  // Matching DTO field to model field
                experience.setFresher(false);
                experience.setResume(savedResume);
                return experience;
            }).collect(Collectors.toList());

            experienceRepository.saveAll(experiences);
        }

        return savedResume;
    }
}
