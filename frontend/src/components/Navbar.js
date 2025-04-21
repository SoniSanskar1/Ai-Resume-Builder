import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange); // Listen for changes

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Token remove kar diya
    alert("You have been logged out!"); // Logout confirmation pop-up
    setIsLoggedIn(false);
    navigate("/login"); // Redirect to login page
  };
  

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          AI Resume Builder
        </Typography>
        {isLoggedIn ? (
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Button color="inherit" onClick={() => navigate("/login")}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
