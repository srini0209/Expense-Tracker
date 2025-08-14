import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const loading = () => {
  return (
    <Box 
      display="flex" 
      flexDirection="column"
      justifyContent="center" 
      alignItems="center"
      height="100vh"
      gap={2}
    >
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h6" color="textSecondary">
        Loading transactions...
      </Typography>
    </Box>
  );
};

export default loading;
