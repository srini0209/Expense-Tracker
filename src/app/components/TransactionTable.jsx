"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  colors,
} from "@mui/material";
import moment from "moment";
import { FaEdit } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TransactionTable = ({ rows, theadStyles }) => {
  const router = useRouter();
  const TCellStyles = { fontSize: 14, fontWeight: 400 };
  return (
    <TableContainer component={Paper}>
      <Table
        sx={{
          minWidth: 650,
          minHeight: 200,
          borderWidth: 1,
          borderRadius: 20,
          borderColor: "#eff6ff",
        }}
        aria-label="Transactions table"
      >
        <TableHead>
          <TableRow className="bg-violet-100 border border-violet-200">
            <TableCell sx={theadStyles} align="center">
              Date
            </TableCell>
            <TableCell sx={theadStyles} align="center">
              Category
            </TableCell>
            <TableCell sx={theadStyles} align="center">
              Description
            </TableCell>
            <TableCell sx={theadStyles} align="center">
              Amount(₹)
            </TableCell>
            <TableCell sx={theadStyles} align="left">
              <FaRegEdit />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row._id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              onClick={() => {
                router.push(`/transactions/${row._id}`);
              }}
            >
              <TableCell scope="row" align="center" sx={TCellStyles}>
                {moment(row.date).format("DD-MM-YYYY hh:mm A")}
              </TableCell>
              <TableCell align="center" sx={TCellStyles}>
                {row.category}
              </TableCell>
              <TableCell align="center" sx={TCellStyles}>
                {row.description}
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  ...TCellStyles,
                  color:
                    row.txnType === "Expense"
                      ? colors.red[500]
                      : colors.green["A400"],
                }}
              >
                ₹{row.amount}
              </TableCell>
              <TableCell>
                <Link href={`/transactions/${row._id}`}>
                  <FaRegEdit className="text-blue-500 text-lg" />
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransactionTable;
