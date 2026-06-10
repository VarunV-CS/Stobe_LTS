import CssBaseline from "@mui/material/CssBaseline";
import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import { useTheme } from "../contexts/ThemeContext";
import { useEffect } from "react";

import { createTheme } from "../styles/create-theme";

const MuiThemeProvider = ({ children }) => {
  const { mode } = useTheme();
  const theme = createTheme();

  useEffect(() => {
    // Update the color scheme when mode changes
    document.documentElement.setAttribute('data-mui-color-scheme', mode);
  }, [mode]);

  return (
    <CssVarsProvider
      theme={theme}
      defaultMode={mode}
      colorSchemeStorage={{
        getColorScheme: () => {
          const saved = localStorage.getItem('theme-mode');
          return (saved === 'dark' || saved === 'light') ? saved : undefined;
        },
        setColorScheme: (scheme) => {
          localStorage.setItem('theme-mode', scheme);
        },
      }}
    >
      <CssBaseline />
      {children}
    </CssVarsProvider>
  );
};

export default MuiThemeProvider;
