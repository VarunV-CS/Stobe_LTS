import React from 'react';
import { Button } from '@mui/material';
import { Trash as TrashIcon } from '@phosphor-icons/react/dist/ssr/Trash';
import { useDelete } from '../contexts/DeleteContext';

const DeleteActionButton = ({ itemId, itemName, onConfirmFn, disabled = false, tooltip = 'Delete', size = 'small', ...props }) => {
  const { setDeleteItem } = useDelete();

  const handleClick = () => {
    setDeleteItem(itemId, itemName, onConfirmFn);
  };

  return (
    <Button
      variant="outlined"
      color="error"
      onClick={handleClick}
      disabled={disabled}
      sx={{
        minWidth: 'auto',
        padding: '8px',
        borderRadius: '6px',
        '& .MuiButton-startIcon': {
          margin: 0,
        },
      }}
      startIcon={<TrashIcon fontSize="1.3rem" />}
      size={size}
      {...props}
    />
  );
};

export default DeleteActionButton;

