import React from 'react';
import { Box, Typography } from '@mui/material';

const ChatMessage = ({ role, content }) => {
  const isUser = role === 'user';
  return (
    <Box
      sx={{
        mb: 2,
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
      }}
    >
      <Box
        sx={{
          p: 2,
          maxWidth: '70%',
          borderRadius: 3,
          bgcolor: isUser ? '#1976d2' : '#f5f5f5',
          color: isUser ? '#fff' : '#000',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}
      >
        <Typography variant="body1">{content}</Typography>
      </Box>
    </Box>
  );
};

export default ChatMessage;
