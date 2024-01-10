import { Box, Button, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './OfficerDashboard.css';

interface ElectionCommissionDashboardProps {
}
interface ConstituencyResult {
  constituencyName: string;
  candidates: { name: string; votes: number }[];
}

const ElectionCommissionDashboard: React.FC<ElectionCommissionDashboardProps> = () => {
  const [electionStarted, setElectionStarted] = useState(false);
  const [results, setResults] = useState<ConstituencyResult[]>([]);
  const [isMajorityAchieved, setIsMajorityAchieved] = useState(false);

  const startElection = () => {
    setElectionStarted(true);
  };

  const endElection = () => {
    setElectionStarted(false);
  };

  useEffect(() => {
  }, [electionStarted]);

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
        <Paper elevation={6} className="ec-dashboard">
        <Typography component="h1" variant="h5">
        Election Commission Dashboard
        </Typography>
        <div className="ecf-info ">
          <div className="profile-pic-placeholder">
            {/* Image pic should go in here */}
          </div>
          <div className="ec-info-text">
          <Typography>Election Commission</Typography>
          </div>
        </div>
      {electionStarted ? (
        <Button variant="contained" size="small" sx={{ backgroundColor: 'red', '&:hover': { backgroundColor: 'red' } }} onClick={endElection}>
          End Election
        </Button>
      ) : (
        <Button variant="contained" size="small" sx={{ backgroundColor: '#333', '&:hover': { backgroundColor: '#333' } }} onClick={startElection}>
          Start Election
        </Button>
      )}

      <Typography variant="h6" style={{ margin: '20px 0' }}>
        Election Results
      </Typography>
    
      <List>
        {results.map((result, index) => (
          <ListItem key={index}>
            <ListItemText
              primary={result.constituencyName}
              secondary={result.candidates.map(candidate => `${candidate.name}: ${candidate.votes} votes`).join(', ')}
            />
          </ListItem>
        ))}
      </List>
      {!electionStarted && (
        <Typography variant="h6">
          {isMajorityAchieved ? "Majority Achieved - Winner Declared" : "Hung Parliament"}
        </Typography>
      )}
      </Paper>
    </>
  );
};
export default ElectionCommissionDashboard;
