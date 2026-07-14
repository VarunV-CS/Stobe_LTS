import { useState } from 'react';

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
import { useTheme } from '../contexts/ThemeContext';

const ConfirmDeleteModal = () => {
  const { deleteState, handleConfirm, handleClose } = useDelete();
  const { mode } = useTheme();
  const [confirmText, setConfirmText] = useState('');

  if (!deleteState.open) return null;

  const { itemName } = deleteState;
  const isEnabled = confirmText.trim() === itemName;

  return (
    <Dialog
      open={deleteState.open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: mode === 'dark' ? '#000' : undefined,
          color: mode === 'dark' ? '#fff' : undefined,
        },
      }}
    >
      <DialogTitle sx={{ color: mode === 'dark' ? '#fff' : undefined }}>Confirm Delete</DialogTitle>

      <DialogContent>
        <Typography sx={{ mb: 2, color: mode === 'dark' ? '#fff' : undefined }}>

          Are you sure you want to delete {itemName}? This action cannot be undone.
        </Typography>
        <Typography variant="body2" color="error.main" sx={{ color: mode === 'dark' ? 'error.main' : 'error.main' }}>

          Type <strong>{itemName}</strong> to confirm:
        </Typography>
        <TextField
          fullWidth
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder={itemName}
          sx={{
            mt: 1,
            '& .MuiInputBase-input': { color: mode === 'dark' ? '#fff' : undefined },
            '& .MuiInputBase-input::placeholder': {
              color: mode === 'dark' ? 'rgba(255,255,255,0.7)' : undefined,
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'dark' ? 'rgba(255,255,255,0.35)' : undefined,
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'dark' ? 'rgba(255,255,255,0.55)' : undefined,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: mode === 'dark' ? 'rgba(255,255,255,0.8)' : undefined,
            },
          }}
          autoFocus
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{ color: mode === 'dark' ? '#fff' : undefined }}
        >
          Cancel
        </Button>

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

