import { Box, Button, Card, Typography } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import React, { useContext, useEffect, useState } from "react";
import TableVote from "../../components/TableVote";
import { AuthContext } from "../../Providers/AuthProvider";
import {
  useGetOverAllPartyElectionResults,
  useGetResultsByConstituency,
  useStartEndElection,
} from "../../utills/datahandling";
import SnackBar from "../../components/SnackBar/SnackBar";

interface ElectionCommissionDashboardProps {}

const ElectionCommissionDashboard: React.FC<
  ElectionCommissionDashboardProps
> = () => {
  const { logoutSuccess } = useContext(AuthContext);
  const { overAllPartyResults, winner, status, parties } =
    useGetOverAllPartyElectionResults();
  const { barChartData, tableData } = useGetResultsByConstituency();
  const { electionToggleData, isElectionStarting, startEndElectionMutation } =
    useStartEndElection();

  const [electionStarted, setElectionStarted] = useState(false);
  const [isElectionStarted, setIsElectionStarted] = useState(false);
  const [isSnackbarOpen, setSnackBarOpen] = useState(false);
  const [snackBarData, setSnackBarData] = useState({
    message: "",
    severity: "",
  });

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };
  const startEndElection = () => {
    setElectionStarted((prev) => !prev);
    startEndElectionMutation(!electionStarted);
  };

  useEffect(() => {
    if (electionToggleData) {
      setSnackBarData((data) => ({
        ...data,
        message: electionToggleData,
        severity: "success",
      }));
      setSnackBarOpen((prev) => !prev);
      setIsElectionStarted((prev) => !prev);
    }
  }, [electionToggleData]);

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
      <Card
        elevation={6}
        sx={{ mx: 2, mt: 2, p: 2, display: "flex", alignItems: "center" }}
      >
        <Button
          variant="contained"
          size="small"
          sx={{
            backgroundColor: isElectionStarted ? "red" : "#333",
            "&:hover": {
              backgroundColor: isElectionStarted ? "red" : "#333",
            },
          }}
          onClick={startEndElection}
        >
          {isElectionStarting
            ? "Loading..."
            : isElectionStarted
            ? "End Election"
            : "Start Election"}
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
      </Card>
      <Box
        sx={{
          pt: 5,
          px: 2,
          display: "flex",
          flexDirection: "column",
          rowGap: 3,
        }}
      >
        <Card
          sx={{
            display: "flex",
            justifyContent: "space-around",
            py: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              flexGrow: 2,
            }}
          >
            <Typography variant="h6" sx={{ py: 2, fontWeight: "bold" }}>
              Total Number of Seats
            </Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ml: 4,
              }}
            >
              {parties?.map((party) => (
                <>
                  <Box
                    sx={{
                      backgroundColor:
                        party === "Independent Party"
                          ? "green"
                          : party.split(" ")[0].toLowerCase(),
                      width: 20,
                      height: 20,
                      mr: 1,
                    }}
                  />
                  <Typography sx={{ mx: 1 }}>{party}</Typography>
                </>
              ))}
            </Box>
            <PieChart
              series={[
                {
                  highlightScope: {
                    faded: "global",
                    highlighted: "item",
                  },
                  faded: {
                    innerRadius: 20,
                    additionalRadius: -30,
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
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" sx={{ py: 2, fontWeight: "bold" }}>
              Constituencies Results
            </Typography>
            <BarChart
              dataset={barChartData || [{}]}
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
              width={850}
              height={300}
            />
          </Box>
        </Card>
        <Box sx={{ pb: 5 }}>
          <Typography variant="h6" sx={{ my: 2, ml: 2, fontWeight: "bold" }}>
            Vote Count For Each Candidate
          </Typography>
          <TableVote tableData={tableData} />
        </Box>
      </Box>
      <SnackBar
        isSnackbarOpen={isSnackbarOpen}
        handleClose={handleClose}
        snackBarData={snackBarData}
      />
    </Box>
  );
};

export default ElectionCommissionDashboard;
