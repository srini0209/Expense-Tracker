"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RadioGroup from "../../components/Inputs/RadioGroup.js";
import Input from "../../components/Inputs/Input.js";
import Form from "next/form";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel, Button
} from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axiosInstance from "../../axiosInstance.js";
import toast from "react-hot-toast";
// import { log } from "console";

const TransactionForm = ({ initialData = {} }) => {
  console.log("Txn Form -Initial Data:", initialData);

  const [type, setType] = useState(initialData?.txnType || "Expense");
  const [amount, setAmount] = useState(initialData?.amount || Number);
  const [category, setCategory] = useState(initialData?.category || "");
  const [desc, setDesc] = useState(initialData?.description || "");
  const [date, setDate] = useState(dayjs(initialData?.date) || dayjs());
  const [catOptions, setCatOptions] = useState(initialData?.catOptions || []);
  const isEditing = Boolean(initialData?._id);
  const router = useRouter();
  // console.log("/TXN FOrm isEditing:", isEditing);

  const [error, setError] = useState(null);
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(`/api/categories/type/${type}`);
      console.log("/api/categories/type/[type] response", response.data);
      if (response.data.length > 0) {
        setCatOptions(response.data);
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    fetchCategories();
  }, [type]);
  useEffect(() => {
    if (initialData?.category) {
      setCategory(initialData?.category);
      return;
    }
  }, []);

  const handleDateChange = (newValue) => {
    setDate(newValue);
    console.log(newValue);
    console.log("Selected Date:", newValue ? newValue.toISOString() : null);
    console.log(date.format("DD-MM-YYYY hh:mm A"));
  };

  const data = {
    txnType: type,
    amount: amount,
    category: category,
    description: desc,
    date: date.toISOString(),
  };
  const submitHandler = async (e) => {
    e.preventDefault();
    // Validate whether all Inputs entered
    if (!amount) {
      setError("Please enter the Amount");
      return;
    }
    if (amount <= 0) {
      setError("Amount should be greater than 0");
      return;
    }
    if (!category) {
      setError("Please enter the Category");
      return;
    }
    if (!date) {
      setError("Please select the date");
      return;
    }
    setError("");

    try {
      if (isEditing) {
        const res = await axiosInstance.put(
          `/api/transactions/${initialData?._id}`,
          data
        );

        console.log(
          "Transaction updated Successfully- updated Transaction:",
          res
        );
        toast.success("Transaction Updated");
      } else {
        const res = await axiosInstance.post(`/api/transactions/`, data);
        console.log(
          "Transaction Created Successfully- Created Transaction:",
          res
        );
        toast.success("Transaction Created");
      }
    } catch (error) {
      console.log("error on Editing or creating transaction:", error.message);
    } finally {
      router.push("/transactions");
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axiosInstance.delete(`/api/transactions/${id}`)
      console.log("Deleted successfully -id:", id)
      console.log("Deleted successfully res:", res)
      toast.success("Transaction Deleted")
    } catch (error) {
      console.log("Error deleting txn", error)

    } finally {
      router.push('/transactions')
    }
  }

  return (
    <div className="w-[60%] mx-auto my-20">
      <h1 className="text-4xl text-black font-bold mb-10">Add Transaction</h1>

      <Form onSubmit={submitHandler} className="md:w-[60%] w-full">
        <RadioGroup
          title={"Transaction Type"}
          value={type}
          onChange={(e) => { setType(e.target.value); setCategory("") }}
          values={["Expense", "Income"]}
        />
        <Input
          label={"Amount"}
          type={"Number"}
          placeholder={"Enter Amount"}
          prefix={"$"}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
        />
        {/* <Input
          label={"Category"}
          type={"text"}
          placeholder={"Enter Category"}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        /> */}
        <div className="flex flex-col">
          <label
            htmlFor="category-selector"
            className="text-slate-800 text-[13px] mb-2"
          >
            Category
          </label>
          <FormControl fullWidth>
            {/* <InputLabel id="demo-simple-select-label">Select Category</InputLabel> */}

            <Select
              labelId="category-selector"
              id="category-selector"
              value={category}
              className="w-full md:w-[60%] mb-3"
              placeholder="Select Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              {catOptions.map((catOption, index) => (
                <MenuItem key={catOption._id} value={catOption.name}>
                  {catOption.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <Input
          label={"Description"}
          type={"text"}
          placeholder={"Enter Description"}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <div className="flex flex-col">
          <label
            htmlFor="dateTimePicker"
            className="text-slate-800 text-[13px] my-3"
          >
            Date
          </label>
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
        {error && (
          <p className="text-red-500 font-medium text-[13px] pb-3">{error}</p>
        )}
        <div className="flex justify-end gap-5 items-center mt-3">

          {isEditing ?
            <Button variant="outlined" color="error" onClick={() => handleDelete(initialData._id)}>
              Delete
            </Button> : ""
          }
          <button
            type="submit"
            className="text-blue-500 border border-blue-300 bg-blue-100  rounded py-1.5 px-3 cursor-pointer"
          >
            {isEditing ? "Update" : "Save"}
          </button>
        </div>
      </Form>
    </div >
  );
};
export default TransactionForm;
