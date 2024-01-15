import { Box, Button } from "@mui/material";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import LoginForm from "../../components/LoginForm/LoginForm";
import RegisterForm from "../../components/RegistrationForm/RegisterForm";
import SnackBar from "../../components/SnackBar/SnackBar";
import landingPageImage from "../../assets/landingPageImage.jpg";
function LandingPage() {
  const [isLoginFormVisible, setLoginFormVisible] = useState(true);
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        rowGap: 5,
      }}
    >
      <Box
        sx={{
          backgroundColor: "#333",
          display: "flex",
          justifyContent: "space-between",
          padding: 1,
          alignItems: "center",
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{ fontWeight: "bold", color: "white", ml: 4, mt: 1 }}
        >
          GEVS
        </Typography>
        <Button
          sx={{ color: "white", mr: 4 }}
          variant="contained"
          onClick={handleLoginButtonClick}
        >
          {isLoginFormVisible ? "Register" : "Login"}
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        {isLoginFormVisible && (
          <Box
            component="img"
            src={landingPageImage}
            alt="landing page image"
            sx={{ maxWidth: "45%", borderRadius: 2 }}
          />
        )}
        {isLoginFormVisible && <LoginForm />}
        <Box>
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
