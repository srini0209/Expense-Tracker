"use client";
import { ThemeProvider } from "@mui/material/styles";
import { createTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";

export default function MuiThemeProvider({ children }) {
  const [theme, setTheme] = useState(() =>
    createTheme({
      typography: {
        fontFamily: '"Be Vietnam Pro", sans-serif',
      },
    })
  );

  useEffect(() => {
    // ✅ Update theme after component mounts (client-side)
    const newTheme = createTheme({
      typography: {
        fontFamily: "inherit", // Use inherited font from layout
      },
    });
    setTheme(newTheme);
  }, []);
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
