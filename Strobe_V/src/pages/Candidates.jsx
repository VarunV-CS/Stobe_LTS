import React from "react";
import * as XLSX from "xlsx";

import { useNavigate } from "react-router";
import { Box, styled } from "@mui/system";

import {
  Button,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  CardActions,
  Grid,
  Alert,
} from "@mui/material";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Download as DownloadIcon,
  Plus as PlusIcon,
  Upload as UploadIcon,
} from "@phosphor-icons/react";

import CustomersFilters from "../components/CustomersFilters";
import CustomersTable from "../components/CustomersTable";
import { BASE_URL } from "../core/constants";
import { AuthContext } from "../core/AuthContext";
import CandidatesDashboardCard from "../components/CandidatesDashboardCard";

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

const Candidates = () => {
  const { currentUser } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [data, setData] = React.useState([]);
  const [resume, setResume] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [searchQuery, setSearchQuery] = React.useState(""); // State for search
  const [open, setOpen] = React.useState(false);
  const [recentCandidatesCount, setRecentCandidatesCount] = React.useState(0);
  const [importError, setImportError] = React.useState(null);

  const getCandidates = async () => {
    try {
      const response = await fetch(`http://167.172.164.218/candidates/get1`);
      const result = await response.json();
      const sortedData = result.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      // Calculate candidates from last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentCandidates = sortedData.filter(candidate => 
        new Date(candidate.createdAt) >= thirtyDaysAgo
      );
      
      setRecentCandidatesCount(recentCandidates.length);
      setData(sortedData || []);
    } catch (error) {
      console.error("Error fetching candidates:", error);
      setData([]);
    }
  };

  const handleClose = () => {
    setResume([]);
    setOpen(false);
  };

  React.useEffect(() => {
    getCandidates();
  }, []);

  const filteredData = React.useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return data || [];

    return (data || []).filter(
      (candidate) =>
        candidate.name?.toLowerCase().trim() === query ||
        candidate.surName?.toLowerCase().trim() === query ||
        `${candidate.name} ${candidate.surName}`.toLowerCase().trim() === query ||
        candidate.email?.toLowerCase().trim() === query ||
        candidate.currentRole?.toLowerCase().trim() === query ||
        candidate.status?.toLowerCase().trim() === query ||
        candidate.internalRAG?.toLowerCase().trim() === query ||
        candidate.expectedRole?.toLowerCase().trim() === query
    );
  }, [data, searchQuery]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page when rows per page changes
  };

  const paginatedCustomers = filteredData?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const uploadHandler = (e) => {
    e.preventDefault();
    setOpen(false);
  };
  const createHandler = () => {
    navigate("/candidates/create");
  };
  const importHandler = () => {
    setOpen(true);
  };
  const exportHandler = async () => {
    try {
      let exportData;

      // Use filteredData if available, otherwise use all data
      if (filteredData.length > 0) {
        exportData = filteredData;
      } else if (data.length > 0) {
        exportData = data;
      } else {
        alert("No data to export.");
        return; // Exit if there's absolutely no data
      }
console.log("232323223232",exportData)
debugger;
      // Define headers
      const headers = [
        "name",
        "surName",
        "candidateID",
        "clientFeedback",
        ,"clientsInterviewDate",
        "contactNo",
        "createdAt",
        "createdBy",
        "currency",
        "currentCTC",
        "currentLocation",
        "currentRole",
        "email",
        "expectedCTC",
        "expectedRole",
        "experience",
        "internalRAG",
        "interviewer",
        "lastComms",
    
        "noticePeriod",
        "paymentType",
        "relocate",
        "resume",
        "screenedBy",
        "screeningOutcome",
         "status",
        "updatedAt",
        "workingModel",
        "alternateContactNo"
        
      ];

      // Convert data to an array format
      const dataForExport = exportData.map((candidate) =>
        headers.map((header) => {
          const value = candidate[header];
          return Array.isArray(value)
            ? value
                .map((item) => item.createdBy || JSON.stringify(item))
                .join(", ")
            : value || "";
        })
      );
      console.log("++++++", dataForExport);

      // Create worksheet and workbook
      const worksheet = XLSX.utils.aoa_to_sheet([headers, ...dataForExport]);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Candidates");

      // Generate and download the Excel file
      XLSX.writeFile(workbook, "CandidatesData.xlsx");

      const user = JSON.parse(localStorage.getItem("authData")) || {}; // Handle missing authData
      // Log activity
      await fetch(`http://167.172.164.218/activity/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userID: user._id,
          Activity: "export",
          userName: currentUser.user.FirstName,
        }),
      });

      console.log("Export successful!");
    } catch (error) {
      console.error("Error during export:", error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Validate required fields
      const requiredFields = ['name', 'surName', 'contactNo', 'email', 'currentRole', 'expectedRole'];
      const missingFields = requiredFields.filter(field => !jsonData[0]?.hasOwnProperty(field));
      
      if (missingFields.length > 0) {
        setImportError(`Missing required fields: ${missingFields.join(', ')}`);
        return;
      }

      // Transform data to match API requirements
      const transformedData = jsonData.map(row => ({
        name: row.name,
        surName: row.surName,
        contactNo: row.contactNo,
        alternateContactNo: row.alternateContactNo || '',
        experience: row.experience || '',
        noticePeriod: row.noticePeriod || '',
        email: row.email,
        currentLocation: row.currentLocation || '',
        screenedBy: row.screenedBy || '',
        workingModel: row.workingModel || '',
        currentRole: row.currentRole,
        expectedRole: row.expectedRole,
        currency: row.currency || '',
        currentCTC: row.currentCTC || '',
        expectedCTC: row.expectedCTC || '',
        paymentType: row.paymentType || '',
        relocate: row.relocate || '',
        interviewer: row.interviewer || '',
        status: row.status || '',
        screeningNotes: row.screeningNotes || '',
        screeningOutcome: row.screeningOutcome || '',
        clientsInterviewDate: row.clientsInterviewDate || '',
        internalInterviewNotes: row.internalInterviewNotes || '',
        internalRAG: row.internalRAG || '',
        clientFeedback: row.clientFeedback || '',
        lastComms: row.lastComms || [],
      }));

      // Upload data to API
      const response = await fetch('http://167.172.164.218/candidates/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedData),
      });

      if (!response.ok) {
        throw new Error('Failed to import candidates');
      }

      // Refresh the candidates list
      await getCandidates();
      setOpen(false);
      setResume([]);
      setImportError(null);
    } catch (error) {
      console.error('Error importing file:', error);
      setImportError(error.message || 'Failed to import file. Please check the format and try again.');
    }
  };

  const generateExcelSheet = () => {
    const headers = [
      "name",
      "surName",
      "contactNo",
      "alternateContactNo",
      "experience",
      "noticePeriod",
      "email",
      "currentLocation",
      "screenedBy",
      "workingModel",
      "currentRole",
      "expectedRole",
      "currency",
      "currentCTC",
      "expectedCTC",
      "paymentType",
      "relocate",
      "interviewer",
      "status",
      "screeningNotes",
      "screeningOutcome",
      "clientsInterviewDate",
      "internalInterviewNotes",
      "internalRAG",
      "clientFeedback",
      "lastComms"
    ];

    const worksheet = XLSX.utils.aoa_to_sheet([headers]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Import Template");
    XLSX.writeFile(workbook, "CandidateImportTemplate.xlsx");
  };

  return (
    <div>
      <Stack spacing={3}>
       
        <Stack direction="row" spacing={3}>
          <Stack spacing={1} sx={{ flex: "1 1 auto" }}>
            <Typography variant="h4">Candidates</Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
              <Button
                color="inherit"
                startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}
                onClick={importHandler}
              >
                Import
              </Button>
              <Button
                color="inherit"
                startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}
                onClick={exportHandler}
              >
                Export
              </Button>
            </Stack>
          </Stack>
          <div>
            <Button
              startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
              variant="contained"
              onClick={createHandler}
            >
              Add
            </Button>
          </div>
        </Stack>
        <CustomersFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <CustomersTable
          count={filteredData.length}
          rows={paginatedCustomers}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
        />
      </Stack>
      <Box sx={{ padding: "20px" }}>
        <Dialog
          onClose={handleClose}
          open={open}
          sx={{ padding: "20px" }}
          maxWidth={"sm"}
          fullWidth
        >
          <DialogTitle sx={{ paddingTop: "30px" }}>Import Candidates</DialogTitle>
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
                Upload Excel File
                <VisuallyHiddenInput
                  type="file"
                  accept=".xlsx, .xls"
                  onChange={handleFileUpload}
                />
              </Button>
              {importError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {importError}
                </Alert>
              )}
            </Box>
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Please ensure your Excel file matches the required format.
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                padding: "30px",
              }}
            >
              <CardActions>
                <Button
                  size="medium"
                  variant="outlined"
                  color="primary"
                  onClick={generateExcelSheet}
                >
                  Download Template
                  Submit
                </Button>
              </CardActions>
              <CardActions>
                <Button
                  size="medium"
                  variant="outlined"
                  color="warning"
                  onClick={generateExcelSheet}
                >
                  Sample sheet
                </Button>
              </CardActions>

              <CardActions>
                <Button
                  size="medium"
                  variant="outlined"
                  color="error"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </CardActions>
            </Box>
          </form>
        </Dialog>
      </Box>
    </div>
  );
};

export default Candidates;
