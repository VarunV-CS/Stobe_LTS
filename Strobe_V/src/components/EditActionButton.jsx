import React from 'react';
import { Button } from '@mui/material';
import { PencilSimple as PencilSimpleIcon } from '@phosphor-icons/react/dist/ssr/PencilSimple';

const EditActionButton = ({ onClick, disabled = false, tooltip = 'Edit', size = 'small', ...props }) => (
  <Button
    variant="outlined"
    color="primary"
    onClick={onClick}
    disabled={disabled}
    sx={{
      minWidth: 'auto',
      padding: '8px',
      margin: 0,
      borderRadius: '6px',
      '& .MuiButton-startIcon': {
        margin: 0,
      },
    }}
    startIcon={<PencilSimpleIcon fontSize="1.3rem" />}
    size={size}
    {...props}
  />
);

export default EditActionButton;

