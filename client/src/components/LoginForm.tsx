import { Button, Container, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoginUser } from '../utills/datahandling';
import './LoginForm.css';

interface LoginProps {
}

const Login: React.FC<LoginProps> = () => {
  const { login,  isSuccess, data} = useLoginUser();
  const [loginDetails, setLoginDetails] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });


useEffect(() => {
  if (data === 'User logged in successfully' && isSuccess) 
  {
    handleNavigation('/voter-dashboard');
  }
   if(data === 'Invalid credentials')  (setErrors({ password: 'Invalid password', email: 'Invalid email address' }));
},[data])
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setLoginDetails({ ...loginDetails, [name]: value });

    validateInput(name, value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const isValid = validateAllFields();

    if (isValid) {
      console.log('Submitted successfully', loginDetails);
    } else {
      console.log('Error');
    }
  };

  const navigate = useNavigate();

  const handleLogin = () => {
    if (loginDetails.email && loginDetails.password) {
      login(loginDetails);
     } 
      if(!loginDetails.email ) {
      setErrors((errors) => ({ ...errors, email: 'Email is required' }));
     }
      if(!loginDetails.password) {
      setErrors((errors) => ({ ...errors, password: 'Password is required' }));
     } 
   
    
  }
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const validateInput = (name: string, value: string) => {
    switch (name) {
      case 'email':
        if (!value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)) {
          setErrors({ ...errors, email: 'Invalid email address' });
        } else {
          setErrors({ ...errors, email: '' });
        }
        break;
      case 'password':
        if (value.length < 8) {
          setErrors({
            ...errors,
            password: 'Password must be at least 8 characters',
          });
        } else {
          setErrors({ ...errors, password: '' });
        }
        break;
      default:
        break;
    }
  };
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateAllFields = () => {
    const isValid = Object.values(errors).every((error) => error === '');
    return isValid;
  };

  return (
    <Container className='login-container' maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Sign-in
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
          sx={{ backgroundColor: '#333', '&:hover': { backgroundColor: '#333' } }}
          onClick={handleLogin}
        >
          Sign-in
        </Button>
      </form>
    </Container>
  );
};

export default Login;
