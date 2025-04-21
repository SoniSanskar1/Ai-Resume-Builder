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
    private String title;
    private String summary;
    private List<Education> educationList;
    private List<Experience> experienceList;
    private List<String> skills;
}
