"use client";
import React, { useState } from "react";
import RadioGroup from "./Inputs/RadioGroup.js";
import Input from "./Inputs/Input.js";
import Form from "next/form";
import axiosInstance from "../axiosInstance.js";
import { useRouter } from "next/navigation.js";
import toast from "react-hot-toast";

const CategoriesForm = ({ initialData = {} }) => {
  const [type, setType] = useState(initialData?.type || "Expense");
  const [name, setName] = useState(initialData?.name || "");
  const [error, setError] = useState("");
  const router = useRouter();
  const isEditing = Boolean(initialData?._id);

  const data = { type, name };
  const submitHandler = async (e) => {
    e.preventDefault();

    // Checking whether all inputs are present
    if (!type) {
      setError("Type is required");
      return;
    }
    if (!name) {
      setError("Name is required");
      return;
    }

    try {
      if (isEditing) {
        const res = await axiosInstance.put(
          `/api/categories/${initialData?._id}`,
          data
        );

        console.log("Category updated Successfully- updated Category:", res);
        toast.success("Category Updated")
      } else {
        const res = await axiosInstance.post(`/api/categories/`, data);
        console.log("Category Created Successfully- Created Category:", res);
        toast.success("Category Created")
      }
    } catch (error) {
      console.log("error on Editing or creating Category:", error.message);
      
    } finally {
      router.push("/categories");
    }
  };
  return (
    <Form onSubmit={submitHandler} className="md:w-[60%] w-full">
      <RadioGroup
        title={"Transaction Type"}
        value={type}
        onChange={(e) => setType(e.target.value)}
        values={["Expense", "Income"]}
      />
      <Input
        label={"Name"}
        type={"text"}
        placeholder={"Enter Category Name"}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {error && (
        <p className="text-red-500 font-medium text-[13px] pb-3">{error}</p>
      )}
      <button
        type="submit"
        className="bg-blue-500 text-white rounded py-2 px-3 mt-3 cursor-pointer"
      >
        {isEditing ? "Update" : "Save"}
      </button>
    </Form>
  );
};

export default CategoriesForm;
