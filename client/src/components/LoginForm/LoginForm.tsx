import { Box, Button, Container, TextField, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginUser } from "../../utills/datahandling";
import "./LoginForm.css";
import { AuthContext, UserData } from "../../Providers/AuthProvider";
import { jwtDecode } from "jwt-decode";



const Login = () => {
  const { login, isSuccess, data } = useLoginUser();
  const { loginSuccess } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (data && data.accessToken && isSuccess) {
      const decodedToken: UserData = jwtDecode(data.accessToken);
      loginSuccess({
        email: decodedToken.email,
        userType: decodedToken.userType,
        constituency: decodedToken.constituency,
        dateOfBirth: decodedToken.dateOfBirth,
        fullName: decodedToken.fullName,
        isVoted: decodedToken.isVoted,
        isAuthenticated: true,
      });
      if (decodedToken.userType === "officer")
        navigate("/officer-dashboard", { replace: true });
      else {
        navigate("/voter-dashboard", { replace: true });
      }
    }
    if (data === "Invalid credentials")
      setErrors((errors) => ({
        ...errors,
        password: "Invalid email or password",
      }));
  }, [data, navigate, isSuccess, loginSuccess]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setErrors({ ...errors, [name]: "" });
    setLoginDetails({ ...loginDetails, [name]: value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    login(loginDetails);
  };

  return (
    <Container className="login-container" maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Sign-in
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Email Address"
          variant="outlined"
          fullWidth
          margin="normal"
          name="email"
          type="email"
          value={loginDetails.email}
          onChange={handleInputChange}
          helperText={errors.email}
          error={Boolean(errors.email)}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          name="password"
          type="password"
          value={loginDetails.password}
          onChange={handleInputChange}
          helperText={errors.password}
          error={Boolean(errors.password)}
        />
        <Button
          variant="contained"
          type="submit"
          size="small"
          sx={{
            backgroundColor: "#333",
            "&:hover": { backgroundColor: "#333" },
          }}
        >
          Sign-in
        </Button>
      </Box>
    </Container>
  );
};

export default Login;
