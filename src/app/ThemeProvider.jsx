"use client"; // Mark as Client Component

import { ThemeProvider } from "@mui/material/styles";
import theme from "../../utils/theme";
export default function MuiThemeProvider({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
