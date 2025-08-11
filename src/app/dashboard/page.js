"use client";
import React, { useContext, useState } from "react";
import { UserContext } from "../Context/UserContext";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import dayjs from "dayjs";

const page = () => {
  const { user, loading, error } = useContext(UserContext);
  const [date, setDate] = useState(dayjs());
  const handleDateChange = (newValue) => {
    setDate(newValue.toISOString());
    console.log(newValue);
    console.log("Selected Date:", newValue ? newValue.toISOString() : null);
    console.log(date.format("DD-MM-YYYY hh:mm A"));
  };
  const dayjsValue = dayjs();

  return (
    <div className="text-black text-center text-2xl my-5">
      <p className="text-slate-800 text-[13px]">{JSON.stringify(user)}</p>
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
      <p className="text-black">{dayjsValue.toISOString()}</p>
    </div>
  );
};

export default page;
