import { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api"; // ✅ API call function
import { Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const token = await loginUser({ email, password }); // ✅ Get JWT token
      if (token) {
        localStorage.setItem("token", token); // ✅ Store JWT token
        alert("Login Successful!");
        navigate("/dashboard"); // ✅ Redirect to dashboard after login
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert(error.response?.data || "Login Failed! Check your credentials.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, p: 3, boxShadow: 3, borderRadius: 2 }}>
        <Typography variant="h4" textAlign="center" gutterBottom>
          Login
        </Typography>
        <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </Typography>
        <TextField
          fullWidth
          label="Email"
          variant="outlined"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          variant="outlined"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button fullWidth variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleLogin}>
          Login
        </Button>
      </Box>
    </Container>
  );
}

export default Login;
