import React, { useState } from "react";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Signup = () => {
    const [user, setUser] = useState({ name: "", email: "", password: "" });
    const navigate = useNavigate(); // ✅ Navigation for redirect

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser(user);
            alert("User Registered Successfully!");
            navigate("/login"); // ✅ Auto-redirect to login page
        } catch (error) {
            alert("Signup Failed! Please try again.");
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 8, p: 3, boxShadow: 3, borderRadius: 2 }}>
                <Typography variant="h4" align="center">Signup</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField fullWidth margin="normal" label="Name" name="name" value={user.name} onChange={handleChange} required />
                    <TextField fullWidth margin="normal" label="Email" name="email" value={user.email} onChange={handleChange} required />
                    <TextField fullWidth margin="normal" type="password" label="Password" name="password" value={user.password} onChange={handleChange} required />
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Register
                    </Button>
                </form>
                
                {/* ✅ Back to Login Button */}
                <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
                    Already have an account? <Link to="/login">Login here</Link>
                </Typography>
            </Box>
        </Container>
    );
};

export default Signup;
