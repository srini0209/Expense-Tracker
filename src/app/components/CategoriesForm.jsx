"use client";
import React, { useState } from "react";
import RadioGroup from "./Inputs/RadioGroup.js";
import Input from "./Inputs/Input.js";
import Form from "next/form";
import { Button } from "@mui/material";
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
        toast.success("Category Updated");
      } else {
        const res = await axiosInstance.post(`/api/categories/`, data);
        console.log("Category Created Successfully- Created Category:", res);
        toast.success("Category Created");
      }
    } catch (error) {
      console.log("error on Editing or creating Category:", error.message);
    } finally {
      router.push("/categories");
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.delete(`/api/categories/${id}`);
      console.log("Deleted successfully -id:", id);
      console.log("Deleted successfully res:", res);
      toast.success("Category Deleted");
    } catch (error) {
      console.log("Error deleting Category", error);
    } finally {
      router.push("/categories");
    }
  };
  return (
    <Form className="md:w-[60%] w-full">
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
      <div className="flex justify-end gap-5 items-center mt-3">
        {isEditing ? (
          <p
            className="bg-error-500 hover:bg-error-600 text-white px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-colors duration-200"
            onClick={(e) => handleDelete(initialData._id, e)}
          >
            Delete
          </p>
        ) : (
          ""
        )}
        <p
          onClick={submitHandler}
          className="text-blue-500 border hover:bg-blue-200 border-blue-300 bg-blue-100 text-sm font-medium  rounded-md px-4 py-2 cursor-pointer transition-colors duration-200"
        >
          {isEditing ? "Update" : "Save"}
        </p>
      </div>
    </Form>
  );
};

export default CategoriesForm;
