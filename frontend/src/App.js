import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CreateResume from "./pages/CreateResume"; // ✅ Import CreateResume page
import AIChat from './pages/AIChat';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-resume" element={<CreateResume />} /> {/* ✅ Add this route */}
        <Route path="/ai-chat" element={<AIChat />} />
      </Routes>
    </Router>
  );
}

export default App;
