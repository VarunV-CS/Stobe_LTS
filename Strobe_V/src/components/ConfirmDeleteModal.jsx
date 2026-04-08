import React, { useState } from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Typography,
  TextField,
} from '@mui/material';
import { useDelete } from '../contexts/DeleteContext';

const ConfirmDeleteModal = () => {
  const { deleteState, handleConfirm, handleClose } = useDelete();
  const [confirmText, setConfirmText] = useState('');

  if (!deleteState.open) return null;

  const { itemName } = deleteState;
  const isEnabled = confirmText.trim() === itemName;

  return (
    <Dialog open={deleteState.open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Confirm Delete</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 2 }}>
          Are you sure you want to delete "{itemName}"? This action cannot be undone.
        </Typography>
        <Typography variant="body2" color="error.main">
          Type <strong>{itemName}</strong> to confirm:
        </Typography>
        <TextField
          fullWidth
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={itemName}
          sx={{ mt: 1 }}
          autoFocus
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleConfirm} 
          color="error" 
          variant="contained"
          disabled={!isEnabled}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteModal;

