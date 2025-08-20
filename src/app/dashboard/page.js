"use client";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../Context/UserContext";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";

// https://chat.mistral.ai/chat/13fa5c37-20a5-4390-aec4-209b91592369 style guide chat reply
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import dayjs from "dayjs";
import axiosInstance from "../axiosInstance";
import TransactionTable from "../components/TransactionTable";
import Link from "next/link";

const page = () => {
  // const { user, loading, error } = useContext(UserContext);
  // const [date, setDate] = useState(dayjs());
  // const handleDateChange = (newValue) => {
  //   setDate(newValue.toISOString());
  //   console.log(newValue);
  //   console.log("Selected Date:", newValue ? newValue.toISOString() : null);
  //   console.log(date.format("DD-MM-YYYY hh:mm A"));
  // };
  // const dayjsValue = dayjs();

  // Fetching Transactions
  const [txns, setTxns] = useState([])

  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [balance, setBalance] = useState(0);

  const fetchTransactions = async () => {

    try {
      const params = { limit: 10 };

      const response = await axiosInstance.get("/api/transactions", { params });
      console.log("/transactions/list/page.js Txn :", response.data.txns);
      if (response.data.txns?.length > 0) {
        setTxns(response.data.txns);
      }
      const income = response.data.totalIncome;
      const expense = response.data.totalExpense
      const bal = income - expense;

      setTotalIncome(income);
      setTotalExpense(expense);
      setBalance(bal);
      // console.log("totalExpense:", totalExpense);
      // setBalance(totalIncome - totalExpense);
      // console.log(response.data);
    } catch (error) {
      console.error("error", error);
    }
  };
  useEffect(() => {
    // console.log("Transactions Page mounted ");

    fetchTransactions();

  }, []);


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
  // console.log("rows", rows);
  const theadStyles = {
    color: '#7008e7',
    fontWeight: 600,
    fontSize: 16,
  };
  return (
    <div className="text-black text-center w-[1200px]  mx-auto text-2xl my-5">
      {/* <p className="text-slate-800 text-[13px]">{JSON.stringify(user)}</p>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateTimePicker
          value={date}
          onChange={handleDateChange}
          enableAccessibleFieldDOMStructure={false}
          slots={{
            textField: (params) => <TextField {...params} />,
          }}
        />
      </LocalizationProvider>
      <p className="text-black">{dayjsValue.toISOString()}</p> */}
      <div className="flex flex-row mx-auto gap-15 justify-between mb-10">
        <div className="bg-green-100 border border-green-300 px-5 py-5 w-full rounded-lg shadow"><h2>Total Income</h2>
          <h3 className="text-xl font-bold text-green-500">{totalIncome}</h3>
        </div>
        <div className="bg-red-100 border border-red-300 px-5 py-5  w-full rounded-lg shadow" ><h2>Total Expense</h2>
          <h3 className="text-xl font-bold text-red-500">{totalExpense}</h3>
        </div>
        <div className="bg-blue-100 border border-blue-300 px-5 py-5 w-full rounded-lg shadow" ><h2>Balance</h2>
          <h3 className="text-xl font-bold text-blue-500">{balance}</h3>
        </div>
      </div>

      <div className="mb-5">
        <TransactionTable rows={rows} theadStyles={theadStyles} />
      </div>
      <div className="justify-end text-right"><Link href={'/transactions'} className="bg-cyan-100 border border-cyan-200 text-cyan-500 text-[16px] font-medium rounded-lg px-3 py-2">See All Transactions</Link></div>
    </div>
  );
};

export default page;
