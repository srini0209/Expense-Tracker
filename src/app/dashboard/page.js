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
import PieActiveArc from "../components/CategoriesChart";

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
  const [recentTxns, setRecentTxns] = useState([]);

  // Getting current month's all Transactions
  // const [allTxns, setAllTxns] = useState([]);

  // const [totalIncome, setTotalIncome] = useState(0);
  // const [totalExpense, setTotalExpense] = useState(0);
  const [analyData, setAnalyData] = useState([]);
  // const [balance, setBalance] = useState(0);
  const [exCatData, setExCatData] = useState([]);
  const [incCatData, setIncCatData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [txnsLen, setTxnsLen] = useState(0);
  // Date range
  const now = new Date();
  const [startDate, setStartDate] = useState(
    new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1)).toISOString()
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1)).toISOString()
  );

  // Fetching recent (10) Transactions
  const fetchRecentTransactions = async () => {
    try {
      setLoading(true);
      const params = { limit: 10 };
      params.startDate = startDate;
      params.endDate = endDate;
      const response = await axiosInstance.get("/api/transactions", { params });
      console.log("/dashboard/page.js recent Txn :", response.data.txns);
      console.log("/dashboard/page.js recent response :", response);
      if (response.data.txns?.length > 0) {
        setRecentTxns(response.data.txns);
      }
      setTxnsLen(response.data.txns?.length);
      setAnalyData(response.data.analyticsData);
      const income = response.data.analyticsData[0]?.totalAmount;
      const expense = response.data.analyticsData[1]?.totalAmount;
      const bal = income - expense;

      // setTotalIncome(income);
      // setTotalExpense(expense);
      // setBalance(bal);
      // console.log("totalExpense:", totalExpense);
      // setBalance(totalIncome - totalExpense);
      // console.log(response.data);
    } catch (error) {
      console.error("error", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetching all transactions of the month
  // const fettchAllTransactions = async () => {
  //   try {
  //     const params = { startDate: startDate, endDate: endDate };

  //     const response = await axiosInstance.get("/api/transactions", { params });
  //     console.log("/dashboard/page.js all Txn :", response.data.txns);
  //     if (response.data.txns?.length > 0) {
  //       setAllTxns(response.data.txns);
  //     }
  //   } catch (error) {
  //     console.error("error", error);
  //   }
  // };
  useEffect(() => {
    // console.log("Transactions Page mounted ");

    fetchRecentTransactions();
    // fettchAllTransactions();
  }, []);

  useEffect(() => {
    console.log("AnalyData updated:", analyData);
  }, [analyData]);
  // console.log("dashboard All Txns:", allTxns);
  // Calculating category wise total amount spent current month
  // const categoryTotal = allTxns.map((txn) => {});

  function createData(_id, date, category, description, amount, txnType) {
    return { _id, date, category, description, amount, txnType };
  }

  const rows = recentTxns.map((txn) =>
    createData(
      txn._id,
      txn.date,
      txn.category,
      txn.description,
      txn.amount,
      txn.txnType
    )
  );

  console.log("AnalyData", analyData);

  // setExCatData(analyData[1].categories);
  // console.log("exCatData:", exCatData);
  // console.log("rows", rows);
  const theadStyles = {
    color: "#7008e7",
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
      {loading ? (
        <div>Loading...</div>
      ) : txnsLen>0? (
        <>
          <div className="flex flex-row mx-auto gap-15 justify-between mb-10">
            {analyData.map((data) => (
              <div
                key={data.txnType}
                className={`${
                  data.txnType === "Income"
                    ? "bg-green-100 border border-green-300"
                    : "bg-red-100 border border-red-300"
                } px-5 py-5 w-full rounded-lg shadow`}
              >
                <h2>Total {data.txnType}</h2>
                <h3
                  className={`text-xl font-bold ${
                    data.txnType === "Income"
                      ? " text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {data.totalAmount}
                </h3>
                <PieActiveArc data={analyData} type={data.txnType} />
              </div>
            ))}

            <div className="bg-blue-100 border border-blue-300 px-5 py-5 w-full rounded-lg shadow">
              <h2>Balance</h2>
              <h3 className="text-xl font-bold text-blue-500">
                {analyData[0]?.totalAmount - analyData[1]?.totalAmount}
              </h3>
            </div>
          </div>

          <div className="mb-5">
            <TransactionTable rows={rows} txnsLen={txnsLen} theadStyles={theadStyles} />
          </div>
          <div className="justify-end text-right">
            <Link
              href={"/transactions"}
              className="bg-cyan-100 border border-cyan-200 text-cyan-500 text-[16px] font-medium rounded-lg px-3 py-2"
            >
              See All Transactions
            </Link>
          </div>
        </>
      ):<>
      <div>
        <h2>No Transactions Found..</h2>
        <p>Please start adding your Transactions here:<Link className="bg-amber-100 border border-amber-200 text-amber-500 px-3 py-2 text-sm rounded-md font-medium" href={'/transactions/add'}>Add</Link> </p>
      </div>
      </>}
    </div>
  );
};

export default page;
