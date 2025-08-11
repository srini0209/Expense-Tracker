import React, { Suspense } from "react";
import Link from "next/link";
import {
  TableContainer,
  TableCell,
  TableHead,
  TableRow,
  Table,
  colors,
  Paper,
  CircularProgress,
} from "@mui/material";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";

const layout = ({ children }) => {
  const theadStyles = {
    color: '#7008e7' ,
    fontWeight: 600,
    fontSize: 16,
  };
  return (
    <div className="w-[60%] mx-auto my-20">
      <div className="flex flex-row text-black items-center justify-between mb-4">
        <h2 className="text-4xl font-bold ">Transactions</h2>
        <Link
          href={"/transactions/add"}
          className="bg-blue-50 border-blue-200 border px-4 py-2 items-center rounded-lg font-medium text-blue-600 "
        >
          Add Transaction
        </Link>
      </div>
      <TableContainer component={Paper}>
        <Table
          sx={{ minWidth: 650, minHeight: 200, borderWidth:1, borderColor:'#eff6ff' }}
          aria-label="Transactions table"
        >
          <TableHead>
            <TableRow className="bg-violet-100 border border-violet-200">
              <TableCell sx={theadStyles}  align="center">
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
              <TableCell sx={theadStyles } align="left">
                 <FaRegEdit />
              </TableCell>
            </TableRow>
          </TableHead>
          <Suspense fallback={<CircularProgress />}>{children}</Suspense>
        </Table>
      </TableContainer>
    </div>
  );
};

export default layout;
