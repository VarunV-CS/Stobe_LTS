import { Add } from "@mui/icons-material";
import EditActionButton from "../components/EditActionButton";
import DeleteActionButton from "../components/DeleteActionButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RoleCandidatesModal from "../components/RoleCandidatesModal";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import useDebounce from "../core/useDebounce";

const Roles = () => {
  const [clients, setClients] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQuery = useDebounce(searchQuery, 350);
  const [open, setOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [roleCandidatesOpen, setRoleCandidatesOpen] = useState(false);
  const [selectedRoleName, setSelectedRoleName] = useState("");
  const [roleCandidates, setRoleCandidates] = useState([]);
  const [roleCandidatesLoading, setRoleCandidatesLoading] = useState(false);
  const [roleCandidatesError, setRoleCandidatesError] = useState(null);

  useEffect(() => {
    axios.get("http://167.172.164.218/client/get")
      .then((res) => setClients(res.data))
      .catch((err) => console.error("Error fetching clients:", err));
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://167.172.164.218/roles/get");
        console.log(response.data);
        const transformedRoles = Array.isArray(response.data)
          ? response.data.map(role => ({
              ...role,
              client: Array.isArray(role.clientId)
                ? role.clientId.map(c => ({ _id: c._id, name: c.name }))
                : role.clientId ? [{ _id: role.clientId._id, name: role.clientId.name }] : []
            }))
          : [];
        setRoles(transformedRoles);
        setError(null);
      } catch (error) {
        console.error("Error fetching roles:", error);
        setError("Failed to fetch roles. Please try again later.");
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  const handleOpen = (role = null) => {
    setEditingRole(role || {
      roleName: "",
      requiredExperience: "",
      clientId: [],
      location: "",
      techStack: "",
      startDate: "",
      endDate: "",
      status: "Active"
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingRole(null);
  };

  const handleOpenRoleCandidates = async (roleName) => {
    setSelectedRoleName(roleName || "");
    setRoleCandidatesOpen(true);
    setRoleCandidatesLoading(true);
    setRoleCandidatesError(null);

    try {
      const response = await axios.get("http://167.172.164.218/candidates/get1");
      const allCandidates = Array.isArray(response.data?.data)
        ? response.data.data
        : Array.isArray(response.data)
          ? response.data
          : [];

      const filtered = allCandidates.filter(
        (c) => String(c.currentRole || "").trim() === String(roleName || "").trim()
      );

      setRoleCandidates(
        filtered.map((c) => ({
          _id: c._id,
          candidateID: c.candidateID,
          name: `${c.name || ""} ${c.surName || ""}`.trim() || c.name,
          email: c.email,
          currentRole: c.currentRole,
          status: c.status,
          internalRAG: c.internalRAG,
          createdAt: c.createdAt,
        }))
      );
    } catch (err) {
      console.error("Error fetching candidates for role:", err);
      setRoleCandidates([]);
      setRoleCandidatesError("Failed to load candidates.");
    } finally {
      setRoleCandidatesLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingRole((prev) => ({ ...prev, [name]: value }));
  };

const handleSave = async () => {
    try {
      // Extract just the client IDs from the client array
      const clientIdArray = Array.isArray(editingRole.clientId)
        ? editingRole.clientId.map(c => typeof c === 'object' ? c._id : c)
        : [];

      const payload = {
        roleName: editingRole.roleName,
        requiredExperience: editingRole.requiredExperience,
        location: editingRole.location,
        techStack: editingRole.techStack,
        startDate: editingRole.startDate,
        endDate: editingRole.endDate,
        status: editingRole.status,
        clientId: clientIdArray
      };

      if (editingRole._id) {
        await axios.patch(`http://167.172.164.218/roles/update/${editingRole._id}`, payload);
      } else {
        await axios.post("http://167.172.164.218/roles/create", payload);
      }
      handleClose();
      
      // Fetch and apply transformation (same as initial fetch)
      const res = await axios.get("http://167.172.164.218/roles/get");
      console.log(res.data);
      const transformedRoles = Array.isArray(res.data)
        ? res.data.map(role => ({
            ...role,
            client: Array.isArray(role.clientId)
              ? role.clientId.map(c => ({ _id: c._id, name: c.name }))
              : role.clientId ? [{ _id: role.clientId._id, name: role.clientId.name }] : []
          }))
        : [];
      setRoles(transformedRoles);
    } catch (error) {
      console.error("Error saving role:", error);
    }
  };

  const handleDeleteConfirm = async (id) => {
    // Removed native confirm, handled by modal
    try {
      await axios.delete(`http://167.172.164.218/roles/delete/${id}`);
      setRoles((prev) => prev.filter((r) => r._id !== id));
    } catch (error) {
      console.error("Error deleting role:", error);
      setError("Failed to delete role");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'error';
      case 'on hold':
        return 'warning';
      case 'completed':
        return 'info';
      default:
        return 'default';
    }
  };

  const filteredRoles = roles.filter((role) =>
    role.roleName?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
    role.description?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
    role.requiredExperience?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
    role.location?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
    role.techStack?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
    role.status?.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
    role.client?.some(c => c.name?.toLowerCase().includes(debouncedQuery.toLowerCase()))
  );

  const paginatedRoles = filteredRoles.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardHeader
          title="Roles"
          action={
            <Button
              startIcon={<Add />}
              variant="contained"
              onClick={() => handleOpen()}
            >
              Add Role
            </Button>
          }
        />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Search Roles"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by role name, client, location, status, etc."
              />
            </Grid>
            <Grid item xs={12}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
              ) : roles.length === 0 ? (
                <Typography align="center" sx={{ p: 3 }}>
                  No roles found. Create a new role to get started.
                </Typography>
              ) : (
                <Box sx={{ overflowX: 'auto' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Role Name</TableCell>
                        <TableCell>Client(s)</TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Required Experience</TableCell>
                        <TableCell>Tech Stack</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>End Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Created At</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedRoles.map((role) => (
                        <TableRow key={role._id}>
                          <TableCell>{role.roleName || '-'}</TableCell>
                          <TableCell>
                            {role.client && role.client.length > 0 ? (
                              <Stack direction="row" spacing={1} flexWrap="wrap">
                                {role.client.map((c) => (
                                  <Chip key={c._id} label={c.name} size="small" color="primary" />
                                ))}
                              </Stack>
                            ) : '-'}
                          </TableCell>
                          <TableCell>{role.location || '-'}</TableCell>
                          <TableCell>{role.requiredExperience || '-'}</TableCell>
                          <TableCell>{role.techStack || '-'}</TableCell>
                          <TableCell>
                            {role.startDate ? new Date(role.startDate).toLocaleDateString() : '-'}
                          </TableCell>
                          <TableCell>
                            {role.endDate ? new Date(role.endDate).toLocaleDateString() : '-'}
                          </TableCell>
                          <TableCell>
                            {role.status ? (
                              <Chip 
                                label={role.status} 
                                size="small" 
                                color={getStatusColor(role.status)}
                                variant="outlined"
                              />
                            ) : '-'}
                          </TableCell>
                          <TableCell>{new Date(role.createdAt).toLocaleDateString() || '-'}</TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              <EditActionButton onClick={() => handleOpen(role)} />
                              <IconButton
                                size="small"
                                onClick={() => handleOpenRoleCandidates(role.roleName)}
                                aria-label={`View candidates for ${role.roleName}`}
                                sx={{
                                  borderRadius: 1,
                                  border: '1px solid rgba(0,0,0,0.12)',
                                }}
                              >
                                <VisibilityIcon fontSize="small" />
                              </IconButton>
                              <DeleteActionButton
                                itemId={role._id}
                                itemName={role.roleName}
                                onConfirmFn={() => handleDeleteConfirm(role._id)}
                              />
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  <TablePagination
                    component="div"
                    count={filteredRoles.length}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => {
                      setRowsPerPage(parseInt(e.target.value, 10));
                      setPage(0);
                    }}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[5, 10, 25]}
                  />
                </Box>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Dialog for Create/Edit Role */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editingRole?._id ? "Edit Role" : "Create Role"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Role Name" 
                  name="roleName" 
                  fullWidth 
                  required 
                  value={editingRole?.roleName || ""} 
                  onChange={handleChange} 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Required Experience" 
                  name="requiredExperience" 
                  fullWidth 
                  required 
                  value={editingRole?.requiredExperience || ""} 
                  onChange={handleChange} 
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Clients</InputLabel>
                  <Select
                    multiple
                    name="clientId"
                    value={
                      Array.isArray(editingRole?.clientId)
                        ? editingRole.clientId.map(c => typeof c === 'object' ? c._id : c)
                        : []
                    }
                    onChange={handleChange}
                    input={<OutlinedInput label="Clients" />}
                    renderValue={(selected) =>
                      selected.map(id => {
                        const client = clients.find(c => c._id === id);
                        return client?.name || id;
                      }).join(", ")
                    }
                  >
                    {clients.map((client) => (
                      <MenuItem key={client._id} value={client._id}>
                        {client.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Location" 
                  name="location" 
                  fullWidth 
                  required 
                  value={editingRole?.location || ""} 
                  onChange={handleChange} 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField 
                  label="Tech Stack" 
                  name="techStack" 
                  fullWidth 
                  required 
                  value={editingRole?.techStack || ""} 
                  onChange={handleChange} 
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Start Date"
                  name="startDate"
                  type="date"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={editingRole?.startDate ? editingRole.startDate.split('T')[0] : ""}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="End Date"
                  name="endDate"
                  type="date"
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={editingRole?.endDate ? editingRole.endDate.split('T')[0] : ""}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={editingRole?.status || "Active"}
                    onChange={handleChange}
                    input={<OutlinedInput label="Status" />}
                  >
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                    <MenuItem value="On Hold">On Hold</MenuItem>
                    <MenuItem value="Completed">Completed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {editingRole?._id ? "Save Changes" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      <RoleCandidatesModal
        open={roleCandidatesOpen}
        onClose={() => setRoleCandidatesOpen(false)}
        title={`Candidates with role: ${selectedRoleName}`}
        candidates={roleCandidates}
        loading={roleCandidatesLoading}
      />

    </Box>
  );
};

export default Roles;
