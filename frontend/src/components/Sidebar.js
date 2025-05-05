import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => setOpen(!open);

  return (
    <div>
      <IconButton onClick={toggleDrawer}>
        <MenuIcon />
      </IconButton>
      <Drawer open={open} onClose={toggleDrawer}>
        <List>
          <ListItem button component={Link} to="/dashboard">
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/create-resume">
            <ListItemText primary="Create Resume" />
          </ListItem>
          <ListItem button component={Link} to="/ai-chat">
            <ListItemText primary="AI Chat" />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
};

export default Sidebar;
