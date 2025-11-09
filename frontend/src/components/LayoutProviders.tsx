"use client";

import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { AuthProvider } from "@/contexts/AuthContext";
import { CRMDataProvider } from "@/contexts/CRMDataContext";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#0288d1",
    },
  },
  shape: {
    borderRadius: 10,
  },
});

export function LayoutProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CRMDataProvider>{children}</CRMDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
