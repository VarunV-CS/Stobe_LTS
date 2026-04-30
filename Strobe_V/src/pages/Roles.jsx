import { Add } from "@mui/icons-material";
import EditActionButton from "../components/EditActionButton";
import DeleteActionButton from "../components/DeleteActionButton";
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

const Roles = () => {
  const [clients, setClients] = useState([]);
  const [roles, setRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    role.roleName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.requiredExperience?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.techStack?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.status?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.client?.some(c => c.name?.toLowerCase().includes(searchQuery.toLowerCase()))
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
                              <DeleteActionButton itemId={role._id} itemName={role.roleName} onConfirmFn={() => handleDeleteConfirm(role._id)} />
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
    </Box>
  );
};

export default Roles;
