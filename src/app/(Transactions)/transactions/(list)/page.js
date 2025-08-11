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
} from "@mui/material";
import { colors } from "@mui/material";
import moment from "moment";
import { FaEdit } from "react-icons/fa";
import { CircularProgress, LinearProgress } from "@mui/joy";

const page = () => {
  const [txns, setTxns] = useState([]);

  const fetchTransactions = async () => {
    try {
      const response = await axiosInstance.get("/api/transactions");
      if (response.data?.length > 0) {
        setTxns(response.data);
      }
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
  console.log("rows", rows);

  return (
    <TableBody>
      {rows.map((row) => (
        <TableRow
          key={row._id}
          sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
        >
          <TableCell scope="row" align="center">
            {moment(row.date).format("DD-MM-YYYY hh:mm A")}
          </TableCell>
          <TableCell align="center">{row.category}</TableCell>
          <TableCell align="center">{row.description}</TableCell>
          <TableCell
            align="center"
            sx={{
              color:
                row.txnType === "Expense"
                  ? colors.red[500]
                  : colors.green["A400"],
              fontWeight: 500,
            }}
          >
            ₹{row.amount}
          </TableCell>
          <TableCell>
            <Link href={`/transactions/${row._id}`}>
              <FaEdit className="text-blue-500 text-xl" />
            </Link>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default page;

