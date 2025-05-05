import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
const Dashboard = () => {
  const [resumeCreated, setResumeCreated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const successFlag = localStorage.getItem('resumeCreated');
    if (successFlag === 'true') {
      setResumeCreated(true);
      localStorage.removeItem('resumeCreated');
    }
  }, []);

  const goToChat = () => {
    navigate('/aichat');
  };

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>

      {resumeCreated ? (
        <Stack spacing={2}>
          <Typography variant="body1" color="success.main">
            🎉 Resume created successfully!
          </Typography>
          <Typography variant="body2">
            You can now chat with the AI to improve or customize your resume.
          </Typography>
          <Button variant="contained" color="primary" onClick={goToChat}>
            Go to AI Chat
          </Button>
        </Stack>
      ) : (
        <Box>
      <Navbar />
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h4">Welcome to Dashboard</Typography>
        </Box>
      </Box>
    </Box>
      )}
    </Box>
  );
};

export default Dashboard;
