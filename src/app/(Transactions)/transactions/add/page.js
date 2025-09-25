"use client";
import RadioGroup from "../../../components/Inputs/RadioGroup.js";
import Input from "../../../components/Inputs/Input.js";
import Form from "next/form";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation.js";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axiosInstance from "../../../axiosInstance.js";
import toast from "react-hot-toast";
import TransactionForm from "../../../components/TransactionForm.js";

const Page = () => {

  return <TransactionForm  />;
};

export default Page;
