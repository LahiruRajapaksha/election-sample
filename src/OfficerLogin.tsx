import { Button, Container, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './OfficerLogin.css';

interface LoginProps {
}

const Login: React.FC<LoginProps> = () => {
  const [loginDetails, setLoginDetails] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginDetails({ ...loginDetails, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(loginDetails);
  };

  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
       Officer Sign-in
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email Address"
          variant="outlined"
          fullWidth
          margin="normal"
          name="email"
          type="email"
          value={loginDetails.email}
          onChange={handleInputChange}
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
        />
        <Button  
        variant="contained" 
         size="small" 
        sx={{ backgroundColor: '#333', '&:hover': { backgroundColor: '#333' } }}
        onClick={() => handleNavigation('/officer-dashboard')}>
          Log In
        </Button>
      </form>
    </Container>
  );
};

export default Login;
