// Sidebar.js
import React from 'react';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const options = [
    { text: 'Dashboard', path: '/' },
    { text: 'Create Resume', path: '/create-resume' },
    { text: 'My Resumes', path: '/resumes' },
    { text: 'AI Chat', path: '/ai-chat' },
    { text: 'Logout', path: '/logout' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#f0f0f0',
          paddingTop: '64px', // to account for AppBar if any
        },
      }}
    >
      <List>
        {options.map((opt) => (
          <ListItem button key={opt.text} onClick={() => navigate(opt.path)}>
            <ListItemText primary={opt.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
