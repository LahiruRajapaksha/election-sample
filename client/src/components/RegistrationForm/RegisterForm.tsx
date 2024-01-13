import {
  Box,
  Button,
  Card,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import QrReader from "react-qr-reader";
import { useNavigate } from "react-router-dom";
import { useRegisterUser } from "../../utills/datahandling";
import "./RegisterForm.css";
import SnackBar from "../SnackBar/SnackBar";

export type RegisterUserData = {
  email: string;
  fullName: string;
  dateOfBirth: string;
  password: string;
  constituency: string;
  uvc: string;
  isVoted?: boolean;
};

const VoterRegistration = () => {
  const { register, error, isPending, data } = useRegisterUser();
  const [snackBarData, setSnackBarData] = useState({
    message: "",
    severity: "",
  });
  const navigate = useNavigate();
  const [isSnackbarOpen, setSnackBarOpen] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [uvcScanned, setUvcScanned] = useState(false);
  const [voterDetails, setVoterDetails] = useState<RegisterUserData>({
    email: "",
    fullName: "",
    dateOfBirth: "",
    password: "",
    constituency: "",
    uvc: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    fullName: "",
    dateOfBirth: "",
    password: "",
    constituency: "",
    uvc: "",
  });

  useEffect(() => {
    if (data === "User already exists") {
      setErrors((errors) => ({
        ...errors,
        email: "User is already registed with this email",
      }));
      setSnackBarData((data) => ({
        ...data,
        message: "User is already registed with this email",
        severity: "error",
      }));
      setSnackBarOpen((prev) => !prev);
      return;
    }
    if (data === "User registered successfully" && !isPending) {
      setSnackBarData((data) => ({
        ...data,
        message: "User registered successfully",
        severity: "success",
      }));
      setSnackBarOpen((prev) => !prev);
      navigate("/login");
    }
    if (error) {
      setSnackBarData((data) => ({
        ...data,
        message: "Something went wrong",
        severity: "error",
      }));
      setSnackBarOpen((prev) => !prev);
    }
    //setErrors({ ...errors, email: 'User already exists' });
  }, [data, navigate, isPending, error]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackBarOpen(false);
  };

  const handleScan = (scanData: string | null) => {
    if (scanData && scanData !== "") {
      setVoterDetails((prevDetails) => ({ ...prevDetails, uvc: scanData }));
      setShowScanner(false);
    }
  };

  const scanError = (err: Error) => {
    console.log(err);
  };
  const toggleScanner = () => {
    setShowScanner(!showScanner);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setVoterDetails({ ...voterDetails, [name]: value });

    if (name === "uvc" && uvcScanned) {
      setUvcScanned(false);
    }
    validateInput(name, value);
  };

  const validateInput = (name: string, value: string) => {
    switch (name) {
      case "email":
        if (!value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i)) {
          setErrors({ ...errors, email: "Invalid email address" });
        } else {
          setErrors({ ...errors, email: "" });
        }
        break;
      case "fullName":
        if (value.trim() === "") {
          setErrors({ ...errors, fullName: "Full name is required" });
        } else {
          setErrors({ ...errors, fullName: "" });
        }
        break;
      case "dateOfBirth":
        if (
          new Date().getTime() - new Date(value).getTime() <
          18 * 365 * 24 * 60 * 60 * 1000
        ) {
          setErrors({ ...errors, dateOfBirth: "Age should be 18 years" });
        } else {
          setErrors({ ...errors, dateOfBirth: "" });
        }
        break;
      case "password":
        if (value.length < 8) {
          setErrors({
            ...errors,
            password: "Password must be at least 8 characters",
          });
        } else {
          setErrors({ ...errors, password: "" });
        }
        break;
      default:
        break;
    }
  };

  const validateAllFields = () => {
    const hasFieldError = Object.values(errors).some((error) => error !== "");
    const isFieldsEmpty = Object.values(voterDetails).some(
      (value) => value === ""
    );
    return hasFieldError || isFieldsEmpty;
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setVoterDetails({
      ...voterDetails,
      [event.target.name as string]: event.target.value,
    });
  };

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const hasFieldErrors = validateAllFields();
    if (!hasFieldErrors) {
      register({ ...voterDetails, isVoted: false });
      console.log("Registered", { ...voterDetails, isVoted: false });
    } else {
      setSnackBarData((data) => ({
        ...data,
        message: "Please fill all the fields",
        severity: "error",
      }));
      setSnackBarOpen(true);
    }
  };
  return (
    <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
      <Card sx={{ maxWidth: "35%", p: 3 }}>
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          Voter Registration
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Voter ID (Email Address)"
            variant="outlined"
            fullWidth
            margin="normal"
            name="email"
            type="email"
            value={voterDetails.email}
            onChange={handleInputChange}
            helperText={errors.email}
            error={Boolean(errors.email)}
          />
          <TextField
            label="Full Name"
            variant="outlined"
            fullWidth
            margin="normal"
            name="fullName"
            value={voterDetails.fullName}
            onChange={handleInputChange}
            helperText={errors.fullName}
            error={Boolean(errors.fullName)}
          />
          <TextField
            label="Date of Birth"
            variant="outlined"
            fullWidth
            margin="normal"
            name="dateOfBirth"
            type="date"
            InputLabelProps={{ shrink: true }}
            value={voterDetails.dateOfBirth}
            onChange={handleInputChange}
            helperText={errors.dateOfBirth}
            error={Boolean(errors.dateOfBirth)}
          />
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            margin="normal"
            name="password"
            type="password"
            value={voterDetails.password}
            onChange={handleInputChange}
            helperText={errors.password}
            error={Boolean(errors.password)}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Constituency</InputLabel>
            <Select
              name="constituency"
              value={voterDetails.constituency}
              label="Constituency"
              onChange={handleSelectChange}
              error={Boolean(errors.constituency)}
            >
              <MenuItem value="Shangri-la-Town">Shangri-la-Town</MenuItem>
              <MenuItem value="Northern-Kunlun-Mountain">
                Northern-Kunlun-Mountain
              </MenuItem>
              <MenuItem value="Western-Shangri-la">Western-Shangri-la</MenuItem>
              <MenuItem value="Naboo-Vallery">Naboo-Vallery</MenuItem>
              <MenuItem value="New-Felucia">New-Felucia</MenuItem>
            </Select>
            <div style={{ color: "red" }}>{errors.constituency}</div>
          </FormControl>
          <TextField
            label="8-digit Unique Voter Code (UVC)"
            variant="outlined"
            fullWidth
            margin="normal"
            name="uvc"
            value={voterDetails.uvc}
            onChange={handleInputChange}
            helperText={errors.uvc}
            error={Boolean(errors.uvc)}
          />

          {showScanner && (
            <QrReader
              onScan={handleScan}
              facingMode="user"
              onError={scanError}
              style={{
                width: "300px",
                margin: "0 auto",
              }}
            />
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 2,
            }}
          >
            <Button
              variant="contained"
              size="small"
              onClick={toggleScanner}
              sx={{
                backgroundColor: "#333",
                "&:hover": { backgroundColor: "#333" },
              }}
            >
              Scan QR Code
            </Button>

            <Button
              variant="contained"
              type="submit"
              size="small"
              sx={{
                backgroundColor: "#333",
                "&:hover": { backgroundColor: "#333" },
              }}
              startIcon={
                isPending ? (
                  <CircularProgress size={20} sx={{ color: "white" }} />
                ) : null
              }
            >
              {isPending ? "Registering" : "Register"}
            </Button>
          </Box>
        </Box>
      </Card>
      <SnackBar
        isSnackbarOpen={isSnackbarOpen}
        handleClose={handleClose}
        snackBarData={snackBarData}
      />
    </Box>
  );
};

export default VoterRegistration;
