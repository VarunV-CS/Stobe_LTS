import React from "react";
import ThemeProvider from "../core/theme-provider";
import { DeleteProvider } from "../contexts/DeleteContext";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const MainLayout = ({ children }) => {
  // console.log(Children)
  return (
    <DeleteProvider>
      <ThemeProvider>{children}</ThemeProvider>
      <ConfirmDeleteModal />
    </DeleteProvider>
  );
};

export default MainLayout;

