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
import { useGetCandidateList } from "../../utills/datahandling";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Providers/AuthProvider";

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
  const { data, refetch, isLoading } = useGetCandidateList("Shangri-la-Town");
  const { candidates = [], parties = [] } = data || {};
  const location = useLocation();
  const userDetails = location.state || {};
  const { email = "", name = "", constituency = "" } = userDetails;
  const [selectedParty, setSelectedParty] = useState<string>("");
  const [selectedCandidate, setSelectedCandidate] = useState<string>("");
  const { setIsAuthenticated } = useContext(AuthContext);

  const handleViewCandidatesClick = (partyName: string) => {
    setSelectedParty(partyName);
    setSelectedCandidate("");
  };

  const handleCandidateChange = (event: SelectChangeEvent<string>) => {
    setSelectedCandidate(event.target.value as string);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(
      `You have voted for party: ${selectedParty} and candidate: ${selectedCandidate}`
    );
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
        <Button sx={{ color: "white" }} variant="contained">
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
              src="/static/images/avatar/1.jpg"
              sx={{ width: 120, height: 120 }}
            />
            <Typography variant="h6" sx={{ textAlign: "left" }}>
              {`Full Name : ${name}`}
            </Typography>
            <Typography variant="h6" sx={{}}>
              {`Constituency : ${constituency}`}
            </Typography>
            <Typography variant="h6" sx={{ textAlign: "center" }}>
              {email}
            </Typography>
          </Box>
        </Card>
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
                      .filter((candidate) => candidate.party === selectedParty)
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
      </Box>
    </Box>
  );
};

export default VoterDashboard;
