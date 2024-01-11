import { Box, Button, MenuItem, Paper, Select, SelectChangeEvent, Typography } from '@mui/material';
import { useState } from 'react';
import './VoterDashboard.css';

type Candidate = {
  name: string;
  id: string;
};

type Party = {
  name: string;
  candidates: Candidate[];
};

const VoterDashboard = () => {
  const parties: Party[] = [
    {
      name: 'Blue Party',
      candidates: [
        { name: 'Candidate A1', id: 'a1' },
        { name: 'Candidate A2', id: 'a2' },
        { name: 'Candidate A3', id: 'a3' },
        { name: 'Candidate A4', id: 'a4' }
      ]
    },
    {
      name: 'Red Party',
      candidates: [
        { name: 'Candidate B1', id: 'b1' },
        { name: 'Candidate B2', id: 'b2' },
        { name: 'Candidate B3', id: 'b3' },
        { name: 'Candidate B4', id: 'b4' }
      ]
    },
    {
      name: 'Yellow Party',
      candidates: [
        { name: 'Candidate C1', id: 'c1' },
        { name: 'Candidate C2', id: 'c2' },
        { name: 'Candidate C3', id: 'c3' },
        { name: 'Candidate C4', id: 'c4' }
      ]
    },
    {
      name: 'Independent ',
      candidates: [
        { name: 'Candidate I1', id: 'i1' },
        { name: 'Candidate I2', id: 'i2' },
        { name: 'Candidate I3', id: 'i3' },
        { name: 'Candidate I4', id: 'i4' },
      ]
    }
  ];
  const [selectedParty, setSelectedParty] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [voteSubmitted, setVoteSubmitted] = useState<boolean>(false);
  const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>({});

  const handleViewCandidatesClick = (partyName: string) => {
    setDropdownOpen(prevState => ({
      ...prevState,
      [partyName]: !prevState[partyName]
    }));
    setSelectedParty(partyName);
    setSelectedCandidate('');
  };

  const handleCandidateChange = (event: SelectChangeEvent<string>) => {
    setSelectedCandidate(event.target.value as string);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(`You have voted for party: ${selectedParty} and candidate: ${selectedCandidate}`);
    setVoteSubmitted(true);
  };

  return (
    <>
    <Box sx={{ backgroundColor: '#333', display: "flex", justifyContent: "space-between", padding: "10px", alignItems: "center" }}>
        <Typography variant="h1" gutterBottom sx={{ fontSize: '2.5rem', fontWeight: "bolder", color: 'white' }}>
          GEVS
        </Typography>
        <Button sx={{ color: 'white' }} variant='contained'>
          Logout
        </Button>
      </Box>
      <Paper elevation={6} className="voter-dashboard">
        <Typography component="h1" variant="h5">
          Voter's Dashboard
        </Typography>
        <div className="voter-info">
          <div className="profile-pic-placeholder">
            {/* Image pic should go in here */}
          </div>
          <div className="voter-info-text">
          <Typography>Voter's Name</Typography>
          <Typography>Constituency</Typography>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
        {parties.map((party) => (
          <Box key={party.name} sx={{ marginBottom: '20px' }}>
            <Typography variant="h6">
              {party.name}
            </Typography>
            <Button 
              onClick={() => handleViewCandidatesClick(party.name)} 
              variant="contained" 
              sx={{ marginTop: '10px', display: 'block' , backgroundColor: '#333', '&:hover': { backgroundColor: '#333' } }}
            >
              View Candidates
            </Button>
            {dropdownOpen[party.name] && (
              <Select
                value={selectedCandidate}
                onChange={handleCandidateChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
                sx={{ marginTop: '10px' }}
                
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {party.candidates.map((candidate) => (
                  <MenuItem key={candidate.id} value={candidate.id}>{candidate.name}</MenuItem>
                ))}
              </Select>
            )}
          </Box>
        ))}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            type="submit" 
            variant="contained" 
            sx={{ backgroundColor: '#333', '&:hover': { backgroundColor: '#333' } }}
          >
            Submit Vote
          </Button>
        </Box>
        </form>
      </Paper>
    </>
  );
};

export default VoterDashboard;
