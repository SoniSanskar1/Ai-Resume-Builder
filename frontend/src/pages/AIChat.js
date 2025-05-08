// AiChatWithSidebar.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  TextField,
  IconButton,
  Divider,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Paper,
} from "@mui/material";
import { Delete, Edit, Save } from "@mui/icons-material";
import { askMistral } from "../api/mistral";

const drawerWidth = 260;

const AiChatWithSidebar = () => {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [input, setInput] = useState("");
  const [editingChatId, setEditingChatId] = useState(null);
  const [chatNames, setChatNames] = useState({});

  useEffect(() => {
    if (!currentChatId) startNewChat();
  }, []);

  const startNewChat = () => {
    const id = Date.now().toString();
    setChats((prev) => [...prev, { id, messages: [] }]);
    setCurrentChatId(id);
    setChatNames((prev) => ({ ...prev, [id]: "New Chat" }));
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    const updatedChats = chats.map((chat) =>
      chat.id === currentChatId
        ? { ...chat, messages: [...chat.messages, userMsg] }
        : chat
    );
    setChats(updatedChats);
    setInput("");

    const aiResponse = await askMistral([
      { role: "user", content: input },
    ]);

    const aiMsg = { sender: "ai", text: aiResponse.content };

    const finalChats = updatedChats.map((chat) =>
      chat.id === currentChatId
        ? { ...chat, messages: [...chat.messages, aiMsg] }
        : chat
    );

    setChats(finalChats);

    // Auto rename
    if (chatNames[currentChatId] === "New Chat") {
      const suggested = input.split(" ").slice(0, 4).join(" ");
      setChatNames((prev) => ({ ...prev, [currentChatId]: suggested }));
    }
  };

  const handleDeleteChat = (id) => {
    setChats(chats.filter((c) => c.id !== id));
    const updatedNames = { ...chatNames };
    delete updatedNames[id];
    setChatNames(updatedNames);
    if (id === currentChatId) setCurrentChatId(chats[0]?.id || null);
  };

  const handleRename = (id, name) => {
    setChatNames((prev) => ({ ...prev, [id]: name }));
    setEditingChatId(null);
  };

  const currentMessages = chats.find((c) => c.id === currentChatId)?.messages || [];

  return (
    <Box sx={{ display: "flex", bgcolor: "#121212", height: "100vh", color: "#fff" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            bgcolor: "#1e1e1e",
            color: "#fff",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ p: 2 }}>
          <Button variant="contained" onClick={startNewChat} fullWidth>
            + New Chat
          </Button>
          <List>
            {chats.map((chat) => (
              <ListItem key={chat.id} sx={{ pl: 1 }}>
                {editingChatId === chat.id ? (
                  <TextField
                    variant="standard"
                    defaultValue={chatNames[chat.id]}
                    onBlur={(e) => handleRename(chat.id, e.target.value)}
                    autoFocus
                    sx={{ color: "#fff" }}
                  />
                ) : (
                  <ListItemText
                    primary={chatNames[chat.id]}
                    onClick={() => setCurrentChatId(chat.id)}
                    sx={{ cursor: "pointer" }}
                  />
                )}
                <IconButton size="small" onClick={() => setEditingChatId(chat.id)}>
                  <Edit fontSize="small" sx={{ color: "#aaa" }} />
                </IconButton>
                <IconButton size="small" onClick={() => handleDeleteChat(chat.id)}>
                  <Delete fontSize="small" sx={{ color: "#aaa" }} />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <AppBar position="static" sx={{ bgcolor: "#2b2b2b" }}>
          <Toolbar>
            <Typography variant="h6">AI Chat</Typography>
          </Toolbar>
        </AppBar>

        <Box sx={{ maxHeight: "75vh", overflowY: "auto", my: 2 }}>
          {currentMessages.map((msg, i) => (
            <Paper
              key={i}
              sx={{
                p: 2,
                my: 1,
                bgcolor: msg.sender === "user" ? "#3a3a3a" : "#2e7d32",
                color: "#fff",
              }}
            >
              <Typography variant="body2" fontWeight="bold">
                {msg.sender === "user" ? "You" : "AI"}
              </Typography>
              <Typography>{msg.text}</Typography>
            </Paper>
          ))}
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            variant="outlined"
            fullWidth
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            sx={{ bgcolor: "#fff" }}
          />
          <Button variant="contained" onClick={handleSendMessage}>
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AiChatWithSidebar;