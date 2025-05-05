import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, Divider } from '@mui/material';
import { createChatMessage } from '../services/api'; // Assuming you have a function to send chat messages to the backend

const AiChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // You could load previous chat messages here if needed
  }, []);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    // Add user's message to chat
    const newMessage = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, newMessage]);

    // Send message to AI backend (you should define this in api.js)
    try {
      const response = await createChatMessage(input);
      const aiMessage = { text: response.data.message, sender: 'ai' };
      setMessages((prev) => [...prev, aiMessage]);
      setInput(''); // Clear input field
    } catch (error) {
      console.error('Error sending message', error);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 400, bgcolor: 'background.paper' }}>
      <Typography variant="h5" sx={{ marginBottom: 2 }}>AI Chat</Typography>
      <List sx={{ maxHeight: 400, overflowY: 'auto' }}>
        {messages.map((msg, index) => (
          <ListItem key={index}>
            <ListItemText primary={msg.text} secondary={msg.sender === 'user' ? 'You' : 'AI'} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Type a message"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          sx={{ marginRight: 2 }}
        />
        <Button variant="contained" onClick={handleSendMessage}>Send</Button>
      </Box>
    </Box>
  );
};

export default AiChat;
