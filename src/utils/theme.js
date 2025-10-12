//theme.js file
import { Be_Vietnam_Pro } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-be-vietnam-pro",
});

// ✅ Function that creates theme safely
export const getTheme = () => {
  return createTheme({
    typography: {
      fontFamily: beVietnamPro.style?.fontFamily || '"Be Vietnam Pro", sans-serif',
    },
  });
};

// Don't export the theme directly - export the function
export default getTheme;
