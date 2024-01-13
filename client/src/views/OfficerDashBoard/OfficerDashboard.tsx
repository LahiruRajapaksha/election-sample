import { Box, Button, Card, Paper, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import React, { useContext, useState } from "react";
import "./OfficerDashboard.css";
import TableVote from "../../components/TableVote";
import { AuthContext } from "../../Providers/AuthProvider";

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
    constituencyName: "Shangri-la-Town",
  },
  {
    BlueParty: 59,
    RedParty: 41,
    YellowParty: 32,
    Independent: 28,
    constituencyName: "Northern-Kunlun-Mountain",
  },
  {
    BlueParty: 59,
    RedParty: 41,
    YellowParty: 32,
    Independent: 28,
    constituencyName: "Western-Shangri-La",
  },
  {
    BlueParty: 59,
    RedParty: 41,
    YellowParty: 32,
    Independent: 28,
    constituencyName: "Naboo-Vallery",
  },
  {
    BlueParty: 59,
    RedParty: 41,
    YellowParty: 32,
    Independent: 28,
    constituencyName: "New-Felucia",
  },
];
const ElectionCommissionDashboard: React.FC<
  ElectionCommissionDashboardProps
> = () => {
  const { userData, logoutSuccess } = useContext(AuthContext);

  const [electionStarted, setElectionStarted] = useState(false);

  const startEndElection = () => {
    setElectionStarted((prev) => !prev);
  };

  return (
    <Box>
      <Box
        sx={{
          backgroundColor: "#333",
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
          alignItems: "center",
        }}
      >
        <Typography
          variant="h1"
          gutterBottom
          sx={{ fontSize: "2.5rem", fontWeight: "bolder", color: "white" }}
        >
          GEVS - Election Commission Dashboard
        </Typography>
        <Button
          sx={{ color: "white" }}
          variant="contained"
          onClick={logoutSuccess}
        >
          Logout
        </Button>
      </Box>
      <Paper elevation={6} className="ec-dashboard" sx={{ mx: 2, mt: 2 }}>
        <Button
          variant="contained"
          size="small"
          sx={{
            backgroundColor: electionStarted ? "red" : "#333",
            "&:hover": {
              backgroundColor: electionStarted ? "red" : "#333",
            },
          }}
          onClick={startEndElection}
        >
          {electionStarted ? "End Election" : "Start Election"}
        </Button>
      </Paper>
      <Box
        sx={{
          pt: 5,
          px: 2,
          display: "flex",
          flexDirection: "column",
          rowGap: 3,
        }}
      >
        <Card sx={{ display: "flex", justifyContent: "space-around" }}>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ py: 2 }}>
              Party Results
            </Typography>
            <PieChart
              series={[
                {
                  highlightScope: {
                    faded: "global",
                    highlighted: "item",
                  },
                  faded: {
                    innerRadius: 30,
                    additionalRadius: -20,
                    color: "gray",
                  },
                  data: [
                    {
                      id: 0,
                      value: 10,
                      label: "Blue Party",
                      color: "blue",
                    },
                    {
                      id: 1,
                      value: 15,
                      label: "Red Party",
                      color: "red",
                    },
                    {
                      id: 2,
                      value: 20,
                      label: "Yellow Party",
                      color: "yellow",
                    },
                    {
                      id: 3,
                      value: 25,
                      label: "Independent",
                      color: "green",
                    },
                  ],
                },
              ]}
              width={400}
              height={250}
            />
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ py: 2 }}>
              Constituencies Results
            </Typography>
            <BarChart
              dataset={dataset}
              xAxis={[
                {
                  scaleType: "band",
                  dataKey: "constituencyName",
                },
              ]}
              series={[
                {
                  dataKey: "BlueParty",
                  color: "blue",
                  label: "Blue Party",
                },
                {
                  dataKey: "RedParty",
                  color: "red",
                  label: "Red Party",
                },
                {
                  dataKey: "YellowParty",
                  color: "yellow",
                  label: "Yellow Party",
                },
                {
                  dataKey: "Independent",
                  color: "green",
                  label: "Independent",
                },
              ]}
              width={900}
              height={300}
            />
          </Box>
        </Card>
        <Box sx={{ pb: 5 }}>
          <Typography variant="h6" sx={{ pb: 1 }}>
            Detailed Stats
          </Typography>
          <TableVote />
        </Box>
      </Box>
    </Box>
  );
};

export default ElectionCommissionDashboard;
