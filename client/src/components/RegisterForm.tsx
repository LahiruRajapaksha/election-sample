import {
  Box,
  Button,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Snackbar from "@mui/material/Snackbar";
import QrReader from "react-qr-reader";
import { useNavigate } from "react-router-dom";
import { useRegisterUser } from "../utills/datahandling";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import "./RegisterForm.css";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const VoterRegistration: React.FC<VoterRegistrationProps> = () => {
  const [isFieldsError, setIsFieldsError] = useState(false);
  const { register, error, isSuccess, data } = useRegisterUser();
  const [voterDetails, setVoterDetails] = useState({
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

  const [showScanner, setShowScanner] = useState(false);
  const [uvcScanned, setUvcScanned] = useState(false);

  useEffect(() => {
    if (data === "User already exists") {
      setErrors({ ...errors, email: "User already exists" });
      return;
    }
    if (data === "User registered successfully") handleNavigation("/login");
    //setErrors({ ...errors, email: 'User already exists' });
  }, [data]);
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {};

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
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

  const handleSubmit = () => {
    const isFieldsError = validateAllFields();
    // console.log("IS FIELD ERROR", isFieldsError);
    if (!isFieldsError) {
      register({ ...voterDetails, isVoted: false });
    } else {
      setOpen(true); // improve to error notification
    }
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
    const isFieldError = Object.values(errors).every((error) => error !== "");
    const isFieldsEmpty = Object.values(voterDetails).every(
      (value) => value === ""
    );
    console.log("IS FIELD ERROR", isFieldError);
    console.log("IS FIELD EMPTY", isFieldsEmpty);
    return isFieldError || isFieldsEmpty;
  };

  const navigate = useNavigate();
  const handleNavigation = (path: string) => {
    navigate(path);
  };
  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setVoterDetails({
      ...voterDetails,
      [event.target.name as string]: event.target.value,
    });
  };
  return (
    <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
      <Card sx={{ maxWidth: "50%", p: 3 }}>
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          Voter Registration
        </Typography>
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

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "20px",
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
            onClick={handleSubmit}
          >
            Register
          </Button>
        </div>
      </Card>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Please fill the fileds
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VoterRegistration;
