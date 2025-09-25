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
  Tooltip, useMediaQuery
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import moment from "moment";
import { CircularProgress, LinearProgress } from "@mui/joy";
import TransactionTable from "../../../../app/components/TransactionTable";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ChevronRight, ChevronLeft, Search, BrushCleaning, Plus } from "lucide-react";
import Input from "../../../components/Inputs/Input";
import Modal from "../../../components/Modal";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import TransactionForm from "../../../components/TransactionForm";
import TransactionModal from "../../../components/TransactionModal";


const Page = () => {
  const [txns, setTxns] = useState([]);
  // Filter values
  const [type, setType] = useState("");
  const [category, setCategory] = useState("");
  const [catOptions, setCatOptions] = useState([]);
  const [resLen, setResLen] = useState(0);
  const [txnsLen, setTxnsLen] = useState(0);
  const [searchTerm, setsearchTerm] = useState('')
  const [loading, setLoading] = useState(false);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTxnID, setEditTxnID] = useState("");
  const [modalType, setModalType] = useState("");

  // Date range
  const now = new Date();
  const [startDate, setStartDate] = useState(
    new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1))
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0))
  );

  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Fetching Categories based on Transaction type
  const fetchCategories = async (type) => {
    try {
      const response = type.length > 0 && await axiosInstance.get(`/api/categories/type/${type}`);
      console.log("/api/categories/type/[type] category fetched response", response.data);
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
      setLoading(true);
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
      setLoading(false);
    } catch (error) {
      console.error("error", error);
      setLoading(false);
    }
  };
  useEffect(() => {
    console.log("Transactions updated ");

    fetchTransactions();
  }, [type, category, startDate, endDate]);

  const resetFilters = () => {
    setType("");
    setCategory("");
    setStartDate(
      new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1))
    )
    setEndDate(
      new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0))
    )
  }
  function createData(_id, date, category, description, amount, txnType) {
    return { _id, date, category, description, amount, txnType };
  }
  const filteredTransactions = txns.filter((txn) => txn?.description?.toLowerCase().includes(searchTerm.toLowerCase()));
  const rows = filteredTransactions.map((txn) =>
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
    <div className="w-full my-10">
      <div className="flex sm:flex-row flex-col gap-4 text-blue-500 sm:items-center sm:justify-between mb-8">
        <h2 className="text-3xl font-semibold text-left block">Transactions</h2>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setModalType('add');
          }}
          className="px-3 py-2 bg-linear-to-br from-indigo-500 to-blue-500 shadow-lg cursor-pointer rounded-lg text-white font-semibold flex gap-2 items-center"     >
          <Plus /><span>

            Add Transaction
          </span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex xl:flex-row flex-col justify-between items-center w-full gap-4 mb-4">
        <div className="flex lg:flex-row flex-col justify-baseline gap-3 items-center w-full ">

          {/* Date Range filter */}
          <div className="flex gap-2 justify-between items-center lg:w-auto w-full ">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker sx={{
                '& .MuiPickersSectionList-root': {
                  paddingY: '8.5px'
                }, width: '180px',
                fontSize: '12px'
              }}
                label="Start Date"
                value={dayjs(startDate)}
                onChange={(newValue) => {
                  setStartDate(new Date(newValue));
                }}
                format="DD/MM/YYYY"
                defaultValue={{}}

              />
              <DatePicker
                sx={{
                  '& .MuiPickersSectionList-root': {
                    paddingY: '8.5px'
                  }, width: '180px',
                  fontSize: '12px'
                }}
                label="End Date"
                value={dayjs(endDate)}
                onChange={(newValue) => {
                  setEndDate(new Date(newValue));
                }}
                format="DD/MM/YYYY"
                defaultValue={{}}

              />
            </LocalizationProvider>
          </div>

          {/* Transaction Type and Category filter */}
          <div className="flex  gap-2 justify-between items-center lg:w-auto w-full ">
            {/* Transaction Type */}
            <FormControl fullWidth size="small" sx={{ width: '180px' }}>

              <InputLabel id="Txn-type-selector-label">
                Transaction Type
              </InputLabel>
              <Select
                labelId="Txn-type-selector-label"
                id="Txn-type"
                value={type}


                // sx={{
                //   '& .MuiSelect-select': {
                //     paddingTop:'4px',
                //     paddingBottom:'4px'
                //   }
                // }}
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

            {/* Category */}
            <FormControl fullWidth size="small" sx={{ width: '180px' }}>
              <InputLabel id="category-selector-label">Category</InputLabel>

              <Select
                labelId="category-selector-label"
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

          {/* Clear filter */}
          <button
            onClick={() => resetFilters()}
            className=" flex items-center gap-2 text-white bg-error-500 hover:bg-error-600 border cursor-pointer hover rounded-lg text-sm px-3 py-2"
          >
            <BrushCleaning className="text-white text-sm" />
            <span>Clear Filters</span>

          </button>
        </div>

        <div className="lg:w-auto w-full justify-items-center sm:justify-items-end">
          <div className="flex items-center w-full sm:w-auto gap-2 border bg-white border-gray-300 hover:focus:border-gray-400 focus:outline-none p-2 rounded-lg">
            <SearchIcon className="text-gray-500" />
            <input type='text' value={searchTerm} onChange={(e) => setsearchTerm(e.target.value)} placeholder="Search" className="focus:outline-none w-full" />
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center gap-4 mb-5">
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
          <ChevronLeft />Previous {!isMobile ? "Month" : ""}
        </p>

        {/* Showing Month */}
        {
          startDate.getMonth() === endDate.getMonth() ? (
            startDate.getMonth() === now.getMonth() &&
              startDate.getFullYear() === now.getFullYear() ? (
              <p className="text-xs md:text-[14px]  font-medium text-slate-800">
                {moment(startDate).format("MMM YYYY")} (Current Month)
              </p>
            ) : (
              <p
                className="text-xs md:text-[14px] font-medium text-slate-800 cursor-pointer"
                onClick={() => {
                  setStartDate(
                    new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1))
                  );
                  setEndDate(
                    new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0))
                  );
                }}
              ><Tooltip title="Go to Current Month">

                  {moment(startDate).format("MMM YYYY")}
                </Tooltip>
              </p>
            )) :
            (<p className="text-xs md:text-[14px] font-medium text-slate-800 cursor-pointer"
              onClick={() => {
                setStartDate(
                  new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1))
                );
                setEndDate(
                  new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0))
                );
              }}
            ><Tooltip title="Go to Current Month">
                {moment(startDate).format("MMM YYYY")} - {moment(endDate).format("MMM YYYY")}
              </Tooltip>
            </p>)}

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
          Next {!isMobile ? "Month" : ""}  <ChevronRight />
        </p>
      </div>
      <TransactionTable rows={rows} loading={loading} txnsLen={txnsLen} theadStyles={theadStyles} />

      {/* Add Transaction Modal */}
      {/* <Modal
        isOpen={isModalOpen}
        title={`${modalType === 'add' ? 'Add' : 'Edit'} Transaction`}
        onClose={() => setIsModalOpen(false)}
      >
        {modalType === 'add' ? <TransactionForm /> : <TransactionForm
          initialData={txns.find((item) => item._id === editTxnID)}
        />}
      </Modal> */}
      <TransactionModal isModalOpen={isModalOpen} modalType={modalType} editTxnID={editTxnID} Txns={txns} setIsModalOpen={setIsModalOpen} />

    </div>
  );
};

export default Page;
