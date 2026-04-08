import React, { useState, useRef } from "react";
import axios from "axios";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";

const Template = () => {
  const [popupText, setPopupText] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const fileInputRef = useRef();

  // Trigger hidden file input
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection and upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://167.172.164.218/resume/process-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        responseType: "text", // expecting text response from the API
      });

      // If API call is successful, display the formatted document text.
      setPopupText(response.data);
      setOpenPopup(true);
    } catch (error) {
      console.error("Error uploading file:", error);
      // Show error message in the popup.
      setPopupText("Error uploading file.");
      setOpenPopup(true);
    }
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  return (
    <div>
      <h1>Template</h1>
      <Button variant="contained" onClick={handleUploadClick}>
        Upload File
      </Button>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* Popup dialog to display formatted document or error message */}
      <Dialog open={openPopup} onClose={handleClosePopup}>
        <DialogTitle>Formatted Document</DialogTitle>
        <DialogContent>
          <pre style={{ whiteSpace: "pre-wrap" }}>{popupText}</pre>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Template;
