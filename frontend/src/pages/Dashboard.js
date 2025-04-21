import { Box, Typography } from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Dashboard() {
  return (
    <Box>
      <Navbar />
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Typography variant="h4">Welcome to Dashboard</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
