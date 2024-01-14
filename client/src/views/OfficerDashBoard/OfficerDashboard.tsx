import { Box, Button, Card, Paper, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import React, { useContext, useState } from "react";
import "./OfficerDashboard.css";
import TableVote from "../../components/TableVote";
import { AuthContext } from "../../Providers/AuthProvider";
import {
  useGetOverAllPartyElectionResults,
  useGetResultsByConstituency,
} from "../../utills/datahandling";

interface ElectionCommissionDashboardProps {}

const ElectionCommissionDashboard: React.FC<
  ElectionCommissionDashboardProps
> = () => {
  const { logoutSuccess } = useContext(AuthContext);
  const { overAllPartyResults, winner, status } =
    useGetOverAllPartyElectionResults();
  const { barChartData, tableData } = useGetResultsByConstituency();

  const [electionStarted, setElectionStarted] = useState(false);
  // console.log("barChartData", barChartData);
  // console.log("status", status);

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
      <Paper
        elevation={6}
        className="ec-dashboard"
        sx={{ mx: 2, mt: 2, display: "flex", alignItems: "center" }}
      >
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
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6" sx={{ pl: 2, fontWeight: "bold" }}>
            Election status:
          </Typography>
          <Box
            sx={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              backgroundColor:
                status === "Completed"
                  ? "yellow"
                  : status === "In Progress"
                  ? "green"
                  : "red",
              ml: 2,
            }}
          />
          <Typography variant="h6" sx={{ pl: 1 }}>
            {status}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography variant="h6" sx={{ pl: 2, fontWeight: "bold" }}>
            WINNER:
          </Typography>
          <Typography variant="h6" sx={{ pl: 1 }}>
            {winner}
          </Typography>
        </Box>
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
                  data: overAllPartyResults || [],
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
              dataset={barChartData || []}
              xAxis={[
                {
                  scaleType: "band",
                  dataKey: "constituencyName",
                },
              ]}
              series={[
                {
                  dataKey: "Blue Party",
                  color: "blue",
                  label: "Blue Party",
                },
                {
                  dataKey: "Red Party",
                  color: "red",
                  label: "Red Party",
                },
                {
                  dataKey: "Yellow Party",
                  color: "yellow",
                  label: "Yellow Party",
                },
                {
                  dataKey: "Independent Party",
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
          <TableVote tableData={tableData} />
        </Box>
      </Box>
    </Box>
  );
};

export default ElectionCommissionDashboard;
