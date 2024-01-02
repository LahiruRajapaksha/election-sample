import { Button, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import './VoterRegistration.css';

interface VoterRegistrationProps {
}

const VoterRegistration: React.FC<VoterRegistrationProps> = () => {
  const [voterDetails, setVoterDetails] = useState({
    email: '',
    fullName: '',
    dateOfBirth: '',
    password: '',
    constituency: '',
    uvc: '',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVoterDetails({ ...voterDetails, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(voterDetails);
  };

  return (
    <Container maxWidth="sm">
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
        />
        <TextField
          label="Full Name"
          variant="outlined"
          fullWidth
          margin="normal"
          name="fullName"
          value={voterDetails.fullName}
          onChange={handleInputChange}
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
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Constituency</InputLabel>
          <Select
            name="constituency"
            value={voterDetails.constituency}
            label="Constituency"
          >
            <MenuItem value="Constituency1">Shangri-la-Town</MenuItem>
            <MenuItem value="Constituency2">Northern-Kunlun-Mountain</MenuItem>
            <MenuItem value="Constituency2">Western-Shangri-la</MenuItem>
            <MenuItem value="Constituency2">Naboo-Vallery</MenuItem>
            <MenuItem value="Constituency2">New-Felucia</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="8-digit Unique Voter Code (UVC)"
          variant="outlined"
          fullWidth
          margin="normal"
          name="uvc"
          value={voterDetails.uvc}
          onChange={handleInputChange}
        />
        <Button variant="contained" size="small" sx={{ backgroundColor: '#333', '&:hover': { backgroundColor: '#333' } }}>
          Register
        </Button>
      </form>
    </Container>
  );
};

export default VoterRegistration;
