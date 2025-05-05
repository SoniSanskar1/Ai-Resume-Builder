package com.resume.builder.dto;

import com.resume.builder.model.Education;
import com.resume.builder.model.Experience;
import lombok.Data;

import java.util.List;

@Data
public class ResumeRequest {
    private String fullName;
    private String email;
    private String phone;
    private String contactEmail;
    private String contactPhone;
    private String address;
    private String title;
    private String summary;
    private List<String> skills;
    private List<String> hobbies;
    private List<String> additionalSkills;
    private List<Education> educationList;
    private List<Experience> experienceList;
    private boolean fresher;
}
