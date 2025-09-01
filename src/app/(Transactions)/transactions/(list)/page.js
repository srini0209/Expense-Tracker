"use client";
import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";
import axiosInstance from "../../../axiosInstance";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  colors,
} from "@mui/material";
import moment from "moment";
import { FaEdit } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { CircularProgress, LinearProgress } from "@mui/joy";
import TransactionTable from "../../../../app/components/TransactionTable";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ChevronRight,ChevronLeft } from "lucide-react";

const page = () => {
  const [txns, setTxns] = useState([]);
  // Filter values
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [catOptions, setCatOptions] = useState([]);
  const [resLen, setResLen] = useState(0);
  const [txnsLen, setTxnsLen] = useState(0);


  // Date range
  const now = new Date();
  const [startDate, setStartDate] = useState(
    new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1))
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1))
  );
  console.log("Transaction/list/page.js Months");
  console.log("now:", now);
  console.log("Start of the month:", startDate.toISOString());
  console.log("End of the month:", endDate.toISOString());
  const router = useRouter();

  // Fetching Categories based on Transaction type
  const fetchCategories = async (type) => {
    try {
      const response = await axiosInstance.get(`/api/categories/type/${type}`);
      console.log("/api/categories/type/[type] response", response.data);
      setResLen(response.data.length);
      if (response.data.length > 0) {
        setCatOptions(response.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    fetchCategories(type);
  }, [type]);

  // Fetching Transactions
  const fetchTransactions = async () => {
    try {
      const params = {};
      if (type) params.type = type;
      if (category) params.category = category;
      params.startDate = startDate.toISOString();
      params.endDate = endDate.toISOString();
      const response = await axiosInstance.get("/api/transactions", { params });
      // console.log("transactions/list/page.js response", response);
      // if (response.data.redirectUrl) {
      //   // console.log("RedirectURL present", response.data.redirectUrl);
      //   toast.error("Session Expired, Login Again!");
      //   router.push(response.data.redirectUrl);
      //   return;
      // }
      console.log("/transactions/list/page.js Txn :", response.data.txns);
      if (response.data.txns?.length > 0) {
        setTxns(response.data.txns);
      }
      setTxnsLen(response.data?.txns?.length);
      // console.log(response.data);
    } catch (error) {
      console.error("error", error);
    }
  };
  useEffect(() => {
    // console.log("Transactions Page mounted ");

    fetchTransactions();
  }, [type, category, startDate, endDate]);

  function createData(_id, date, category, description, amount, txnType) {
    return { _id, date, category, description, amount, txnType };
  }

  const rows = txns.map((txn) =>
    createData(
      txn._id,
      txn.date,
      txn.category,
      txn.description,
      txn.amount,
      txn.txnType
    )
  );
  console.log("rows", rows);
  const theadStyles = {
    color: "#7008e7",
    fontWeight: 600,
    fontSize: 16,
  };
  return (
    <div className="lg:w-[70%] md:w-[80%]  w-full px-10 mx-auto my-20">
      <div className="flex flex-row text-black items-center justify-between mb-4">
        <h2 className="text-3xl font-semibold ">Transactions</h2>
        <Link
          href={"/transactions/add"}
          className="bg-blue-50 border-blue-200 border px-4 py-2 items-center rounded-lg font-medium text-blue-600 "
        >
          Add Transaction
        </Link>
      </div>
      <div className="flex flex-row justify-baseline gap-3 items-center mb-4">
        <div className="flex flex-row gap-4">
          <p
            className="text-sm p-2 text-amber-500 cursor-pointer flex items-center"
            onClick={() => {
              let newstartDate = new Date(startDate);
              let newendDate = new Date(endDate);
              newstartDate.setMonth(newstartDate.getMonth() - 1);
              newendDate.setMonth(newendDate.getMonth() - 1);
              setStartDate(newstartDate);
              setEndDate(newendDate);
            }}
          >
          <ChevronLeft /> Previous Month
          </p>
          <p
            className="text-sm p-2 text-amber-500 cursor-pointer flex items-center"
            onClick={() => {
              let newstartDate = new Date(startDate);
              let newendDate = new Date(endDate);
              newstartDate.setMonth(startDate.getMonth() + 1);
              newendDate.setMonth(endDate.getMonth() + 1);
              setStartDate(newstartDate);
              setEndDate(newendDate);
            }}
          >
            Next Month <ChevronRight />
          </p>
        </div>
        <div className="flex flex-col gap-2 w-[180px]">
          <FormControl fullWidth>
            {/* <label className="text-slate-800 text-[13px] font-medium" htmlFor="Txn-type-selector">Transaction Type</label> */}
            <InputLabel id="Txn-type-selector-label">
              Transaction Type
            </InputLabel>
            <Select
              labelId="Txn-type-selector-label"
              id="Txn-type"
              value={type}
              // sx={{paddingBottom:'5px', paddingTop:'5px'}}
              label="Transaction Type"
              onChange={(e) => {
                setType(e.target.value);
                setCategory("");
              }}
            >
              <MenuItem key={"Expense"} value="Expense">
                Expense
              </MenuItem>
              <MenuItem key={"Income"} value="Income">
                Income
              </MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className="flex flex-col gap-2 w-[180px]">
          <FormControl fullWidth>
            <InputLabel id="category-selector-label">Category</InputLabel>

            <Select
              labelId="category-selector"
              id="category-selector"
              value={category}
              label="Select Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              {catOptions.map((catOption, index) => (
                <MenuItem key={catOption._id} value={catOption.name}>
                  {catOption.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <Button
          onClick={() => {
            setType("");
            setCategory("");
          }}
          variant="outlined"
        >
          Clear filter
        </Button>
      </div>
      <TransactionTable rows={rows} txnsLen={txnsLen} theadStyles={theadStyles} />
    </div>
  );
};

export default page;
