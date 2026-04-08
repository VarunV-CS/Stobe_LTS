import React, { createContext, useContext, useState } from "react";

const DeleteContext = createContext();

export const DeleteProvider = ({ children }) => {
  const [deleteState, setDeleteState] = useState({
    open: false,
    itemId: null,
    itemName: '',
    onConfirm: null,
  });

  const setDeleteItem = (itemId, itemName, onConfirm) => {
    setDeleteState({
      open: true,
      itemId,
      itemName,
      onConfirm,
    });
  };

  const handleConfirm = () => {
    if (deleteState.onConfirm) {
      deleteState.onConfirm();
    }
    handleClose();
  };

  const handleClose = () => {
    setDeleteState({ open: false, itemId: null, itemName: '', onConfirm: null });
  };

  return (
    <DeleteContext.Provider value={{ deleteState, setDeleteItem, handleConfirm, handleClose }}>
      {children}
    </DeleteContext.Provider>
  );
};

export const useDelete = () => {
  const context = useContext(DeleteContext);
  if (!context) {
    throw new Error('useDelete must be used within DeleteProvider');
  }
  return context;
};

