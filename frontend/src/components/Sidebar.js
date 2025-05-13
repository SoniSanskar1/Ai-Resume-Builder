import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Typography
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CreateIcon from '@mui/icons-material/AddCircleOutline';
import ChatIcon from '@mui/icons-material/ChatBubbleOutline';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => setOpen(!open);

  return (
    <>
      {/* Hide the icon button when sidebar is open */}
      {!open && (
        <IconButton
          onClick={toggleDrawer}
          sx={{
            position: 'fixed',
            top: 16,
            left: 16,
            zIndex: 1300,
            backgroundColor: '#fff',
            boxShadow: 2,
            borderRadius: 1,
            p: 0.5
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Drawer anchor="left" open={open} onClose={toggleDrawer}>
        <Box
          sx={{
            width: 250,
            p: 2,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: '#f5f5f5'
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Navigation
          </Typography>

          <List>
            <ListItem
              button
              component={Link}
              to="/create-resume"
              onClick={toggleDrawer}
              sx={{
                borderRadius: 2,
                mb: 1,
                '&:hover': {
                  backgroundColor: '#e0e0e0'
                }
              }}
            >
              <ListItemIcon>
                <CreateIcon />
              </ListItemIcon>
              <ListItemText primary="Create Resume" />
            </ListItem>

            <ListItem
              button
              component={Link}
              to="/ai-chat"
              onClick={toggleDrawer}
              sx={{
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: '#e0e0e0'
                }
              }}
            >
              <ListItemIcon>
                <ChatIcon />
              </ListItemIcon>
              <ListItemText primary="AI Chat" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;
