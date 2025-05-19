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
  Typography,
  Button,
  AppBar,
  Toolbar,
  Paper,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { askMistral } from "../api/mistral";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Loader from "../components/Loader";
import ModernResume from "../components/ModernResume";

const drawerWidth = 260;

const getStyleAwareSystemInstruction = () => ({
  role: "system",
  content: `
You are a resume-enhancing AI that also handles visual customization.

Always respond with a valid JSON object representing the resume, including optional visual customizations under a "styleConfig" field.

Supported "styleConfig" keys:
- fontFamily
- fontSize
- headingColor
- headingSize
- headingWeight
- backgroundColor
- topBarColor
- leftColumnColor

Infer values from natural language instructions like:
- "make top bar blue" → topBarColor: "#007BFF"
- "use a modern font" → fontFamily: "Inter, sans-serif"
- "dark mode" → backgroundColor: "#121212"
- "make left column red" → leftColumnColor: "#FF0000"

Do NOT explain anything. Do NOT return markdown. Only return the JSON object.
`.trim()
});

const generateEnhancementPrompt = (data) => {
  const educationFormatted = data.educationList
    .map(e => `- ${e.degree} in ${e.field}, ${e.school} (${e.startDate} – ${e.endDate})`)
    .join('\n');

  const experienceFormatted = data.isFresher
    ? "- Fresher"
    : data.experienceList
      .map(e => `- ${e.position} at ${e.company} (${e.startDate} – ${e.endDate}): ${e.description}`)
      .join('\n');

  return `Enhance the following resume details to make it more professional, ATS-optimized, and structured.

Important:
- DO NOT mention skills in summary; make it a professional "About Me" section.
- DO NOT modify or embellish personal details like name, title, email, phone, or address.
- DO NOT fabricate experience. If isFresher is true, add only one experience entry with:
  position: "Fresher", company: "", startDate: "", endDate: "", description: "Recent graduate seeking opportunities to apply academic knowledge in a real-world environment and grow as a {title}."
- Keep summary focused, clean, and ATS-friendly.
- Return ONLY a valid JSON object with the following fields:

If the user’s prompt includes style or design preferences, also return a "styleConfig" object. This can include:
- fontFamily (e.g., "Georgia", "Arial", "Times New Roman", "Inter")
- fontSize (e.g., "16px", "14px")
- headingColor (e.g., "#333", "#007BFF")
- headingSize (e.g., "20px", "22px")
- backgroundColor (e.g., "#fff", "#121212")
- topBarColor (e.g., "#ccc", "#2a2a2a")

Infer intelligent defaults from natural language prompts like:
- “more formal” → fontFamily: "Georgia"
- “modern” → fontFamily: "Inter"
- “make it brighter” → backgroundColor: "#f9f9f9"
- “top bar black” → topBarColor: "#000"

{
  fullName: string,
  title: string,
  email: string,
  phone: string,
  address: string,
  summary: string,
  skills: array of strings,
  additionalSkills: array of strings,
  hobbies: array of strings,
  educationList: array of { degree, school, startDate, endDate },
  experienceList: array of { position, company, startDate, endDate, description },
  styleConfig: optional object
}

User Resume:
Full Name: ${data.fullName}
Title: ${data.title}
Email: ${data.email}
Phone: ${data.phone}
Address: ${data.address}
Summary: ${data.summary}
Skills: ${data.skills}
Additional Skills: ${data.additionalSkills}
Hobbies: ${data.hobbies}

Education:
${educationFormatted}

Experience:
${experienceFormatted}

Return only the enhanced JSON version.`;
};


const AiChatWithSidebar = () => {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [input, setInput] = useState("");
  const [editingChatId, setEditingChatId] = useState(null);
  const [chatNames, setChatNames] = useState({});
  const [resumeText, setResumeText] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentChatId) startNewChat();
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("resumeAiMessage");
    if (stored && currentChatId) {
      const parsed = JSON.parse(stored);
      const formattedPrompt = generateEnhancementPrompt(parsed);

      const autoSend = async () => {
        const userMsg = { sender: "user", text: formattedPrompt };
        const updatedChats = chats.map((chat) =>
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, userMsg] }
            : chat
        );
        setChats(updatedChats);

        setLoading(true);

        const aiResponse = await askMistral([{ role: "user", content: formattedPrompt }]);
        setLoading(false);
        const aiText = aiResponse.content;

        const aiMsg = { sender: "ai", text: aiText };
        const finalChats = updatedChats.map((chat) =>
          chat.id === currentChatId
            ? { ...chat, messages: [...chat.messages, aiMsg] }
            : chat
        );
        setChats(finalChats);
        setChatNames((prev) => ({ ...prev, [currentChatId]: "Resume Enhancement" }));

        try {
          const json = JSON.parse(aiText);
          setResumeText(json);
        } catch {
          setResumeText(null);
        }
      };

      autoSend();
      localStorage.removeItem("resumeAiMessage");
    }
  }, [currentChatId, chats]);

  const startNewChat = () => {
    const id = Date.now().toString();
    setChats((prev) => [...prev, { id, messages: [] }]);
    setCurrentChatId(id);
    setChatNames((prev) => ({ ...prev, [id]: "New Chat" }));
    setResumeText(null);
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
    setLoading(true);

    const currentChat = updatedChats.find((c) => c.id === currentChatId);
    const messageHistory = currentChat.messages.map((msg) => ({
      role: msg.sender === "user" ? "user" : "assistant",
      content: msg.text,
    }));

    const aiResponse = await askMistral([
      getStyleAwareSystemInstruction(),
      ...messageHistory,
      { role: "user", content: input }
    ]);

    setLoading(false);
    const aiText = aiResponse.content;
    const aiMsg = { sender: "ai", text: aiText };

    const finalChats = updatedChats.map((chat) =>
      chat.id === currentChatId
        ? { ...chat, messages: [...chat.messages, aiMsg] }
        : chat
    );
    setChats(finalChats);

    if (chatNames[currentChatId] === "New Chat") {
      const suggested = input.split(" ").slice(0, 4).join(" ");
      setChatNames((prev) => ({ ...prev, [currentChatId]: suggested }));
    }

    try {
      const json = JSON.parse(aiText);
      setResumeText(json);
    } catch {
      setResumeText(null);
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
  const handleDownload = async () => {
    const canvas = await html2canvas(document.getElementById("resume-template"));
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("Sanskar_SDE_Resume.pdf");

    // ✅ Save to localStorage for Dashboard Recent Activity
    localStorage.setItem(
      "recentActivity",
      JSON.stringify({
        fileName: "Sanskar_SDE_Resume.pdf",
        timestamp: new Date().toISOString(),
      })
    );
  };
  const generateFromLastAiResponse = () => {
    const currentChat = chats.find((c) => c.id === currentChatId);
    if (!currentChat) return;

    const lastAiMessage = [...currentChat.messages].reverse().find(m => m.sender === "ai");
    if (!lastAiMessage) {
      alert("No AI response found to generate resume.");
      return;
    }

    let rawText = lastAiMessage.text.trim();

    // Handle markdown code block
    const codeBlockMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      rawText = codeBlockMatch[1].trim();
    }

    // Try extracting a JSON block from anywhere in text
    const tryParseJsonFromString = (text) => {
      const jsonStart = text.indexOf("{");
      const jsonEnd = text.lastIndexOf("}");
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        const potentialJson = text.substring(jsonStart, jsonEnd + 1);
        try {
          return JSON.parse(potentialJson);
        } catch (e) {
          console.error("Failed JSON parse:", e);
          return null;
        }
      }
      return null;
    };

    const parsed = tryParseJsonFromString(rawText);

    if (!parsed) {
      alert("Last AI response could not be parsed as a valid resume JSON.");
      setResumeText(null);
      return;
    }

    setResumeText(parsed);
  };

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
                    onClick={() => {
                      setCurrentChatId(chat.id);
                      setResumeText(null);
                    }}
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
                whiteSpace: "pre-line",
              }}
            >
              <Typography variant="body2" fontWeight="bold">
                {msg.sender === "user" ? "You" : "AI"}
              </Typography>
              <Typography sx={{ whiteSpace: "pre-line" }}>{msg.text}</Typography>
            </Paper>
          ))}
          {loading && <Loader />}
        </Box>

        {resumeText && (
          <Box
            sx={{
              backgroundColor: "#fff",
              color: "#000",
              borderRadius: 2,
              padding: 3,
              mt: 2,
              boxShadow: 3,
            }}
          >
            <ModernResume data={resumeText} />
            <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
              <Button variant="contained" onClick={handleDownload}>
                Download PDF
              </Button>
              <Button variant="outlined" onClick={() => setResumeText(null)}>
                Clear Resume
              </Button>
            </Box>
          </Box>
        )}

        <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
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
          <Button variant="outlined" onClick={generateFromLastAiResponse}>
            Generate Resume
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AiChatWithSidebar;
