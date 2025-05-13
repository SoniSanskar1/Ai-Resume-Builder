import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button
} from '@mui/material';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [recentActivity, setRecentActivity] = useState(null);

  useEffect(() => {
    const activity = JSON.parse(localStorage.getItem('recentResumeDownload'));
    if (activity) {
      setRecentActivity(activity);
    }
  }, []);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f7f9fc', color: '#333' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, px: 4, py: 3, mt: 8 }}>
        <Navbar />

        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
          Welcome back, Sanskar 👋
        </Typography>

        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
          {/* Quick Actions */}
          <Paper sx={{ p: 3, borderRadius: 3, flex: 1 }}>
            <Typography variant="h6" gutterBottom>Quick Actions</Typography>
            <Stack spacing={2}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate('/create-resume')}
              >
                Create New Resume
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/ai-chat')}
              >
                Resume with AI
              </Button>
            </Stack>
          </Paper>

          {/* Recent Activity */}
          <Paper sx={{ p: 3, borderRadius: 3, flex: 2 }}>
            <Typography variant="h6" gutterBottom>Recent Activity</Typography>
            {recentActivity ? (
              <Typography variant="body2" sx={{ color: 'gray' }}>
                You last downloaded “{recentActivity.name}” on {formatDate(recentActivity.timestamp)}
              </Typography>
            ) : (
              <Typography variant="body2" sx={{ color: 'gray' }}>
                No recent downloads found.
              </Typography>
            )}
          </Paper>
        </Stack>

        {/* Pro Tip */}
        <Box mt={3}>
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6">💡 Pro Tip</Typography>
            <Typography variant="body2" sx={{ color: 'gray' }}>
              Keep your resume under 1 page and use active language like “Built”, “Improved”, or “Shipped”.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
