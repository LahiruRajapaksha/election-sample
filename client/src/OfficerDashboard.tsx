import { Box, Button, Card, Paper, Typography } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import React, { useState } from 'react';
import './OfficerDashboard.css';
import TableVote from './components/TableVote';

interface ElectionCommissionDashboardProps {}

interface ConstituencyResult {
  constituencyName: string;
  candidates: { name: string; votes: number }[];
}

const dataset = [
  {
    BlueParty: 59,
    RedParty: 41,
    YellowParty: 32,
    Independent: 28,
    constituencyName: 'Shangri-la-Town'
  },
  {
    BlueParty: 59,
    RedParty: 41,
    YellowParty: 32,
    Independent: 28,
    constituencyName: 'Northern-Kunlun-Mountain'
  },
  {
    BlueParty: 59,
    RedParty: 41,
    YellowParty: 32,
    Independent: 28,
    constituencyName: 'Western-Shangri-la'
  },
  {
    BlueParty: 59,
    RedParty: 41,
    YellowParty: 32,
    Independent: 28,
    constituencyName: 'Naboo-Vallery'
  },
  {
    BlueParty: 59,
    RedParty: 41,
    YellowParty: 32,
    Independent: 28,
    constituencyName: 'New-Felucia'
  },

]
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
        <>
          <Button variant="contained" size="small" sx={{ backgroundColor: 'red', '&:hover': { backgroundColor: 'red' } }} onClick={endElection}>
            End Election
          </Button>
        </>
      ) : (
        <>
          <Button variant="contained" size="small" sx={{ backgroundColor: '#333', '&:hover': { backgroundColor: '#333' } }} onClick={startElection}>
            Start Election
          </Button>
          <Typography variant="h6" style={{ margin: '20px 0' }}>
            Election Results
          </Typography>
          {!electionStarted && (
            <Typography variant="h6">
              {isMajorityAchieved ? "Majority Achieved - Winner Declared" : "Hung Parliament"}
            </Typography>
          )}
          <Box sx={{ pt: 5, px: 2, alignItems: "center" }}>
            <Box>
              <Typography variant='h6'>
                Party Results 
              </Typography>
              <Card>
                <PieChart
                  series={[
                    { 
                      highlightScope: { faded: 'global', highlighted: 'item' },
                      faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                      data: [
                        { id: 0, value: 10, label: 'Blue Party' , color: 'blue' }, 
                        { id: 1, value: 15, label: 'Red Party', color:'red' },
                        { id: 2, value: 20, label: 'Yellow Party', color: 'yellow'},
                        { id: 3, value: 25, label: 'Independent', color: 'green' },
                      ],
                    },
                  ]}
                  width={400}
                  height={200}
                />
              </Card>
            </Box>
            <Box>
              <Typography variant='h6'>
                Constituencies Results 
              </Typography>
              <Card>
                <BarChart
                  dataset={dataset}
                  xAxis={[{ scaleType: 'band', dataKey: 'constituencyName' }]}
                  series={[{
                    dataKey: 'BlueParty',
                    color: 'blue',
                    label: 'Blue Party',
                  },
                  {
                    dataKey: 'RedParty',
                    color: 'red',
                    label: 'Red Party',
                  },
                  {
                    dataKey: 'YellowParty',
                    color: 'yellow',
                    label: 'Yellow Party',
                  },
                  {
                    dataKey: 'Independent',
                    color: 'green',
                    label: 'Independent',
                  }
                  ]}
                  width={1000}
                  height={300}
                />
              </Card>
            </Box>
            <Box>
              <Typography variant='h6'>Detailed Stats</Typography>
              <TableVote />
            </Box>
          </Box>
        </>
      )}
    </Paper>
  </>
);
};

export default ElectionCommissionDashboard;