import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
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
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateField } from "@mui/x-date-pickers/DateField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Alert from "@mui/material/Alert";
import { Link, Typography, Snackbar ,Chip} from '@mui/material';
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import axios from "axios";

import {
  currency,
  Rag,
  Relocate,
  payment,
  workingModel,
  status,
  BASE_URL,
} from "../core/constants";

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
  ({ theme }) => ({
    boxSizing: 'border-box',
    width: 569,
    fontFamily: '"IBM Plex Sans", sans-serif',
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.5,
    padding: '8px 12px',
    borderRadius: 8,
    color: theme.palette.mode === "dark" ? grey[300] : grey[900],
    background:  grey[100] ,
    border: `1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]}`,
    boxShadow: `0 2px 2px ${theme.palette.mode === "dark" ? grey[900] : grey[50]}`,
    
    '&:focus': {
      borderColor: blue[400],
      boxShadow: `0 0 0 3px ${theme.palette.mode === "dark" ? blue[600] : blue[200]}`,
      outline: 'none'
    }
  })
);

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

const EditCandidate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    surName:"",
    currency: "",
    currentCTC: "",
    contactNo: "",
    expectedCTC: "",
    alternateContactNo: "",
    paymentType: "",
    experience: "",
    screenedBy: "",
    noticePeriod: "",
    email: "",
    screeningOutcome: "",
    currentLocation: "",
    status: "",
    workingModel: "",
    interviewer: "",
    internalInterviewNotes: "",
    currentRole: "",
    expectedRole: "",
    internalRAG: "",
    relocate: "",
    clientFeedback: "",
    resume: [],
    clientsInterviewDate: "",
    lastComms: [],
    screeningNotes: "",
  });
  const [resume, setResume] = React.useState([]);
  const [uploadedFiles, setUploadedFiles] = React.useState([]); // New state for uploaded files
  const [open, setOpen] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [initialFormData, setInitialFormData] = useState({});
  
  // New state for client and roles options
  const [clientOptions, setClientOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  
  useEffect(() => {
    const fetchCandidateDetails = async () => {
      try {
        const response = await fetch(
          `http://167.172.164.218/candidates/getById/${id}`
        );
        const data = await response.json();

        const formattedData = {
          ...data.data,
          clientsInterviewDate: data.data.clientsInterviewDate
            ? dayjs(data.data.clientsInterviewDate)
            : null,
        };

        setFormData(formattedData);
        setInitialFormData(formattedData);
        setResume(data.data.resume || []);
      } catch (error) {
        console.error("Error fetching candidate details:", error);
        setSnackbarMessage("Failed to fetch candidate details.");
        setOpenSnackbar(true);
      }
    };

    const fetchClients = async () => {
      try {
        const res = await axios.get("http://167.172.164.218/client/get");
        setClientOptions(res.data);
      } catch (error) {
        console.error("Error fetching clients:", error);
      }
    };

    const fetchRoles = async () => {
      try {
        const res = await axios.get("http://167.172.164.218/roles/get");
        setRoleOptions(res.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchCandidateDetails();
    fetchClients();
    fetchRoles();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNoticeDateChange = (e) => {
    let dat = dayjs(e.$d).format("DD-MM-YYYY");
    setFormData((prevData) => ({
      ...prevData,
      noticePeriod: dat,
    }));
  };
  
  const handleclientsInterviewDateChange = (e) => {
    let dat = dayjs(e.$d).format("DD-MM-YYYY");
    setFormData((prevData) => ({
      ...prevData,
      clientsInterviewDate: dat,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", JSON.stringify(formData, null, 2));
  
    // 🛠️ Ensure lastComms is structured correctly
    const formattedFormData = {
      ...formData,
      resume: [...resume, ...uploadedFiles.map(file => file.name)], // Combine existing and new files
      lastComms: Array.isArray(formData.lastComms)
        ? formData.lastComms.map((comm) => ({
            message: formData.newLastComm,
            createdBy: comm.createdBy || "Unknown",
            timeStamp: comm.timeStamp || new Date().toISOString(),
          }))
        : [],
    };
  
    try {
      const response = await fetch(`http://167.172.164.218/candidates/update1/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedFormData),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.message || "Failed to update candidate");
      }
  
      setSnackbarMessage("Candidate updated successfully!");
      setOpenSnackbar(true);
      navigate("/candidates");
    } catch (error) {
      console.error("Error updating candidate:", error);
      setSnackbarMessage(error.message || "An unexpected error occurred.");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  // Fixed download handler to open documents
  const downloadHandler = (fileName) => {
    console.log("Opening document:", fileName);
    // Replace with actual document URL or implement proper file opening logic
    const documentUrl = `${fileName}`;
    window.open(documentUrl, '_blank');
  };

  const uploadDocumentHandler = () => {
    setOpen(true);
  };

  // Fixed upload handler
 const uploadHandler = async (e) => {
  e.preventDefault();
  
  if (uploadedFiles.length === 0) {
    setSnackbarMessage("Please select files to upload.");
    setOpenSnackbar(true);
    return;
  }

  try {
    const formData = new FormData();
    uploadedFiles.forEach((file) => {
      formData.append('files', file); 
    });
    
    const response = await fetch(`http://167.172.164.218/candidates/updateDoc/${id}`, {
      method: 'PATCH',
      body: formData,
    });

    const result = await response.json();

    if (result.data.success || result.success) {
      // Update the resume list with actual S3 URLs from the API response
      if (result.data && result.data.newResumeLinks) {
        setResume(prev => [...prev, ...result.data.newResumeLinks]);
      }
      
      setUploadedFiles([]);
      setSnackbarMessage(result.message || "Documents uploaded successfully!");
      setOpenSnackbar(true);
      setOpen(false);
      window.location.reload();
    } else {
      // Handle API error response
      throw new Error(result.message || "Failed to upload documents");
    }
  } catch (error) {
    console.error("Error uploading documents:", error);
    
    // Provide more specific error message if available
    const errorMessage = error.message === "Failed to fetch" 
      ? "Network error. Please check your connection." 
      : error.message || "Failed to upload documents.";
    
    setSnackbarMessage(errorMessage);
    setOpenSnackbar(true);
  }
};

  const handleClose = () => {
    setOpen(false);
    setUploadedFiles([]);
  };

  // Handle file selection
  const handleFileSelection = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  // Remove file from upload list
  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Card
          sx={{
            backgroundColor: "#ffffff",
            boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <CardHeader title="Edit Candidate" />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <CardActions>
                <Button
                  size="medium"
                  variant="outlined"
                  color="warning"
                  onClick={uploadDocumentHandler}
                >
                  Upload documents
                </Button>
              </CardActions>
              <CardActions>
                <Button size="medium" variant="outlined" type="submit">
                  Update
                </Button>
              </CardActions>
              <CardActions>
                <Button
                  size="medium"
                  variant="outlined"
                  color="error"
                  onClick={() => navigate("/candidates")}
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
                  <InputLabel shrink={!!formData.name}>First Name</InputLabel>
                  <OutlinedInput
                    label="First Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    label="Currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleChange}
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
                  <InputLabel shrink={!!formData.surName}>Last Name</InputLabel>
                  <OutlinedInput
                    label="Last Name"
                    name="surName"
                    value={formData.surName}
                    onChange={handleChange}
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel shrink={!!formData.currentCTC}>
                    Current CTC
                  </InputLabel>
                  <OutlinedInput
                    value={formData.currentCTC}
                    onChange={handleChange}
                    label="Current CTC"
                    name="currentCTC"
                    type="number"
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel shrink={!!formData.contactNo}>
                    Contact Number
                  </InputLabel>
                  <OutlinedInput
                    value={formData.contactNo}
                    onChange={handleChange}
                    label="Contact Number"
                    name="contactNo"
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel shrink={!!formData.expectedCTC}>
                    Expected CTC
                  </InputLabel>
                  <OutlinedInput
                    value={formData.expectedCTC}
                    onChange={handleChange}
                    label="Expected CTC"
                    name="expectedCTC"
                    type="number"
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel shrink={!!formData.alternateContactNo}>
                    Alternate Contact Number
                  </InputLabel>
                  <OutlinedInput
                    value={formData.alternateContactNo}
                    onChange={handleChange}
                    label="Alternate Contact Number"
                    name="alternateContactNo"
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel shrink={!!formData.paymentType}>
                    Payment Model
                  </InputLabel>
                  <Select
                    onChange={handleChange}
                    label="Payment Model"
                    name="paymentType"
                    variant="outlined"
                    value={formData.paymentType}
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
                  <InputLabel shrink={!!formData.experience}>
                    Experience(in Yrs)
                  </InputLabel>
                  <OutlinedInput
                    value={formData.experience}
                    onChange={handleChange}
                    label="Experience(in Yrs)"
                    name="experience"
                    type="number"
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel shrink={!!formData.screenedBy}>
                    Screened By
                  </InputLabel>
                  <OutlinedInput
                    value={formData.screenedBy}
                    onChange={handleChange}
                    label="Screened By"
                    name="screenedBy"
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Notice Period</InputLabel>
                  <Select
                    name="noticePeriod"
                    value={formData.noticePeriod || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, noticePeriod: e.target.value }))
                    }
                    label="Notice Period"
                  >
                    {[
                      { value: "immediately", label: "Immediately" },
                      { value: "1_week", label: "1 Week" },
                      { value: "2_weeks", label: "2 Weeks" },
                      { value: "30_days", label: "30 Days" },
                      { value: "1_month", label: "1 Month" },
                    ].map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Screening Notes</InputLabel>
                  <OutlinedInput
                    label="Screening Notes"
                    name="screeningNotes"
                    value={formData.screeningNotes || ""}
                    onChange={handleChange}
                  />
                </FormControl>
              </Grid>

              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel shrink={!!formData.email}>
                    Candidate Email Address
                  </InputLabel>
                  <OutlinedInput
                    value={formData.email}
                    onChange={handleChange}
                    label="Candidate Email Address"
                    name="email"
                    type="email"
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel shrink={!!formData.screeningOutcome}>
                    Screening Outcome
                  </InputLabel>
                  <OutlinedInput
                    value={formData.screeningOutcome}
                    onChange={handleChange}
                    label="Screening Outcome"
                    name="screeningOutcome"
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel shrink={!!formData.currentLocation}>
                    Current Location
                  </InputLabel>
                  <OutlinedInput
                    value={formData.currentLocation}
                    onChange={handleChange}
                    label="Current Location"
                    name="currentLocation"
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel shrink={!!formData.status}>Status</InputLabel>
                  <Select
                    value={formData.status}
                    onChange={handleChange}
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
                  <InputLabel shrink={!!formData.workingModel}>
                    Working Model
                  </InputLabel>
                  <Select
                    value={formData.workingModel}
                    onChange={handleChange}
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
                  <InputLabel shrink={!!formData.interviewer}>
                    Internal Interviewer
                  </InputLabel>
                  <OutlinedInput
                    value={formData.interviewer}
                    onChange={handleChange}
                    label="Internal Interviewer"
                    name="interviewer"
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth required>
                  <InputLabel shrink={!!formData.currentRole}>
                    Current Role
                  </InputLabel>
                  <OutlinedInput
                    value={formData.currentRole}
                    onChange={handleChange}
                    label="Current Role"
                    name="currentRole"
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Internal Interviewer Notes</InputLabel>
                  <OutlinedInput
                    label="Internal Interviewer Notes"
                    placeholder="Internal Interviewer Notes"
                    value={formData.internalInterviewNotes}
                    onChange={handleChange}
                    style={{ width: "100%" }}
                    minRows={3}
                    name="internalInterviewNotes"
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <InputLabel shrink={!!formData.internalRAG}>
                    Internal RAG
                  </InputLabel>
                  <Select
                    value={formData.internalRAG}
                    onChange={handleChange}
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
                  <InputLabel shrink={!!formData.relocate}>
                    Willing to Relocate
                  </InputLabel>
                  <Select
                    value={formData.relocate}
                    onChange={handleChange}
                    label="Willing to relocate"
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
                  <LocalizationProvider dateAdapter={AdapterDayjs} fullWidth>
                    <DemoContainer components={["DatePicker"]} fullWidth>
                      <DatePicker
                        label="Clients Interview Date"
                        format="MM/DD/YYYY"
                        value={dayjs(formData.clientsInterviewDate) || ""}
                        onChange={handleclientsInterviewDateChange}
                        fullWidth
                        sx={{ width: "100%" }}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth>
                  <TextareaAutosize
                    aria-label="Last Comms"
                    placeholder="Enter last Communication"
                    name="lastComms"
                     variant="outlined"
                    value={formData.newLastComm || ""}
                    onChange={(e) => setFormData((prevData) => ({ ...prevData, newLastComm: e.target.value }))}
                    style={{ width: "100%", padding: "8px", fontSize: "14px" }}
                    minRows={3}
                  />
                </FormControl>
              </Grid>
              <Grid md={6} xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel shrink>Clients Feedback</InputLabel>
                  <OutlinedInput
                    label="Clients Feedback"
                    placeholder="Clients Feedback"
                    style={{ width: "100%" }}
                    name="clientFeedback"
                    minRows={3}
                    value={formData.clientFeedback || ""}
                    onChange={handleChange}
                  />
                </FormControl>
              </Grid>
              {/* Client Dropdown */}
             <Grid item md={6} xs={12}>
  <FormControl fullWidth required variant="outlined">
    <InputLabel id="client-label">Client</InputLabel>
    <Select
      labelId="client-label"
      name="clientId"
      value={formData.clientId || ""}
      onChange={handleChange}
      label="Client"
    >
      {clientOptions.map((client) => (
        <MenuItem key={client._id} value={client._id}>
          {client.name}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Grid>


              {/* Preferred Role Dropdown */}
              <Grid md={6} xs={12}>
                <FormControl fullWidth required variant="outlined">
                  <InputLabel>Expected Role</InputLabel>
                  <Select
                    name="expectedRole"
                    value={formData.expectedRole}
                    onChange={handleChange}
                    label="Expected Role"
                    variant="outlined"
                  >
                    {roleOptions
                      .filter((role) =>
                        Array.isArray(role.clientId) &&
                        role.clientId.some((client) => client._id === formData.clientId)
                      )
                      .map((role) => (
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

              {/* Fixed Documents Display */}
              <Grid item md={6} xs={12}>
      <FormControl fullWidth variant="outlined" required>
        <InputLabel id="uploaded-documents-label">Uploaded Documents</InputLabel>
        <Select
          labelId="uploaded-documents-label"
          label="Uploaded Documents"
          defaultValue=""
        >
          {resume.length > 0 ? (
            resume.map((fileName, index) => (
              <MenuItem key={index} value={fileName}>
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    downloadHandler(fileName);
                  }}
                  underline="hover"
                  color="primary"
                >
                  📄 {fileName}
                </Link>
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No documents uploaded</MenuItem>
          )}
        </Select>
      </FormControl>
    </Grid>
    </Grid>
          </CardContent>
          <Divider />
        </Card>
      </form>
      
      <Card
        sx={{
          backgroundColor: "#ffffff",
          boxShadow: "2px 2px 8px rgba(0, 0, 0, 0.2)",
          marginTop: "20px",
        }}
      >
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <Box component={"h3"}>Last Comments</Box>
              {formData?.lastComms?.map((note, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                  <Typography variant="body2">
                    <strong>Message:</strong> {note.message ?? ""}
                  </Typography>
                  <Typography variant="body2">
                    <strong>By:</strong> {note.createdBy}
                  </Typography>
                  <Typography variant="body2">
                    <strong>At:</strong> {note.timeStamp ? new Date(note.timeStamp).toLocaleString() : ""}
                  </Typography>
                </Box>
              ))}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Fixed Upload Dialog */}
      <Dialog
        onClose={handleClose}
        open={open}
        sx={{ padding: "20px" }}
        maxWidth={"sm"}
        fullWidth
      >
        <DialogTitle sx={{ paddingTop: "30px" }}>
          Upload Documents
        </DialogTitle>
        <form onSubmit={uploadHandler}>
          <Box sx={{ padding: "0 30px" }}>
            <Button
              component="label"
              fullWidth
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Select Files
              <VisuallyHiddenInput
                type="file"
                onChange={handleFileSelection}
                multiple
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              />
            </Button>
          </Box>
          
          {/* Display selected files */}
          <Box sx={{ padding: "20px 30px" }}>
            <Typography variant="h6" gutterBottom>
              Selected Files:
            </Typography>
            {uploadedFiles && uploadedFiles.length > 0 ? (
              uploadedFiles.map((file, index) => (
                <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="body2">{file.name}</Typography>
                  <Button 
                    size="small" 
                    color="error" 
                    onClick={() => removeFile(index)}
                    sx={{ minWidth: 'auto', padding: '2px 8px' }}
                  >
                    ✕
                  </Button>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">
                No files selected yet.
              </Typography>
            )}
          </Box>
          
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "30px",
            }}
          >
            <Button
              size="medium"
              variant="outlined"
              color="primary"
              type="submit"
              disabled={uploadedFiles.length === 0}
            >
              Upload Files
            </Button>
            <Button
              size="medium"
              variant="outlined"
              color="error"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </>
  );
};

export default EditCandidate;
