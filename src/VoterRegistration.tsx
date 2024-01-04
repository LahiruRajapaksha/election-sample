import { Button, Container, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import './VoterRegistration.css';

interface VoterRegistrationProps {}

const VoterRegistration: React.FC<VoterRegistrationProps> = () => {
  const [voterDetails, setVoterDetails] = useState({
    email: '',
    fullName: '',
    dateOfBirth: '',
    password: '',
    constituency: '',
    uvc: '',
  });

  const [errors, setErrors] = useState({
    email: '',
    fullName: '',
    dateOfBirth: '',
    password: '',
    constituency: '',
    uvc: '',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setVoterDetails({ ...voterDetails, [name]: value });

    validateInput(name, value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const isValid = validateAllFields();

    if (isValid) {
      console.log(' Submitted successfully', voterDetails);
    } else {
      console.log('Error');
    }
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
      case 'fullName':
        if (value.trim() === '') {
          setErrors({ ...errors, fullName: 'Full name is required' });
        } else {
          setErrors({ ...errors, fullName: '' });
        }
        break;
      case 'dateOfBirth':
        if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) {
          setErrors({ ...errors, dateOfBirth: 'Invalid date format' });
        } else {
          setErrors({ ...errors, dateOfBirth: '' });
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

  const validateAllFields = () => {
    const isValid = Object.values(errors).every((error) => error === '');
    return isValid;
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setVoterDetails({
      ...voterDetails,
      [event.target.name as string]: event.target.value,
    });
  };
  return (
    <Container className="container" maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Voter Registration
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Voter ID (Email Address)"
          variant="outlined"
          fullWidth
          margin="normal"
          name="email"
          type="email"
          value={voterDetails.email}
          onChange={handleInputChange}
          helperText={errors.email} 
          error={Boolean(errors.email)} 
        />
        <TextField
          label="Full Name"
          variant="outlined"
          fullWidth
          margin="normal"
          name="fullName"
          value={voterDetails.fullName}
          onChange={handleInputChange}
          helperText={errors.fullName}
          error={Boolean(errors.fullName)}
        />
        <TextField
          label="Date of Birth"
          variant="outlined"
          fullWidth
          margin="normal"
          name="dateOfBirth"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={voterDetails.dateOfBirth}
          onChange={handleInputChange}
          helperText={errors.dateOfBirth}
          error={Boolean(errors.dateOfBirth)}
        />
        <TextField
          label="Password"
          variant="outlined"
          fullWidth
          margin="normal"
          name="password"
          type="password"
          value={voterDetails.password}
          onChange={handleInputChange}
          helperText={errors.password}
          error={Boolean(errors.password)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Constituency</InputLabel>
          <Select
            name="constituency"
            value={voterDetails.constituency}
            label="Constituency"
            onChange={handleSelectChange}
            error={Boolean(errors.constituency)}
          >
            <MenuItem value="Constituency1">Shangri-la-Town</MenuItem>
            <MenuItem value="Constituency2">Northern-Kunlun-Mountain</MenuItem>
            <MenuItem value="Constituency3">Western-Shangri-la</MenuItem>
            <MenuItem value="Constituency4">Naboo-Vallery</MenuItem>
            <MenuItem value="Constituency5">New-Felucia</MenuItem>
          </Select>
          <div style={{ color: 'red' }}>{errors.constituency}</div>
        </FormControl>
        <TextField
          label="8-digit Unique Voter Code (UVC)"
          variant="outlined"
          fullWidth
          margin="normal"
          name="uvc"
          value={voterDetails.uvc}
          onChange={handleInputChange}
          helperText={errors.uvc}
          error={Boolean(errors.uvc)}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <Button
          variant="contained"
          size="small"
          sx={{ backgroundColor: '#333', '&:hover': { backgroundColor: '#333' }}} 
        >
          Scan QR Code
        </Button>

        <Button
          variant="contained"
          type="submit"
          size="small"
          sx={{ backgroundColor: '#333', '&:hover': { backgroundColor: '#333' }}}
        >
          Register
        </Button>
        </div>
      </form>
    </Container>
    );

};

export default VoterRegistration;
