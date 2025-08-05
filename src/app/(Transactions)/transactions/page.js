'use client'
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../../../utils/axiosInstance.js';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { colors } from '@mui/material';
import moment from 'moment';

const page = () => {
    const [txns, setTxns] = useState([]);

    const fetchTransactions = async () => {
        try {
            const response = await axiosInstance.get('/api/transactions');
            if (response.data?.length > 0) {
                setTxns(response.data);
            }
            // console.log(response.data);

        }
        catch (error) {
            console.error("error", error);

        }
    }
    useEffect(() => {
        console.log("Transactions Page mounted ");

        fetchTransactions();

    }, []);

    function createData(_id, date, category, description, amount, txnType) {
        return { _id, date, category, description, amount, txnType };
    }

    const rows = txns.map((txn) => createData(txn._id, txn.date, txn.category, txn.description, txn.amount, txn.txnType))
    console.log("rows", rows);

    const theadStyles={ color: colors.deepPurple[700], fontWeight:600, fontSize: 16 };

    return (
        <div className='w-[60%] mx-auto my-20'>
            <div className='flex flex-row text-black justify-between mb-4'>
                <h2 className='text-4xl font-bold '>Transactions</h2>
                <Link href={"/transactions/add"} className='bg-slate-50 border-slate-400 px-4 py-2 items-center rounded-lg font-medium text-[#3c32ff] ' >
                    Add Transaction
                </Link>
            </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="Transactions table">
                    <TableHead>
                        <TableRow >
                            <TableCell sx={theadStyles} align='center'>Date</TableCell>
                            <TableCell sx={theadStyles} align="center">Category</TableCell>
                            <TableCell sx={theadStyles} align="center">Description</TableCell>
                            <TableCell sx={theadStyles} align="center">Amount(₹)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row) => (
                            <TableRow
                                key={row._id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row" align='center'>
                                    {moment(row.date).format("DD-MM-YYYY hh:mm A")}
                                </TableCell>
                                <TableCell align="center">{row.category}</TableCell>
                                <TableCell align="center">{row.description}</TableCell>
                                <TableCell align="center" sx={{color:row.txnType==='Expense'?colors.red[500]:colors.green['A400'], fontWeight:500}}>{row.txnType==='Expense'?'-':'+'} ₹{row.amount}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default page;