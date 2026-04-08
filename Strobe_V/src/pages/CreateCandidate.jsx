import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Unstable_Grid2";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";

import { Box, styled } from "@mui/system";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateField } from "@mui/x-date-pickers/DateField";
import { Link, Typography, Snackbar ,Chip} from '@mui/material';
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  currency,
  Rag,
  Relocate,
  payment,
  workingModel,
  status,
  BASE_URL,
} from "../core/constants";
import { useNavigate } from "react-router";
import axios from "axios";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const TextareaAutosize = styled(BaseTextareaAutosize)(
  ({ theme }) => `
    box-sizing: border-box;
    width: 569px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0 2px 2px ${
      theme.palette.mode === "dark" ? grey[900] : grey[50]
    };
  
  
    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${
        theme.palette.mode === "dark" ? blue[600] : blue[200]
      };
    }   `
);
const noticePeriodOptions = [
  { value: "immediately", label: "Immediately" },
  { value: "1_week", label: "1 Week" },
  { value: "2_weeks", label: "2 Weeks" },
  { value: "30_days", label: "30 Days" },
  { value: "1_month", label: "1 Month" },
 
];

const blue = {
  100: "#DAECFF",
  200: "#b6daff",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  900: "#003A75",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const CreateCandidate = () => {
  const navigate = useNavigate();
  const [openSnackbar, setOpenSnackbar] = React.useState(false); // State for Snackbar
  const [snackbarMessage, setSnackbarMessage] = React.useState(""); // State for Snackbar message
  const [resume, setResume] = React.useState([]);

  
  const [clients, setClients] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [filteredRoles, setFilteredRoles] = useState([]);

  const CreateCandidateHandler = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const user = JSON.parse(localStorage.getItem("authData")) || {}; // Handle missing authData
    formData.append("createdBy", user.FirstName || "Unknown"); // Fallback if FirstName is missing
  
    // Append resume files correctly (assuming resume is a file input)
    if (resume && resume.length > 0) {
      resume.forEach((file, index) => formData.append(`resume[${index}]`, file));
    }
  
    console.log("Form Data Entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
  
    try {
      const response = await fetch(`http://167.172.164.218/candidates/create1`, {
        method: "POST",
        body: formData, // Send FormData directly (automatically sets Content-Type)
      });
  
      const result = await response.json();
      console.log("Response:", result);
  
      if (response.ok) {
        navigate("/candidates");
      } else {
        alert("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return; // Don't close Snackbar if user clicks away
    }
    setOpenSnackbar(false); // Close Snackbar
  };

  const handleCancelButton = () => {
    navigate("/candidates");
  };




  useEffect(() => {
    axios.get("http://167.172.164.218/client/get")
      .then((res) => setClients(res.data))
      .catch((err) => console.error("Error fetching clients:", err));

    axios.get("http://167.172.164.218/roles/get")
      .then((res) => setRoles(res.data))
      .catch((err) => console.error("Error fetching roles:", err));
  }, []);

  useEffect(() => {
    if (selectedClient) {
      console.log("#$#%#$%#$%^$%$%$%%",roles)
      setFilteredRoles(
        roles.filter(role =>
          Array.isArray(role.clientId) &&
          role.clientId.some(client => client._id === selectedClient)
        )
      );
    } else {
      setFilteredRoles([]);
    }
  }, [selectedClient, roles]);
  return (
    <>
      <form onSubmit={CreateCandidateHandler}>
        <Card>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <CardHeader title="Add Candidate" />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <CardActions>
                <Button size="medium" variant="outlined" type="submit">
                  Save
                </Button>
              </CardActions>
              <CardActions>
                <Button
                  size="medium"
                  variant="outlined"
                  color="error"
                  onClick={handleCancelButton}
                >
                  Cancel
                </Button>
              </CardActions>
            </Box>
          </Box>

          <Divider />

          <CardContent>
            <Grid container spacing={3}>
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>First Name</InputLabel>
                  <OutlinedInput label="First Name" name="name" />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    defaultValue=""
                    label="Currency"
                    name="currency"
                    variant="outlined"
                  >
                    {currency.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Last Name</InputLabel>
                  <OutlinedInput label="Last Name" name="surName" />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Current CTC</InputLabel>
                  <OutlinedInput
                    defaultValue=""
                    label="Current CTC"
                    name="currentCTC"
                    type="number"
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Contact Number</InputLabel>
                  <OutlinedInput
                    defaultValue=""
                    label="Contact Number"
                    name="contactNo"
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Expected CTC</InputLabel>
                  <OutlinedInput
                    defaultValue=""
                    label="Expected CTC"
                    name="expectedCTC"
                    type="number"
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Alternate Contact Number</InputLabel>
                  <OutlinedInput
                    defaultValue=""
                    label="Alternate Contact Number"
                    name="alternateContactNo"
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Payment Model</InputLabel>
                  <Select
                    defaultValue=""
                    label="Payment Model"
                    name="paymentType"
                    variant="outlined"
                  >
                    {payment.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Experience(in Yrs)</InputLabel>
                  <OutlinedInput
                    defaultValue=""
                    label="Experience(in Yrs)"
                    name="experience"
                    type="number"
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Screened By</InputLabel>
                  <OutlinedInput
                    defaultValue=""
                    label="Screened By"
                    name="screenedBy"
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Notice Period</InputLabel>
                <Select defaultValue="" label="Notice Period" name="noticePeriod">
                  {noticePeriodOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth >
                  <InputLabel>Screening Notes</InputLabel>
                  <OutlinedInput
                    defaultValue=""
                    label="Screening Notes"
                    name="ScreeningNotes"
          
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Candidate Email Address</InputLabel>
                  <OutlinedInput
                    defaultValue=""
                    label="Candidate Email Address"
                    name="email"
                    type="email"
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Screening Outcome</InputLabel>
                  <OutlinedInput
                    defaultValue=""
                    label="Screening Outcome"
                    name="screeningOutcome"
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Current Location</InputLabel>
                  <OutlinedInput
                    defaultValue=""
                    label="Current Location"
                    name="currentLocation"
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    defaultValue=""
                    label="Status"
                    name="status"
                    variant="outlined"
                  >
                    {status.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Working Model</InputLabel>
                  <Select
                    defaultValue=""
                    label="Working Model"
                    name="workingModel"
                    variant="outlined"
                  >
                    {workingModel.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Internal Interviewer</InputLabel>
                  <OutlinedInput
                    defaultValue=""
                    label="Internal Interviewer"
                    name="interviewer"
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Current Role</InputLabel>
                  <OutlinedInput
                    defaultValue=""
                    label="Current Role"
                    name="currentRole"
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth >
                  <InputLabel>Internal Interviewer Notes</InputLabel>
                  <TextareaAutosize
                    label="Internal Interviewer Notes"
                    name="internalInterviewNotes"
                   
                    style={{ width: "100%" }}
                    minRows={3}
                
                  />
                </FormControl>
              </Grid>
              {/* <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Preferred Role</InputLabel>
                  <OutlinedInput
                    defaultValue=""
                    label="Preferred Role"
                    name="expectedRole"
                  />
                </FormControl>
              </Grid> */}


            {/* Client Dropdown */}
            <Grid md={6} xs={12}>
              <FormControl fullWidth required variant="outlined">
               <InputLabel >Client</InputLabel>
                <Select value={selectedClient} 
                onChange={(e) => setSelectedClient(e.target.value)} 
                name="clientId"
                  label="Client"
                    variant="outlined">
                  {clients.map((client) => (
                    <MenuItem key={client._id} value={client._id}>{client.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Roles Dropdown (Filtered by Client) */}
            <Grid md={6} xs={12}>
              <FormControl fullWidth required variant="outlined">
                <InputLabel>Expected Role</InputLabel>
                <Select name="expectedRole"
                 disabled={!selectedClient}
                label="Expected Role"
                 variant="outlined"
                 >
                  {filteredRoles.map((role) => (
                     <MenuItem key={role._id} value={role.roleName}>
                          {role.roleName}    
                           <Chip
        label={role.status}
        size="small"
        sx={{
          textTransform: 'capitalize',
          backgroundColor: role.status === 'Active' ? '#d4edda' : '#f8d7da',
          color: role.status === 'Active' ? '#155724' : '#721c24',
          fontWeight: 500,
        }}
      />
                        </MenuItem>
                      ))}
                 
                </Select>
              </FormControl>
            </Grid>
   
              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Internal RAG</InputLabel>
                  <Select
                    defaultValue=""
                    label="Internal RAG"
                    name="internalRAG"
                    variant="outlined"
                  >
                    {Rag.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Willing to Relocate</InputLabel>
                  <Select
                    defaultValue=""
                    label="Willing to Relocate"
                    name="relocate"
                    variant="outlined"
                  >
                    {Relocate.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth disabled>
                  {/* <InputLabel>Internal Interviewer notes</InputLabel> */}
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={["DateField"]}>
                      <DateField
                        label="Clients Interview Date"
                        placeholder ="Clients Interview Date"
      
                        name="clientsInterviewDate"
                        format="MM/DD/YYYY"
                        fullWidth
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth disabled>
                  {/* <InputLabel>Internal Interviewer notes</InputLabel> */}
                  <TextareaAutosize
                    aria-label="Last Comms"
                    placeholder="Last Comms"
                    name="newLastComm"
                    style={{ width: "100%" }}
                    minRows={3}
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth disabled variant="outlined">
                  {/* <InputLabel>Internal Interviewer notes</InputLabel> */}
                  <TextareaAutosize
                    label="Clients Feedback"
                    placeholder="Clients Feedback"
                    name="clientsFeedback"
                    style={{ width: "100%" }}
                    minRows={3}
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth disabled>
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    // tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload Resume
                    <VisuallyHiddenInput
                      type="file"
                      name="files"
                      onChange={(e) =>
                        setResume((prev) => [...prev, e.target.files[0].name])
                      }
                      multiple
                    />
                  </Button>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
       
       
       
         
       
      </Card>

      </form>
     
    </>
  );
};

export default CreateCandidate;
