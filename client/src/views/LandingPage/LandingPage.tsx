import { Box, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../../components/LoginForm/LoginForm";
import RegisterForm from "../../components/RegistrationForm/RegisterForm";
import SnackBar from "../../components/SnackBar/SnackBar";
//import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();
  const [isLoginFormVisible, setLoginFormVisible] = useState(false);
  const [isSnackbarOpen, setSnackBarOpen] = useState(false);
  const [snackBarData, setSnackBarData] = useState({
    message: "",
    severity: "",
  });

  const handleLoginButtonClick = () => {
    setLoginFormVisible(!isLoginFormVisible);
  };

  const handleRegistrationSuccess = () => {
    setSnackBarData((data) => ({
      ...data,
      message: "User registered successfully",
      severity: "success",
    }));
    setSnackBarOpen((prev) => !prev);
    setLoginFormVisible(true);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
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
          {!isLoginFormVisible && (
            <RegisterForm
              handleRegistrationSuccess={handleRegistrationSuccess}
            />
          )}
        </Box>
      </Box>
      <SnackBar
        isSnackbarOpen={isSnackbarOpen}
        handleClose={handleClose}
        snackBarData={snackBarData}
      />
    </Box>
  );
}

export default LandingPage;
