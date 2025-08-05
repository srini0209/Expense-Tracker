'use client'
import RadioGroup from '../../../components/Inputs/RadioGroup.js'
import Input from '../../../components/Inputs/Input.js'
import Form from 'next/form'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation.js'
import { TextField, Button } from '@mui/material'
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axiosInstance from '../../../../../utils/axiosInstance.js'
import toast from 'react-hot-toast'

const page = () => {

    const [type, setType] = useState("Expense");
    const [amount, setAmount] = useState(Number);
    const [category, setCategory] = useState("");
    const [desc, setDesc] = useState("");
    const [date, setDate] = useState(dayjs());

    const router = useRouter();

    const [error, setError] = useState(null);

    const handleDateChange = (newValue) => {
        setDate(newValue.toISOString());
        console.log(newValue);
        console.log('Selected Date:', newValue ? newValue.toISOString() : null);
        console.log(date.format('DD-MM-YYYY hh:mm A'));

    };

    const submiHandler = async (e) => {
        e.preventDefault();

        // Validate whether all Inputs entered
        if (!amount) {
            setError("Please enter the Amount");
            return;
        }
        if (!category) {
            setError("Please enter the Category");
            return;
        }
        setError("");

        try {
            const response = await axiosInstance.post("/api/transactions", {
                txnType: type,
                amount: amount,
                category: category,
                description: desc,
                date: date
            })
            toast.success("Transaction Saved!");
            router.push("/transactions");

        } catch (error) {
            console.log("error", error);
        }
    }
    return (
        <div className='w-[60%] mx-auto my-20'>
            <h1 className='text-4xl text-black font-bold mb-10'>Add Transaction</h1>

            <Form onSubmit={submiHandler} className='md:w-[60%] w-full'>
                <RadioGroup title={"Transaction Type"} value={type} onChange={(e) => setType(e.target.value)} values={['Expense', 'Income']} />
                <Input label={"Amount"}
                    type={"Number"}
                    placeholder={"Enter Amount"}
                    prefix={"$"}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                />
                <Input label={"Category"}
                    type={"text"}
                    placeholder={"Enter Category"}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
                <Input label={"Description"}
                    type={"text"}
                    placeholder={"Enter Description"}
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                />
                <div className='flex flex-col'>

                    <label htmlFor='dateTimePicker' className='text-slate-800 text-[13px] my-3'>Date</label>
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
                </div>
                <button type='submit' className='bg-blue-500 text-white rounded py-2 px-3 mt-3 cursor-pointer'>Submit</button>
            </Form>
        </div>
    )
}

export default page