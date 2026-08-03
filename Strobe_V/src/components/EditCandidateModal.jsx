import React, { useEffect, useMemo, useState } from "react";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select from "@mui/material/Select";
import Grid from "@mui/material/Unstable_Grid2";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import { Box, styled } from "@mui/system";
import { TextareaAutosize as BaseTextareaAutosize } from "@mui/base/TextareaAutosize";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Link from "@mui/material/Link";
import Snackbar from "@mui/material/Snackbar";
import Chip from "@mui/material/Chip";
import axios from "axios";


import {
  currency,
  Rag,
  Relocate,
  payment,
  workingModel,
  status,
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

const TextareaAutosize = styled(BaseTextareaAutosize)(({ theme }) => ({
  boxSizing: "border-box",
  width: 569,
  fontFamily: '"IBM Plex Sans", sans-serif',
  fontSize: "0.875rem",
  fontWeight: 400,
  lineHeight: 1.5,
  padding: "8px 12px",
  borderRadius: 8,
  color: theme.palette.mode === "dark" ? "#d1d5db" : "#111827",
  background: theme.palette.mode === "dark" ? "rgba(255,255,255,0.06)" : "#f3f4f6",
  border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.12)"}`,
  boxShadow: `0 2px 2px ${theme.palette.mode === "dark" ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.05)"}`,
  "&:focus": {
    outline: "none",
  },
}));

function EditCandidateModal({ open, onClose, candidateId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    surName: "",
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
    // current page uses these:
    clientId: "",
    newLastComm: "",
  });

  const [resume, setResume] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [clientOptions, setClientOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);

  const isRequiredValid = useMemo(() => {
    // Basic required fields as per existing form marked `required`
    // NOTE: clientsInterviewDate is NOT part of validation requirements (should be optional).
    const requiredFields = ["name", "surName", "currency", "currentCTC", "contactNo", "expectedCTC", "paymentType", "experience", "noticePeriod", "currentRole", "expectedRole", "status", "clientId"];
    return requiredFields.every((k) => String(formData[k] ?? "").trim() !== "");
  }, [formData]);

  useEffect(() => {
    if (!open || !candidateId) return;

    let ignore = false;
    async function load() {
      setLoading(true);
      try {
        const [candRes, clientsRes, rolesRes] = await Promise.all([
          fetch(`http://167.172.164.218/candidates/getById/${candidateId}`),
          axios.get("http://167.172.164.218/client/get"),
          axios.get("http://167.172.164.218/roles/get"),
        ]);

        const candJson = await candRes.json();
        const formatted = {
          ...candJson.data,
          // page expects date picker value to be dayjs
          clientsInterviewDate: candJson.data.clientsInterviewDate
            ? dayjs(candJson.data.clientsInterviewDate)
            : null,
        };

        if (ignore) return;

        setFormData((prev) => ({
          ...prev,
          ...formatted,
          clientId: formatted.clientId ?? formatted.client?.[0]?._id ?? "",
          newLastComm: "",
        }));
        setResume(candJson.data.resume || []);
        setClientOptions(clientsRes.data);
        setRoleOptions(rolesRes.data);
      } catch (e) {
        console.error(e);
        if (!ignore) {
          setSnackbarMessage("Failed to load candidate details.");
          setOpenSnackbar(true);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [open, candidateId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleclientsInterviewDateChange = (e) => {
    const dat = dayjs(e.$d).format("DD-MM-YYYY");
    setFormData((prev) => ({ ...prev, clientsInterviewDate: dat }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedFormData = {
      ...formData,
      resume: [...resume, ...uploadedFiles.map((file) => file.name)],
      lastComms: Array.isArray(formData.lastComms)
        ? formData.lastComms.map((comm) => ({
            message: formData.newLastComm,
            createdBy: comm.createdBy || "Unknown",
            timeStamp: comm.timeStamp || new Date().toISOString(),
          }))
        : [],
    };

    try {
      const response = await fetch(
        `http://167.172.164.218/candidates/update1/${candidateId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formattedFormData),
        }
      );

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Failed to update candidate");

      setSnackbarMessage("Candidate updated successfully!");
      setOpenSnackbar(true);
      onSuccess?.();
      onClose?.();
    } catch (error) {
      console.error("Error updating candidate:", error);
      setSnackbarMessage(error.message || "An unexpected error occurred.");
      setOpenSnackbar(true);
    }
  };

  const uploadHandler = async (e) => {
    e.preventDefault();

    if (uploadedFiles.length === 0) {
      setSnackbarMessage("Please select files to upload.");
      setOpenSnackbar(true);
      return;
    }

    try {
      const formDataToSend = new FormData();
      uploadedFiles.forEach((file) => {
        formDataToSend.append("files", file);
      });

      const response = await fetch(
        `http://167.172.164.218/candidates/updateDoc/${candidateId}`,
        {
          method: "PATCH",
          body: formDataToSend,
        }
      );

      const result = await response.json();

      if (result?.data?.success || result?.success) {
        if (result.data?.newResumeLinks) {
          setResume((prev) => [...prev, ...result.data.newResumeLinks]);
        }

        setUploadedFiles([]);
        setSnackbarMessage(result.message || "Documents uploaded successfully!");
        setOpenSnackbar(true);
        setUploadDialogOpen(false);
      } else {
        throw new Error(result.message || "Failed to upload documents");
      }
    } catch (error) {
      console.error("Error uploading documents:", error);
      const errorMessage =
        error.message === "Failed to fetch"
          ? "Network error. Please check your connection."
          : error.message || "Failed to upload documents.";
      setSnackbarMessage(errorMessage);
      setOpenSnackbar(true);
    }
  };

  const getFileNameFromUrl = (url) => {
    if (!url) return "";
    try {
      // Works for both raw filenames and URLs (incl. querystrings)
      const lastSegment = String(url).split("/").pop().split("?")[0];
      // Decode %20 etc. and remove any trailing junk after the real extension
      const decoded = decodeURIComponent(lastSegment);
      // Keep only up to the actual extension (stop at first real extension occurrence)
      // and drop any trailing token/junk after it.
      // Example input may look like: "...Name..pdf<token>"
      const extMatch = decoded.match(/\.(pdf|docx?|txt|jpe?g|png)(?=$|[?#/])/i) || decoded.match(/\.(pdf|docx?|txt|jpe?g|png)/i);
      if (!extMatch) return decoded;

      const extWithDot = extMatch[0]; // includes the dot, e.g. ".pdf"
      const extIndex = decoded.toLowerCase().indexOf(extWithDot.toLowerCase());
      if (extIndex === -1) return decoded;

      // User wants: filename without the extension as well
      // e.g. "...Name..pdf<token>" -> "...Name"
      return decoded.slice(0, extIndex);
    } catch {
      return String(url);
    }
  };

  const downloadHandler = (fileName) => {
    const documentUrl = `${fileName}`;
    window.open(documentUrl, "_blank");
  };

  const handleFileSelection = (e) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleCloseUpload = () => {
    setUploadDialogOpen(false);
    setUploadedFiles([]);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="lg"
        scroll="paper"
        PaperProps={{
          sx: {
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#0b1220" : "#ffffff",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#0f1b33" : "#ffffff",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "center" }}>

            <Typography variant="h6" component="div">
              Edit Candidate
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Button
                size="medium"
                variant="outlined"
                color="warning"
                onClick={() => setUploadDialogOpen(true)}
              >
                Upload documents
              </Button>
              <Button size="medium" variant="outlined" color="error" onClick={onClose}>
                Cancel
              </Button>
            </Box>
          </Box>
        </DialogTitle>

        <Divider />


        <form onSubmit={handleSubmit} noValidate>
            <DialogContent sx={{ pt: 3 }}>
            {loading ? (
              <Box sx={{ py: 4, textAlign: "center" }}>
                <Typography>Loading...</Typography>
              </Box>
            ) : (
              <>

                <Grid container spacing={3}>
                  <Grid md={6} xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel shrink={!!formData.name}>First Name</InputLabel>
                      <OutlinedInput label="First Name" name="name" value={formData.name} onChange={handleChange} />
                    </FormControl>
                  </Grid>

                  <Grid md={6} xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Currency</InputLabel>
                      <Select label="Currency" name="currency" value={formData.currency} onChange={handleChange}>
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
                      <OutlinedInput label="Last Name" name="surName" value={formData.surName} onChange={handleChange} />
                    </FormControl>
                  </Grid>

                  <Grid md={6} xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel shrink={!!formData.currentCTC}>Current CTC</InputLabel>
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
                      <InputLabel shrink={!!formData.contactNo}>Contact Number</InputLabel>
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
                      <InputLabel shrink={!!formData.expectedCTC}>Expected CTC</InputLabel>
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
                      <InputLabel shrink={!!formData.alternateContactNo}>Alternate Contact Number</InputLabel>
                      <OutlinedInput
                        value={formData.alternateContactNo}
                        onChange={handleChange}
                        label="Alternate Contact Number"
                        name="alternateContactNo"
                      />
                    </FormControl>
                  </Grid>

                  <Grid md={6} xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel shrink={!!formData.paymentType}>Payment Model</InputLabel>
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
                      <InputLabel shrink={!!formData.experience}>Experience(in Yrs)</InputLabel>
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
                      <InputLabel shrink={!!formData.screenedBy}>Screened By</InputLabel>
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
                        onChange={handleChange}
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
                      <InputLabel shrink={!!formData.email}>Candidate Email Address</InputLabel>
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
                      <InputLabel shrink={!!formData.screeningOutcome}>Screening Outcome</InputLabel>
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
                      <InputLabel shrink={!!formData.currentLocation}>Current Location</InputLabel>
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
                      <InputLabel shrink={!!formData.workingModel}>Working Model</InputLabel>
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
                      <InputLabel shrink={!!formData.interviewer}>Internal Interviewer</InputLabel>
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
                      <InputLabel shrink={!!formData.currentRole}>Current Role</InputLabel>
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
                      <InputLabel shrink={!!formData.internalRAG}>Internal RAG</InputLabel>
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
                      <InputLabel shrink={!!formData.relocate}>Willing to Relocate</InputLabel>
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
                    <FormControl fullWidth disabled={true} required={false} error={false} sx={{
                      '& .MuiFormLabel-asterisk': { color: 'inherit' },
                    }}>

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
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, newLastComm: e.target.value }))
                        }
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
                          .filter(
                            (role) =>
                              Array.isArray(role.clientId) &&
                              role.clientId.some(
                                (client) => client._id === formData.clientId
                              )
                          )
                          .map((role) => (
                            <MenuItem key={role._id} value={role.roleName}>
                              {role.roleName}
                              <Chip
                                label={role.status}
                                size="small"
                                sx={{
                                  textTransform: "capitalize",
                                  backgroundColor:
                                    role.status === "Active" ? "#d4edda" : "#f8d7da",
                                  color:
                                    role.status === "Active" ? "#155724" : "#721c24",
                                  fontWeight: 500,
                                  ml: 1,
                                }}
                              />
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item md={6} xs={12}>
                    <FormControl fullWidth variant="outlined" required>
                      <InputLabel id="uploaded-documents-label">Uploaded Documents</InputLabel>
                      <Select
                        labelId="uploaded-documents-label"
                        label="Uploaded Documents"
                        defaultValue=""
                      >
                        {resume.length > 0 ? (
                          resume.map((fileName, index) => {
                            const displayName = getFileNameFromUrl(fileName);
                            return (
                              <MenuItem key={index} value={fileName} sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <span>{displayName}</span>
                                <Link
                                  component="button"
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    downloadHandler(fileName);
                                  }}
                                  sx={{
                                    ml: 1,
                                    flexShrink: 0,
                                    fontWeight: 600,
                                    color: "primary.main",
                                    textDecoration: "none",
                                    borderRadius: 1,
                                    px: 0.75,
                                    py: 0.25,
                                    "&:hover": {
                                      backgroundColor: "rgba(25, 118, 210, 0.12)",
                                      textDecoration: "none",
                                      color: "primary.dark",
                                    },
                                  }}
                                >
                                  ⬇
                                </Link>
                              </MenuItem>
                            );
                          })
                        ) : (
                          <MenuItem disabled>No documents uploaded</MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item md={12} xs={12}>
                    <Box component="div" sx={{ mt: 1 }}>
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        Last Comments
                      </Typography>
                      {(formData?.lastComms || []).map((note, index) => (
                        <Box
                          key={index}
                          sx={{
                            mb: 2,
                            p: 2,
                            border: "1px solid",
                            borderColor: (theme) =>
                              theme.palette.mode === "dark" ? "rgba(255,255,255,0.12)" : "#e0e0e0",
                            borderRadius: "4px",
                          }}
                        >
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
                    </Box>
                  </Grid>
                </Grid>
              </>
            )}
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
                  <Button
                    type="submit"
                    variant="outlined"
                    disabled={(!isRequiredValid || loading) ? false : false}
                  >
                    Update
                  </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Upload documents dialog */}
      <Dialog
        onClose={handleCloseUpload}
        open={uploadDialogOpen}
        sx={{ padding: "20px" }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ paddingTop: "30px" }}>Upload Documents</DialogTitle>
        <form onSubmit={uploadHandler}>
          <Box sx={{ padding: "0 30px" }}>
            <Button
              component="label"
              fullWidth
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

          <Box sx={{ padding: "20px 30px" }}>
            <Typography variant="h6" gutterBottom>
              Selected Files:
            </Typography>
            {uploadedFiles && uploadedFiles.length > 0 ? (
              uploadedFiles.map((file, index) => (
                <Box
                  key={index}
                  sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}
                >
                  <Typography variant="body2">{file.name}</Typography>
                  <Button
                    size="small"
                    color="error"
                    onClick={() => removeFile(index)}
                    sx={{ minWidth: "auto", padding: "2px 8px" }}
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

          <Box sx={{ display: "flex", justifyContent: "space-between", padding: "30px" }}>
            <Button
              size="medium"
              variant="outlined"
              color="primary"
              type="submit"
              disabled={uploadedFiles.length === 0}
            >
              Upload Files
            </Button>
            <Button size="medium" variant="outlined" color="error" onClick={handleCloseUpload}>
              Cancel
            </Button>
          </Box>
        </form>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </>
  );
}

export default EditCandidateModal;

