import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import EditActionButton from "../components/EditActionButton";
import DeleteActionButton from "../components/DeleteActionButton";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  useEffect(() => {
    // const fetchClients = async () => {
    //   try {
    //     const response = await axios.get("http://167.172.164.218/clients/get");
    //     setClients(Array.isArray(response.data) ? response.data : []);
    //   } catch (error) {
    //     console.error("Error fetching clients:", error);
    //     setClients([]); // Ensure clients is always an array
    //   }
    // };
    fetchClients();
  }, []);
  

  const fetchClients = async () => {
    try {
      const response = await axios.get("http://167.172.164.218/client/get");
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleOpen = (client = null) => {
    setEditingClient(client || { name: "", location: "" });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingClient(null);
  };

  const handleChange = (e) => {
    setEditingClient({ ...editingClient, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      if (editingClient._id) {
        await axios.patch(`http://167.172.164.218/client/update/${editingClient._id}`, editingClient);
      } else {
        await axios.post("http://167.172.164.218/client/create", editingClient);
      }
      fetchClients();
      handleClose();
    } catch (error) {
      console.error("Error saving client:", error);
    }
  };

  const handleDeleteConfirm = async (id) => {
    try {
      await axios.delete(`http://167.172.164.218/client/delete/${id}`);
      fetchClients();
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Paper sx={{ mt: 2, p: 2 }}>
      <Stack direction="row" spacing={2} sx={{ mb: 2 }} justifyContent="space-between">
        <TextField
          fullWidth
          label="Search Clients"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>
          Add Client
        </Button>
      </Stack>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><b>Client Name</b></TableCell>
              <TableCell><b>Location</b></TableCell>
              <TableCell><b>Timestamp</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client._id}>
                <TableCell>{client.name}</TableCell>
                <TableCell>{client.location}</TableCell>
                <TableCell>{client.timestamp}</TableCell>
                <TableCell sx={{ display: "flex", gap: 1 }}>
                  <EditActionButton onClick={() => handleOpen(client)} />
                  <DeleteActionButton itemId={client._id} itemName={client.name} onConfirmFn={() => handleDeleteConfirm(client._id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingClient?._id ? "Edit Client" : "Create Client"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Client Name"
              name="name"
              variant="outlined"
              fullWidth
              required
              value={editingClient?.name || ""}
              onChange={handleChange}
            />
            <TextField
              label="Location"
              name="location"
              variant="outlined"
              fullWidth
              required
              value={editingClient?.location || ""}
              onChange={handleChange}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {editingClient?._id ? "Save Changes" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Clients;
