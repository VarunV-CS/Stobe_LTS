import React from "react";
import MuiThemeProvider from "../core/theme-provider";
import { ThemeProvider } from "../contexts/ThemeContext";
import { DeleteProvider } from "../contexts/DeleteContext";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const MainLayout = ({ children }) => {
  // console.log(Children)
  return (
    <ThemeProvider defaultMode="light">
      <DeleteProvider>
        <MuiThemeProvider>{children}</MuiThemeProvider>
        <ConfirmDeleteModal />
      </DeleteProvider>
    </ThemeProvider>
  );
};

export default MainLayout;

