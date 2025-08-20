import { Be_Vietnam_Pro } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  typography: {
    fontFamily: beVietnamPro.style.fontFamily,
  },
});

export default theme;
