import { Box, Button, FormControlLabel, Paper, Radio, RadioGroup, Typography } from '@mui/material';
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
    }
  ];
  const [selectedParty, setSelectedParty] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [voteSubmitted, setVoteSubmitted] = useState<boolean>(false); //note voting submission 

  const handlePartyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedParty(event.target.value);
    setSelectedCandidate('');
  };

  const handleCandidateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCandidate(event.target.value);
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
          {parties.map((party, /*index*/) => (
             <Box key={party.name} sx={{ marginBottom: '10px' }}>
              <Typography variant="h6">{party.name}</Typography>
              <RadioGroup
                name="candidate-selection"
                value={selectedCandidate}
                onChange={handleCandidateChange}
              >
                {party.candidates.map((candidate) => (
                  <FormControlLabel
                    key={candidate.id}
                    value={candidate.id}
                    control={<Radio />}
                    label={candidate.name}
                  />
                ))}
              </RadioGroup>
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
