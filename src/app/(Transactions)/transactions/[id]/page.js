// 'use client'
import React from "react";
import { NextResponse } from "next/server";
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
import RadioGroup from "../../../components/Inputs/RadioGroup.js";
import Input from "../../../components/Inputs/Input.js";
import Form from "next/form";
import TransactionForm from "../../../components/TransactionForm.js";
import { useParams } from "next/navigation.js";

// import { useSearchParams } from "next/navigation";
const getTransaction = async (id) => {
  // try {
  const txnRes = await fetch(`http://localhost:3000/api/transactions/${id}`, {
    method: "GET",
    // headers: {Authorization:}
  });
  const data= await txnRes.json()
  // console.log("id-page.js Transaction fetch success - ID:", id);
  console.log("id-page.js Transaction fetch success - res:", data);
  return data;
  // } catch (error) {
  // console.log("error on fetching Txn ", error.message);
  // }

  // return res.json();
};

const Page = async ({ params }) => {
  const { id } = await params;
  const txn =await getTransaction(id);
  console.log("id-page.js Transaction fetch Txn",txn)
  // const submiHandler = async (data) => {
  //   try {
  //     const res = await axiosInstance.put(`/api/transactions/${params.id}`);
  //     console.log("Transaction upated", res);
  //   } catch (error) {
  //     console.log("Error updating Transaction", error.message);
  //   }
  // };
  return <TransactionForm initialData={txn} />;
};

export default Page;
