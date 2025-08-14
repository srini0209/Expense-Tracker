import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper, colors
} from "@mui/material";
import moment from "moment";
import { FaEdit } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import Link from "next/link";

const TransactionTable = ({rows,theadStyles}) => {
  return (
    <TableContainer component={Paper}>
      <Table
        sx={{
          minWidth: 650,
          minHeight: 200,
          borderWidth: 1,
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
            >
              <TableCell scope="row" align="center" sx={{fontSize:15,fontWeight:400}}>
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
