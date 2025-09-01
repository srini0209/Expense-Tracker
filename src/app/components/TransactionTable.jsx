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
  useTheme,
  useMediaQuery,
} from "@mui/material";
import moment from "moment";
import { FaEdit } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";

const TransactionTable = ({ rows, theadStyles, txnsLen }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const router = useRouter();
  const TCellStyles = { fontSize: 14, fontWeight: 400 };
  return (
    // <TableContainer component={Paper} >
      <Table
        sx={{
          minWidth: { sm: 650 },
          width: { xs: '90%' },
          marginRight:'auto',
          marginLeft:'auto',
          minHeight: 200,
         
          borderRadius: '20px',
          borderColor: "#eff6ff",
        }}
        className="bg-[#f5f5f5] mx-auto md:min-w-[650px] w-[90%] shadow-lg rounded-lg"
        aria-label="Transactions table"
      >
        <TableHead className="rounded-lg">
          <TableRow className="bg-violet-100 border rounded-tr-lg rounded-tl-lg border-violet-200">
            <TableCell sx={theadStyles} align="center">
              Date
            </TableCell>
            <TableCell
              sx={{ ...theadStyles, display: { xs: "none", sm: "block" } }}
              align="center"
            >
              Category
            </TableCell>
            <TableCell sx={theadStyles} align="center">
              Description
            </TableCell>
            <TableCell sx={theadStyles} align="center">
              Amount(₹)
            </TableCell>
            {/* <TableCell sx={theadStyles} align="left">
              <FaRegEdit />
            </TableCell> */}
          </TableRow>
        </TableHead>
        <TableBody>
          {txnsLen > 0 ? (
            rows.map((row) => (
              <TableRow
                key={row._id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  cursor: "pointer",
                  ":hover": { backgroundColor: "#f1f1f1" },
                }}
                onClick={() => {
                  router.push(`/transactions/${row._id}`);
                }}
              >
                <TableCell scope="row" align="center" sx={TCellStyles}>
                  {moment(row.date).format("DD-MM-YYYY hh:mm A")}
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ ...TCellStyles, display: { xs: "none", sm: "block" } }}
                >
                  {row.category}
                </TableCell>
                <TableCell align="center" sx={TCellStyles}>
                  {row.description}
                  {isMobile ? (
                    <p className="text-[10px] text-slate-800">
                      Category:
                      <span className="text-xs text-gray-900">
                        {row.category}
                      </span>
                    </p>
                  ) : (
                    ""
                  )}
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
                {/* <TableCell>
                <Link href={`/transactions/${row._id}`}>
                  <FaRegEdit className="text-blue-500 text-lg" />
                </Link>
              </TableCell> */}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4}>
                <p className="text-sm font-medium text-center text-purple-500">
                  No Records Found..
                </p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    // </TableContainer>
  );
};

export default TransactionTable;
