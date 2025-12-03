"use client";

import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
  type PaletteMode,
} from "@mui/material";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { CRMDataProvider } from "@/contexts/CRMDataContext";

const STORAGE_KEY = "clientdesk-color-mode";

type ColorTokens = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
};

const tokenMap: Record<PaletteMode, ColorTokens> = {
  light: {
    background: "#FFFFFF",
    foreground: "#121212",
    card: "#FDFDFD",
    cardForeground: "#121212",
    primary: "#0082D9",
    primaryForeground: "#FFFFFF",
    secondary: "#DFE6EB",
    secondaryForeground: "#121212",
    muted: "#ECF3F8",
    mutedForeground: "#646A6E",
    accent: "#A8DFFF",
    accentForeground: "#001D33",
    destructive: "#E7000B",
    destructiveForeground: "#FFFFFF",
    border: "#DFE6EB",
    chart1: "#0082D9",
    chart2: "#9088F0",
    chart3: "#14BBC2",
    chart4: "#007329",
    chart5: "#C35DD9",
  },
  dark: {
    background: "#030609",
    foreground: "#F8F8F8",
    card: "#080C0F",
    cardForeground: "#F8F8F8",
    primary: "#0098FB",
    primaryForeground: "#FFFFFF",
    secondary: "#121C23",
    secondaryForeground: "#F8F8F8",
    muted: "#0E171E",
    mutedForeground: "#85919A",
    accent: "#0E2C3F",
    accentForeground: "#F8F8F8",
    destructive: "#CC0000",
    destructiveForeground: "#FFFFFF",
    border: "#121C23",
    chart1: "#0098FB",
    chart2: "#9088F0",
    chart3: "#14BBC2",
    chart4: "#05893E",
    chart5: "#D36DEA",
  },
};

type ColorModeContextValue = {
  mode: PaletteMode;
  toggleMode: () => void;
};

const ColorModeContext = createContext<ColorModeContextValue | undefined>(
  undefined,
);

const buildTheme = (mode: PaletteMode) => {
  const tokens = tokenMap[mode];
  return responsiveFontSizes(
    createTheme({
      palette: {
        mode,
        primary: {
          main: tokens.primary,
          contrastText: tokens.primaryForeground,
        },
        secondary: {
          main: tokens.accent,
          contrastText: tokens.accentForeground,
        },
        background: {
          default: tokens.background,
          paper: tokens.card,
        },
        text: {
          primary: tokens.foreground,
          secondary: tokens.mutedForeground,
        },
        divider: tokens.border,
        error: {
          main: tokens.destructive,
          contrastText: tokens.destructiveForeground,
        },
        success: {
          main: tokens.chart4,
        },
        warning: {
          main: tokens.chart2,
        },
        info: {
          main: tokens.chart3,
        },
      },
      shape: {
        borderRadius: 12,
      },
      typography: {
        fontFamily:
          '"Inter", "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        fontWeightMedium: 600,
        fontWeightBold: 700,
      },
      components: {
        MuiPaper: {
          styleOverrides: {
            root: {
              borderRadius: 16,
              border: `1px solid ${tokens.border}`,
              backgroundImage: "none",
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              textTransform: "none",
              fontWeight: 700,
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              backgroundImage: "none",
              borderRadius: 16,
              border: `1px solid ${tokens.border}`,
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              backgroundImage: "none",
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              backgroundColor:
                mode === "light" ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.04)",
            },
            notchedOutline: {
              borderColor: tokens.border,
            },
          },
        },
      },
    }),
  );
};

export function useColorMode() {
  const context = useContext(ColorModeContext);
  if (!context) {
    throw new Error("useColorMode must be used within LayoutProviders");
  }
  return context;
}

export function LayoutProviders({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>("light");

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? (window.localStorage.getItem(STORAGE_KEY) as PaletteMode | null)
        : null;
    if (stored === "dark" || stored === "light") {
      setMode(stored);
      return;
    }
    if (typeof window !== "undefined") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setMode(prefersDark ? "dark" : "light");
    }
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.dataset.theme = mode;
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, mode);
    }
  }, [mode]);

  const theme = useMemo(() => buildTheme(mode), [mode]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const colorModeValue = useMemo(
    () => ({
      mode,
      toggleMode,
    }),
    [mode, toggleMode],
  );

  return (
    <ColorModeContext.Provider value={colorModeValue}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <CRMDataProvider>{children}</CRMDataProvider>
        </AuthProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
