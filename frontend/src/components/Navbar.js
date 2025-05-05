import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          AI Resume Builder
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
          <Button color="inherit" component={Link} to="/create-resume">Create Resume</Button>
          <Button color="inherit" component={Link} to="/login">Login</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
