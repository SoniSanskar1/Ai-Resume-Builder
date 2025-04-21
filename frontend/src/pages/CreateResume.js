import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Grid,
  Paper,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { createResume } from '../services/api';

const CreateResume = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    title: '',
    summary: '',
    skills: '',
    educationList: [{ institution: '', degree: '', graduationYear: '', startYear: '' }],
    experienceList: [{ company: '', position: '', duration: '' }]
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const navigate = useNavigate();

  const handleAddEducation = () => {
    setFormData(prev => ({
      ...prev,
      educationList: [...prev.educationList, { institution: '', degree: '', graduationYear: '', startYear: '' }]
    }));
    setErrors(prev => ({ ...prev, education: null }));
  };

  const handleAddExperience = () => {
    setFormData(prev => ({
      ...prev,
      experienceList: [...prev.experienceList, { company: '', position: '', duration: '' }]
    }));
    setErrors(prev => ({ ...prev, experience: null }));
  };

  const handleRemoveEducation = (index) => {
    setFormData(prev => {
      const updated = [...prev.educationList];
      updated.splice(index, 1);
      return { ...prev, educationList: updated };
    });
  };

  const handleRemoveExperience = (index) => {
    setFormData(prev => {
      const updated = [...prev.experienceList];
      updated.splice(index, 1);
      return { ...prev, experienceList: updated };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.summary.trim()) newErrors.summary = 'Summary is required';
    if (!formData.skills.trim()) newErrors.skills = 'Skills are required';

    formData.educationList.forEach((edu, index) => {
      if (!edu.institution.trim() || !edu.degree.trim() || !edu.graduationYear.trim() || !edu.startYear.trim()) {
        newErrors.education = `All education fields must be filled for entry ${index + 1}`;
      }
    });

    formData.experienceList.forEach((exp, index) => {
      if (!exp.company.trim() || !exp.position.trim() || !exp.duration.trim()) {
        newErrors.experience = `All experience fields must be filled for entry ${index + 1}`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    
    const resumeData = {
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      title: formData.title.trim(),
      summary: formData.summary.trim(),
      skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean),
      educationList: formData.educationList.map(edu => ({
        institution: edu.institution.trim(),
        degree: edu.degree.trim(),
        graduationYear: edu.graduationYear.trim(),
        startYear: edu.startYear.trim()
      })),
      experienceList: formData.experienceList.map(exp => ({
        company: exp.company.trim(),
        position: exp.position.trim(),
        duration: exp.duration.trim()
      }))
    };

    try {
      const response = await createResume(resumeData); // Uses updated createResume with retries
      setSnackbar({
        open: true,
        message: 'Resume created successfully!',
        severity: 'success'
      });
      setTimeout(() => navigate('/ai-chat'), 1500);
    } catch (error) {
      console.error('Resume creation error:', error);
      const errorMessage = error.message || 'Failed to create resume due to a network issue';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEducationChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.educationList];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, educationList: updated };
    });
  };

  const handleExperienceChange = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.experienceList];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experienceList: updated };
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 4 }} component="form" onSubmit={handleSubmit}>
      <Typography variant="h4" gutterBottom>Create Resume</Typography>

      <TextField
        fullWidth
        name="fullName"
        label="Full Name"
        value={formData.fullName}
        onChange={handleChange}
        error={!!errors.fullName}
        helperText={errors.fullName}
        sx={{ mb: 2 }}
        required
      />

      <TextField
        fullWidth
        name="phone"
        label="Phone"
        value={formData.phone}
        onChange={handleChange}
        error={!!errors.phone}
        helperText={errors.phone}
        sx={{ mb: 2 }}
        required
      />

      <TextField
        fullWidth
        name="title"
        label="Title"
        value={formData.title}
        onChange={handleChange}
        error={!!errors.title}
        helperText={errors.title}
        sx={{ mb: 2 }}
        required
      />

      <TextField
        fullWidth
        multiline
        rows={3}
        name="summary"
        label="Summary"
        value={formData.summary}
        onChange={handleChange}
        error={!!errors.summary}
        helperText={errors.summary}
        sx={{ mb: 2 }}
        required
      />

      <TextField
        fullWidth
        name="skills"
        label="Skills (comma separated)"
        value={formData.skills}
        onChange={handleChange}
        error={!!errors.skills}
        helperText={errors.skills}
        sx={{ mb: 4 }}
        required
      />

      <Typography variant="h6">Education</Typography>
      {formData.educationList.map((edu, index) => (
        <Paper key={index} sx={{ p: 2, my: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Institution"
                fullWidth
                value={edu.institution}
                onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                error={!!errors.education}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Degree"
                fullWidth
                value={edu.degree}
                onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                error={!!errors.education}
                required
              />
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField
                label="Start Year"
                fullWidth
                value={edu.startYear}
                onChange={(e) => handleEducationChange(index, 'startYear', e.target.value)}
                error={!!errors.education}
                required
              />
            </Grid>
            <Grid item xs={6} sm={2}>
              <TextField
                label="Graduation Year"
                fullWidth
                value={edu.graduationYear}
                onChange={(e) => handleEducationChange(index, 'graduationYear', e.target.value)}
                error={!!errors.education}
                required
              />
            </Grid>
            <Grid item xs={6} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={() => handleRemoveEducation(index)}>
                <Delete />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>
      ))}
      <Button startIcon={<Add />} onClick={handleAddEducation} sx={{ mb: 4 }}>
        Add Education
      </Button>

      <Typography variant="h6">Experience</Typography>
      {formData.experienceList.map((exp, index) => (
        <Paper key={index} sx={{ p: 2, my: 1 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Company"
                fullWidth
                value={exp.company}
                onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                error={!!errors.experience}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Position"
                fullWidth
                value={exp.position}
                onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                error={!!errors.experience}
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Duration"
                fullWidth
                value={exp.duration}
                onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                error={!!errors.experience}
                required
              />
            </Grid>
            <Grid item xs={6} sm={2} sx={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={() => handleRemoveExperience(index)}>
                <Delete />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>
      ))}
      <Button startIcon={<Add />} onClick={handleAddExperience} sx={{ mb: 4 }}>
        Add Experience
      </Button>

      {errors.education && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.education}
        </Alert>
      )}

      {errors.experience && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errors.experience}
        </Alert>
      )}

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
        >
          {loading ? 'Creating...' : 'Submit Resume'}
        </Button>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateResume;