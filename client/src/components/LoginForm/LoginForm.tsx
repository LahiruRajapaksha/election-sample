import { Box, Button, Card, TextField, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginUser } from "../../utills/datahandling";
import { AuthContext, UserData } from "../../Providers/AuthProvider";
import { jwtDecode } from "jwt-decode";

export type LoginDetails = {
  email: string;
  password: string;
};

const Login = () => {
  const { login, isSuccess, data, isLoginPending } = useLoginUser();
  const { loginSuccess } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loginDetails, setLoginDetails] = useState<LoginDetails>({
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
        electionStatus: decodedToken.electionStatus,
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
    if (!loginDetails.email) {
      setErrors((errors) => ({ ...errors, email: "Email is required" }));
    } else if (!loginDetails.password) {
      setErrors((errors) => ({ ...errors, password: "Password is required" }));
    } else {
      login(loginDetails);
    }
  };

  return (
    <Card sx={{ p: 4 }}>
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
          disabled={isLoginPending}
        >
          {isLoginPending ? "Signing" : "Sign-in"}
        </Button>
      </Box>
    </Card>
  );
};

export default Login;
