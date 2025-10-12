"use client";
import React, { useEffect, useState } from "react";
import LoginSigupTab from "../../components/LoginSigupTab";
import Form from "next/form";
import Link from "next/link";
import { validateEmail } from "../../../utils/helper";
import Input from "../../components/Inputs/Input.js";
import { useRouter } from "next/navigation";
import axios from "axios";
import axiosInstance from "../../axiosInstance.js";
import { CircularProgress } from "@mui/joy";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate Email
    if (!validateEmail(email)) {
      setError("Please enter a valid Email Address!");
      return;
    }
    if (!password) {
      setError("Please enter the Password");
      return;
    }
    setError("");

    // Login API call
    try {
      setLoading(true);
      const response = await axiosInstance.post("/api/auth/login", {
        email: email,
        password: password,
      });
      console.log("Login/Page.js  /api/login response:", response);

      const { token } = response.data;
      console.log("Login/Page.js  /api/login response-token", token);

      if (token) {
        localStorage.setItem("token", token);
        document.cookie = `AuthToken=${token}; path=/; max-age=${7 * 24 * 60 * 60};`;
      }
      console.log(
        "Login/Page.js LocalStorage Token:",
        localStorage.getItem(token)
      );
      router.push("/dashboard");
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again");
      }
      setLoading(false);
    }
  };
  return (
    <>
      <Form onSubmit={handleSubmit}>
        <div className=" w-full gap-4">

          <Input
            id="login-email"
            type="text"
            label={"Email"}
            placeholder="Enter your email"
            className="form-Input flex w-full min-w-0 flex-1 mb-4 resize-none px-3 py-2 overflow-hidden rounded-lg border border-slate-300 text-slate-800 focus:outline-0 focus:ring-0 "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            id="login-password"
            type={"password"}
            label={"Password"}
            placeholder="Enter your password"
            className="form-Input flex w-full min-w-0 flex-1 mb-4 resize-none px-3 py-2 overflow-hidden rounded-lg border border-slate-300 text-slate-800 focus:outline-0 focus:ring-0 "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="flex justify-end w-full">
            <Link href="/forgot-password" className="text-indigo-500 text-sm font-normal leading-normal text-start underline">
              Forgot Password?
            </Link>
          </div>
        </div>

        {error && (
          <p className="text-red-500 font-medium text-[13px] pb-3">{error}</p>
        )}
        <button
          className=" w-full cursor-pointer items-center justify-center rounded-xl h-10 my-3  bg-indigo-500 text-[#f8f8fc] text-[13px] font-bold"
          type="submit"
        >
          Login
        </button>
      </Form>
      <Link href="/register" className="text-indigo-500 text-sm font-normal leading-normal  mt-3 text-start underline">
        Don&apos;t have an account? Sign up</Link>
      {loading &&
       <div className="flex justify-center items-center h-screen w-screen fixed inset-0 z-100">
        <CircularProgress size="lg" variant="soft" color="neutral" value={60} />
      </div>}
    </>
  );
};

export default Login;
