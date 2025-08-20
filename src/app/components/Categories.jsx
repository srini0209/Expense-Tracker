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
import { FaEdit } from "react-icons/fa";

const Categories = () => {
  const [categories, setCategories] = useState([]);
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
              <TableCell sx={theadStyles} align="center">
                View/Edit
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell align="center">{row.type}</TableCell>
                <TableCell align="center">{row.name}</TableCell>

                <TableCell align="center">
                  <Link href={`/categories/${row._id}`}>
                    <FaEdit className="text-blue-500 text-xl" />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Categories;
