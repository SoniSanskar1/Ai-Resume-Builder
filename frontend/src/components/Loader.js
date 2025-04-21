import React from 'react';
import { CircularProgress, Typography, Box } from '@mui/material';

const Loader = () => {
  return (
    <Box
      sx={{
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress size={70} thickness={4} />
      <Typography variant="h6" mt={3}>
        Analyzing your resume with AI...
      </Typography>
    </Box>
  );
};

export default Loader;
