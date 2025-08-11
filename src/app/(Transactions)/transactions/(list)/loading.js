import React from "react";
import { CircularProgress, Box } from "@mui/material";
import { LinearProgress } from "@mui/joy";

const loading = () => {
  return (
    <div className="flex justify-center items-center">
      <h3 className="text-xl text-slate-800">Loading...</h3>
      <LinearProgress />
    </div>
  );
};

export default loading;
