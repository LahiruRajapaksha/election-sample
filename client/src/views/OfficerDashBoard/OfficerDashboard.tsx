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

interface ConstituencyResult {
  constituencyName: string;
  candidates: { name: string; votes: number }[];
}

// const dataset = [
//   {
//     BlueParty: 59,
//     RedParty: 41,
//     YellowParty: 32,
//     Independent: 28,
//     constituencyName: "Shangri-la-Town",
//   },
//   {
//     BlueParty: 59,
//     RedParty: 41,
//     YellowParty: 32,
//     Independent: 28,
//     constituencyName: "Northern-Kunlun-Mountain",
//   },
//   {
//     BlueParty: 59,
//     RedParty: 41,
//     YellowParty: 32,
//     Independent: 28,
//     constituencyName: "Western-Shangri-La",
//   },
//   {
//     BlueParty: 59,
//     RedParty: 41,
//     YellowParty: 32,
//     Independent: 28,
//     constituencyName: "Naboo-Vallery",
//   },
//   {
//     BlueParty: 59,
//     RedParty: 41,
//     YellowParty: 32,
//     Independent: 28,
//     constituencyName: "New-Felucia",
//   },
// ];
const ElectionCommissionDashboard: React.FC<
  ElectionCommissionDashboardProps
> = () => {
  const { logoutSuccess } = useContext(AuthContext);
  const { overAllPartyResults, isAllResultsLoading, winner, status } =
    useGetOverAllPartyElectionResults();
  const {
    resultsByConstituency,
    isConstituencyResultsLoading,
    barChartData,
    tableData,
  } = useGetResultsByConstituency();

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
                  //   [
                  //   {
                  //     id: 0,
                  //     value: 10,
                  //     label: "Blue Party",
                  //     color: "blue",
                  //   },
                  //   {
                  //     id: 1,
                  //     value: 15,
                  //     label: "Red Party",
                  //     color: "red",
                  //   },
                  //   {
                  //     id: 2,
                  //     value: 20,
                  //     label: "Yellow Party",
                  //     color: "yellow",
                  //   },
                  //   {
                  //     id: 3,
                  //     value: 25,
                  //     label: "Independent",
                  //     color: "green",
                  //   },
                  // ],
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
