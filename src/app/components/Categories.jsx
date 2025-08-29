"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
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
import Link from "next/link";
import { useRouter } from "next/navigation";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const router = useRouter();
  const fetchCategories = async () => {
    try {
      const cat = await axiosInstance.get("/api/categories");
      if (cat.data?.length > 0) {
        setCategories(cat.data);
      }
      // console.log(response.data);
    } catch (error) {
      console.error("error", error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);

  const createData = (_id, type, name) => ({ _id, type, name });

  const rows = categories.map((cat) => createData(cat._id, cat.type, cat.name));
  const theadStyles = {
    color: colors.deepPurple[700],
    fontWeight: 600,
    fontSize: 16,
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-slate-800 text-2xl font-bold">Categories</h2>
        <Link
          href={"/categories/add"}
          className="px-3 py-2 bg-amber-100/50 border border-amber-300 text-amber-600 rounded"
        >
          Add Category
        </Link>
      </div>
      <TableContainer component={Paper} className="mb-5">
        <Table sx={{ minWidth: 650 }} aria-label="Transactions table">
          <TableHead>
            <TableRow>
              <TableCell sx={theadStyles} align="center">
                Category Type
              </TableCell>
              <TableCell sx={theadStyles} align="center">
                Category Name
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row._id}
                onClick={() => {
                  router.push(`/categories/${row._id}`);
                }}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  cursor: "pointer",
                }}
              >
                <TableCell align="center">{row.type}</TableCell>
                <TableCell align="center">{row.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="flex flex-row">
        <div className="w-[50%] justify-center items-center">
          <h2 className="text-2xl font-medium text-center text-green-500 mb-3">
            Income
          </h2>
          <div className="flex flex-col gap-2 w-[120px] mx-auto">
            {rows
              .filter((row) => row.type === "Income")
              .map((row) => (
                <Link
                  href={`/categories/${row._id}`}
                  key={row._id}
                  className="font-medium w-full text-center border border-green-200 bg-green-100 text-green-500 px-3 py-2 rounded-lg cursor-pointer mx-auto"
                >
                  {row.name}
                </Link>
              ))}
          </div>
        </div>
        <div className="w-[50%] justify-center text-center items-center">
          <h2 className="text-2xl font-medium text-orange-500 mb-3">Expense</h2>
          <div className="flex flex-col gap-2 w-[120px] mx-auto">
            {rows
              .filter((row) => row.type === "Expense")
              .map((row) => (
                <Link
                  href={`/categories/${row._id}`}
                  key={row._id}
                  className="font-medium w-full text-center border border-orange-200 bg-orange-100 text-orange-500 px-3 py-2 rounded-lg cursor-pointer mx-auto"
                >
                  {row.name}
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
