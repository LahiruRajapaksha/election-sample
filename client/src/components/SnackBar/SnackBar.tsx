import { Snackbar } from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import React from "react";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

type SnackBarProps = {
  isSnackbarOpen: boolean;
  snackBarData: {
    severity: string;
    message: string;
  };
  handleClose: () => void;
};

const SnackBar = (props: SnackBarProps) => {
  const { isSnackbarOpen, snackBarData, handleClose } = props;
  return (
    <Snackbar
      open={isSnackbarOpen}
      autoHideDuration={7000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert
        onClose={handleClose}
        severity={snackBarData.severity as "success" | "error"}
        sx={{ width: "100%" }}
      >
        {snackBarData.message}
      </Alert>
    </Snackbar>
  );
};

export default SnackBar;
