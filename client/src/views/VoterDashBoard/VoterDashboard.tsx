import {
  Avatar,
  Box,
  Button,
  Card,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import "./VoterDashboard.css";
import { useGetCandidateList, useSubmitVote } from "../../utills/datahandling";
import { AuthContext } from "../../Providers/AuthProvider";
import candidateImage from "../../assets/voterImage.png";
import SnackBar from "../../components/SnackBar/SnackBar";
export type Candidate = {
  name: string;
  party: string;
};

export type Party = {
  name: string;
  candidates: Candidate[];
};

export type CandidateList = {
  candidates: Candidate[];
  parties: string[];
};

const VoterDashboard = () => {
  const { userData, logoutSuccess } = useContext(AuthContext);
  const { submitVote, submitVoteResponse } = useSubmitVote();
  const { data } = useGetCandidateList(userData.constituency || "");
  const [isSnackbarOpen, setSnackBarOpen] = useState(false);
  const [snackBarData, setSnackBarData] = useState({
    message: "",
    severity: "",
  });
  const { candidates = [], parties = [] } = data || {};
  const [selectedParty, setSelectedParty] = useState<string>("");
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");

  const handleViewCandidatesClick = (partyName: string) => {
    setSelectedParty(partyName);
    setSelectedCandidate("");
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  const handleCandidateChange = (event: SelectChangeEvent<string>) => {
    setSelectedCandidate(event.target.value as string);
  };

  useEffect(() => {
    if (submitVoteResponse === "Vote added successfully") {
      setSnackBarData((data) => ({
        ...data,
        message: "Vote submitted successfully",
        severity: "success",
      }));
      setSnackBarOpen((prev) => !prev);
    }
  }, [submitVoteResponse]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitVote({
      email: userData.email,
      candidateName: selectedCandidate,
      party: selectedParty,
    });
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
          GEVS - Voter Dashboard
        </Typography>
        <Button
          sx={{ color: "white" }}
          variant="contained"
          onClick={logoutSuccess}
        >
          Logout
        </Button>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-around",
          mt: 3,
          mx: 2,
          gap: 1,
        }}
      >
        <Card sx={{ flexGrow: 1 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              p: 3,
            }}
          >
            <Avatar
              alt="Remy Sharp"
              src={candidateImage}
              sx={{ width: 160, height: 160 }}
            />
            <Typography variant="h6" sx={{ textAlign: "left" }}>
              {`Full Name : ${userData.fullName}`}
            </Typography>
            <Typography variant="h6" sx={{}}>
              {`Constituency : ${userData.constituency}`}
            </Typography>
            <Typography variant="h6" sx={{ textAlign: "center" }}>
              {` ${userData.email}`}
            </Typography>
            <Typography variant="h6" sx={{ textAlign: "center" }}>
              {` ${userData.dateOfBirth}`}
            </Typography>
          </Box>
        </Card>
        {!userData.isVoted && (
          <Card sx={{ flexGrow: 2 }}>
            <Box sx={{ p: 3 }}>
              <Typography variant="h5" sx={{ textAlign: "center" }}>
                Cast Your Vote
              </Typography>
              <form onSubmit={handleSubmit}>
                <Typography variant="h6">Select Party</Typography>
                <Select
                  sx={{ width: "100%" }}
                  value={selectedParty}
                  onChange={(event) =>
                    handleViewCandidatesClick(event.target.value)
                  }
                >
                  {parties.map((party: string, index: number) => (
                    <MenuItem key={`${index}-${party}`} value={party}>
                      {party}
                    </MenuItem>
                  ))}
                </Select>
                {selectedParty && (
                  <Box>
                    <Typography variant="h6">Select Candidate</Typography>
                    <Select
                      sx={{ width: "100%" }}
                      value={selectedCandidate}
                      onChange={handleCandidateChange}
                    >
                      {candidates
                        .filter(
                          (candidate) => candidate.party === selectedParty
                        )
                        .map((candidate: Candidate, index: number) => (
                          <MenuItem
                            key={`${index}-${candidate.name}`}
                            value={candidate.name}
                          >
                            {candidate.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </Box>
                )}
                <Button
                  sx={{ marginTop: "10px" }}
                  variant="contained"
                  type="submit"
                  disabled={!selectedCandidate || !selectedParty}
                >
                  Submit
                </Button>
              </form>
            </Box>
          </Card>
        )}
      </Box>
      <SnackBar
        isSnackbarOpen={isSnackbarOpen}
        handleClose={handleClose}
        snackBarData={snackBarData}
      />
    </Box>
  );
};

export default VoterDashboard;
