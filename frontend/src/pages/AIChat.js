import React, { useState } from 'react';
import { Box, TextField, IconButton, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatMessage from '../components/ChatMessage';
import Sidebar from '../components/Sidebar';
import { askMistral } from '../api/mistral';

const AIChat = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am your resume assistant. Ask me anything!' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    setInput('');

    const response = await askMistral(newMessages);
    setMessages([...newMessages, response]);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box sx={{ ml: '240px', p: 3, flexGrow: 1 }}>
        <Typography variant="h5" gutterBottom>
          AI Resume Chat
        </Typography>
        <Box sx={{ height: '65vh', overflowY: 'auto', mb: 2 }}>
          {messages.map((msg, i) => (
            <ChatMessage key={i} {...msg} />
          ))}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            fullWidth
            placeholder="Ask something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <IconButton onClick={handleSend}>
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default AIChat;
