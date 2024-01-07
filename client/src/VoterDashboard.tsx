import { Button, Container, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import React, { useState } from 'react';
import './VoterDashboard.css';

interface VoterDashboardProps {
}

interface Candidate {
  id: string;
  name: string;
}

const VoterDashboard: React.FC<VoterDashboardProps> = () => {
  const candidates: Candidate[] = [
    { id: 'candidate-1', name: 'Candidate 1' },
    { id: 'candidate-2', name: 'Candidate 2' },
  ];

  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [voteSubmitted, setVoteSubmitted] = useState<boolean>(false);

  const handleVoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedCandidate((event.target as HTMLInputElement).value);
  };

  const handleSubmitVote = () => {
    console.log('Voted for: ', selectedCandidate);
    setVoteSubmitted(true);
  };

  if (voteSubmitted) {
    return (
      <Container className='dashboard-container'>
        <Typography variant="h5">
          Thank you for voting!
        </Typography>
      </Container>
    );
  }

  return (
    <Container className='dashboard-container'>
      <Typography variant="h4" gutterBottom>
        Voter Dashboard
      </Typography>

      <Typography variant="h6" style={{ margin: '20px 0' }}>
        Select a candidate for MP:
      </Typography>

      <RadioGroup value={selectedCandidate} onChange={handleVoteChange}>
        {candidates.map(candidate => (
          <FormControlLabel 
            key={candidate.id} 
            value={candidate.id} 
            control={<Radio />} 
            label={candidate.name} 
            disabled={voteSubmitted}
          />
        ))}
      </RadioGroup>

      <Button 
        variant="contained" 
        size="small" 
        sx={{ backgroundColor: '#333', '&:hover': { backgroundColor: '#333' } }}
        onClick={handleSubmitVote}
        disabled={!selectedCandidate || voteSubmitted}
      >
        Submit Vote
      </Button>
    </Container>
  );
};

export default VoterDashboard;
