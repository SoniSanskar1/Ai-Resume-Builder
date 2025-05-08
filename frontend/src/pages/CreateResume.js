import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, IconButton, Stack, Switch, FormControlLabel, Divider, CircularProgress, Snackbar } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { createResume } from '../services/api';

const CreateResume = () => {
  const [resume, setResume] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '1234567890',
    title: 'Software Engineer',
    summary: 'Experienced software engineer with a passion for developing innovative programs.',
    skills: 'JavaScript, React, Node.js',
    hobbies: 'Reading, Hiking',
    additionalSkills: 'TypeScript, GraphQL',
    address: '123 Main St, Bengaluru, Karnataka',
    contactEmail: 'john.doe@example.com',
    contactPhone: '1234567890',
    educationList: [
      {
        school: 'ABC University',
        degree: 'B.Tech',
        field: 'Computer Science',
        startDate: '2015-08-01',
        endDate: '2019-05-31',
      },
    ],
    experienceList: [
      {
        company: 'XYZ Corp',
        position: 'Frontend Developer',
        startDate: '2019-06-01',
        endDate: '2021-08-31',
        description: 'Developed and maintained web applications using React.',
      },
    ],
    isFresher: false,
  });
  

  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResume((prev) => ({ ...prev, [name]: value }));
  };

  const handleEducationChange = (index, e) => {
    const newList = [...resume.educationList];
    newList[index][e.target.name] = e.target.value;
    setResume((prev) => ({ ...prev, educationList: newList }));
  };

  const handleExperienceChange = (index, e) => {
    const newList = [...resume.experienceList];
    newList[index][e.target.name] = e.target.value;
    setResume((prev) => ({ ...prev, experienceList: newList }));
  };

  const addEducation = () => {
    setResume((prev) => ({
      ...prev,
      educationList: [...prev.educationList, { school: '', degree: '', field: '', startDate: '', endDate: '' }],
    }));
  };

  const removeEducation = (index) => {
    const newList = resume.educationList.filter((_, i) => i !== index);
    setResume((prev) => ({ ...prev, educationList: newList }));
  };

  const addExperience = () => {
    setResume((prev) => ({
      ...prev,
      experienceList: [...prev.experienceList, { company: '', position: '', startDate: '', endDate: '', description: '' }],
    }));
  };

  const removeExperience = (index) => {
    const newList = resume.experienceList.filter((_, i) => i !== index);
    setResume((prev) => ({ ...prev, experienceList: newList }));
  };

  const handleFresherToggle = () => {
    setResume((prev) => ({
      ...prev,
      isFresher: !prev.isFresher,
      experienceList: prev.isFresher ? [{ company: '', position: '', startDate: '', endDate: '', description: '' }] : [],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading state
    try {
      const clonedResume = structuredClone(resume);
      clonedResume.skills = clonedResume.skills.split(",");
      clonedResume.hobbies = clonedResume.hobbies.split(",");
      clonedResume.additionalSkills = clonedResume.additionalSkills.split(",");
      await createResume(clonedResume);
      setSnackbarSeverity('success');
      setSnackbarMessage('Resume created successfully!');
      setSnackbarOpen(true);
      navigate('/dashboard'); // Redirect to dashboard
    } catch (err) {
      setSnackbarSeverity('error');
      setSnackbarMessage('Failed to create resume');
      setSnackbarOpen(true);
    } finally {
      setLoading(false); // End loading state
    }
  };

  return (
    <>
    <Box maxWidth="md" mx="auto" p={3}>
      <Typography variant="h4" gutterBottom>Create Resume</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField label="Full Name" name="fullName" fullWidth value={resume.fullName} onChange={handleChange} />
          <TextField label="Email" name="email" fullWidth value={resume.email} onChange={handleChange} />
          <TextField label="Phone" name="phone" fullWidth value={resume.phone} onChange={handleChange} />
          <TextField label="Title" name="title" fullWidth value={resume.title} onChange={handleChange} />
          <TextField label="Summary" name="summary" fullWidth multiline rows={3} value={resume.summary} onChange={handleChange} />
          <TextField label="Skills (comma-separated)" name="skills" fullWidth value={resume.skills} onChange={handleChange} />
          <TextField label="Hobbies" name="hobbies" fullWidth value={resume.hobbies} onChange={handleChange} />
          <TextField label="Additional Skills" name="additionalSkills" fullWidth value={resume.additionalSkills} onChange={handleChange} />
          <TextField label="Address" name="address" fullWidth value={resume.address} onChange={handleChange} />
          <TextField label="Contact Email" name="contactEmail" fullWidth value={resume.contactEmail} onChange={handleChange} />
          <TextField label="Contact Phone" name="contactPhone" fullWidth value={resume.contactPhone} onChange={handleChange} />

          <Divider />
          <Typography variant="h6">Education</Typography>
          {resume.educationList.map((edu, index) => (
            <Stack key={index} spacing={1} direction="row" alignItems="center">
              <TextField name="school" label="School" value={edu.school} onChange={(e) => handleEducationChange(index, e)} fullWidth />
              <TextField name="degree" label="Degree" value={edu.degree} onChange={(e) => handleEducationChange(index, e)} fullWidth />
              <TextField name="field" label="Field" value={edu.field} onChange={(e) => handleEducationChange(index, e)} fullWidth />
              <TextField name="startDate" label="Start Date" value={edu.startDate} onChange={(e) => handleEducationChange(index, e)} fullWidth />
              <TextField name="endDate" label="End Date" value={edu.endDate} onChange={(e) => handleEducationChange(index, e)} fullWidth />
              <IconButton onClick={() => removeEducation(index)}><Delete /></IconButton>
            </Stack>
          ))}
          <Button onClick={addEducation} variant="outlined" startIcon={<Add />}>Add Education</Button>

          <Divider />
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Experience</Typography>
            <FormControlLabel
              control={<Switch checked={resume.isFresher} onChange={handleFresherToggle} />}
              label="Mark as Fresher"
            />
          </Stack>
          {resume.isFresher ? (
            <Typography color="textSecondary">Marked as Fresher - No Experience Required</Typography>
          ) : (
            <>
              {resume.experienceList.map((exp, index) => (
                <Stack key={index} spacing={1} direction="row" alignItems="center">
                  <TextField name="company" label="Company" value={exp.company} onChange={(e) => handleExperienceChange(index, e)} fullWidth />
                  <TextField name="position" label="Position" value={exp.position} onChange={(e) => handleExperienceChange(index, e)} fullWidth />
                  <TextField name="startDate" label="Start Date" value={exp.startDate} onChange={(e) => handleExperienceChange(index, e)} fullWidth />
                  <TextField name="endDate" label="End Date" value={exp.endDate} onChange={(e) => handleExperienceChange(index, e)} fullWidth />
                  <TextField name="description" label="Description" value={exp.description} onChange={(e) => handleExperienceChange(index, e)} fullWidth />
                  <IconButton onClick={() => removeExperience(index)}><Delete /></IconButton>
                </Stack>
              ))}
              <Button onClick={addExperience} variant="outlined" startIcon={<Add />}>Add Experience</Button>
            </>
          )}
          <Divider />
          <Button type="submit" variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Submit Resume'}
          </Button>
        </Stack>
      </form>
    </Box>

    <Snackbar
      open={snackbarOpen}
      autoHideDuration={6000}
      onClose={() => setSnackbarOpen(false)}
      message={snackbarMessage}
      severity={snackbarSeverity}
    />
    </>
  );
};

export default CreateResume;
