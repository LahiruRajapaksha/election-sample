import { Box, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/LoginForm/LoginForm";
import RegisterForm from "../../components/RegistrationForm/RegisterForm";
//import './LandingPage.css';

function LandingPage() {
  const [isLoginFormVisible, setLoginFormVisible] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };
  const handleLoginButtonClick = () => {
    setLoginFormVisible(!isLoginFormVisible);
  };

  const handleRegistrationSuccess = () => {
    setLoginFormVisible(true);
  };

  return (
    <Box sx={{ height: "100%" }}>
      <Box
        sx={{
          backgroundColor: "#333",
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h1"
          gutterBottom
          sx={{ fontSize: "2.5rem", fontWeight: "bolder", color: "white" }}
        >
          GEVS
        </Typography>
        <Button
          sx={{ color: "white" }}
          variant="contained"
          onClick={handleLoginButtonClick}
        >
          {isLoginFormVisible ? "Register" : "Login"}
        </Button>
      </Box>
      <Box>
        <Box></Box>
        <Box>
          {isLoginFormVisible && <LoginForm />}
          {!isLoginFormVisible && <RegisterForm />}
        </Box>
      </Box>
    </Box>
  );
}

export default LandingPage;
