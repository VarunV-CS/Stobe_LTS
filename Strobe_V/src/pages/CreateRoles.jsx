import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField,
  Autocomplete,
  Chip,
  Alert,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router';
import axios from 'axios';

const CreateRoles = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState([]);
  const [formData, setFormData] = useState({
    roleName: '',
    description: '',
    requirements: '',
    clientIds: [],
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://167.172.164.218/client/get');
        setClients(response.data);
      } catch (error) {
        console.error('Error fetching clients:', error);
        setError('Failed to fetch clients');
      }
    };

    fetchClients();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      // Validate form data
      if (!formData.roleName.trim()) {
        throw new Error('Role name is required');
      }
      if (selectedClients.length === 0) {
        throw new Error('At least one client must be selected');
      }

      // Transform selected clients to array of IDs
      const clientIds = selectedClients.map(client => client._id);
      
      const response = await axios.post('http://167.172.164.218/roles/create', {
        ...formData,
        clientIds,
      });

      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/roles');
        }, 2000);
      }
    } catch (error) {
      console.error('Error creating role:', error);
      setError(error.response?.data?.message || error.message || 'Failed to create role');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Card>
        <CardHeader title="Create New Role" />
        <Divider />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Role Name"
                  name="roleName"
                  value={formData.roleName}
                  onChange={handleChange}
                  required
                  error={!!error && !formData.roleName.trim()}
                  helperText={!!error && !formData.roleName.trim() ? 'Role name is required' : ''}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Requirements"
                  name="requirements"
                  value={formData.requirements}
                  onChange={handleChange}
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={clients}
                  getOptionLabel={(option) => option.name}
                  value={selectedClients}
                  onChange={(event, newValue) => {
                    setSelectedClients(newValue);
                  }}
                  renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                      <Chip
                        label={option.name}
                        {...getTagProps({ index })}
                        key={option._id}
                        color="primary"
                        variant="outlined"
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select Clients"
                      placeholder="Search clients..."
                      required
                      error={!!error && selectedClients.length === 0}
                      helperText={!!error && selectedClients.length === 0 ? 'At least one client must be selected' : ''}
                    />
                  )}
                />
              </Grid>
              {error && (
                <Grid item xs={12}>
                  <Alert severity="error">{error}</Alert>
                </Grid>
              )}
              {success && (
                <Grid item xs={12}>
                  <Alert severity="success">Role created successfully!</Alert>
                </Grid>
              )}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => navigate('/roles')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Role'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateRoles;
