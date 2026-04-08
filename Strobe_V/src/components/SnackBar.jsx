import React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const SnackBar = ({openState, setOpenState, type, text}) => {
    console.log({openState, type, text})
    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
          return;
        }
    
        setOpenState(false);
      };
  return (
    <Snackbar
      open={openState}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={() => handleClose}
        severity={type}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {text}
      </Alert>
    </Snackbar>
  );
};

export default SnackBar;
