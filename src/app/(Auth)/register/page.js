"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Form from "next/form";
import LoginSigupTab from "../../components/LoginSigupTab.js";
import { validateEmail } from "../../../../utils/helper.js";
import Input from "../../components/Inputs/Input.js";
import axiosInstance from "../../axiosInstance.js";
import { useRouter } from "next/navigation.js";
import { CircularProgress } from "@mui/joy";
// import ProfilePhotoSelector from "../../components/_ProfileImageSelector.js/index.js";

const Page = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, [router]);

  // Registeration Handler
  const handleRegistration = async (e) => {
    e.preventDefault();

    // let profileImageURL = "";
    // Validate email
    if (!validateEmail(email)) {
      setError("Please enter a valid Email Address!");
      return;
    }

    // Validate whether all Inputs entered
    if (!name) {
      setError("Please enter the Name");
      return;
    }
    if (!password) {
      setError("Please enter the Password");
      return;
    }
    if (!confirmPassword) {
      setError("Please fill the Confirm Password");
      return;
    }
    if (password !== confirmPassword) {
      setError("Password did not match");
      return;
    }
    setError("");

    // API calls to Register

    try {
      setLoading(true);

      const response = await axiosInstance.post("/api/auth/register", {
        name: name,
        email: email,
        password: password,

      });
      router.push("/login");
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
      <Form onSubmit={handleRegistration}>
        {/* <TextField
                        required
                        type='text'
                        id='outlined-required'
                        label="Name"
                        placeholder='Your Name'
                    /> */}
        <div className="flex flex-col w-full gap-2">
          {/*<ProfilePhotoSelector image={profileImage} setImage={setProfileImage} />*/}
          <Input
            placeholder="Enter your name"
            type="text"
            label={"Name"}
            className="form-Input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d0c1d] focus:outline-0 focus:ring-0 border-none bg-[#e7e6f4] focus:border-none h-14 placeholder:text-[#3c32ff] p-4 text-base font-normal leading-normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            type="text"
            label={"Email"}
            placeholder="Enter your email"
            className="form-Input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d0c1d] focus:outline-0 focus:ring-0 border-none bg-[#e7e6f4] focus:border-none h-14 placeholder:text-[#3c32ff] p-4 text-base font-normal leading-normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            label={"Password"}
            placeholder="Enter your password"
            className="form-Input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d0c1d] focus:outline-0 focus:ring-0 border-none bg-[#e7e6f4] focus:border-none h-14 placeholder:text-[#3c32ff] p-4 text-base font-normal leading-normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="password"
            label={"Confirm Password"}
            placeholder="Confirm your password"
            className="form-Input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d0c1d] focus:outline-0 focus:ring-0 border-none bg-[#e7e6f4] focus:border-none h-14 placeholder:text-[#3c32ff] p-4 text-base font-normal leading-normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        {error && (
          <p className="text-red-500 font-medium text-[13px] pb-3">{error}</p>
        )}
        <button
          className=" w-full cursor-pointer items-center justify-center rounded-lg h-10 my-3  bg-indigo-500 text-[#f8f8fc] text-[13px] font-bold"
          type="submit"
        >
          Sign Up
        </button>
      </Form>
      <Link href="/login" className="text-indigo-500 text-sm font-normal leading-normal  mt-3 text-start underline">
        Already have an account? Log In</Link>
      {loading && <div>
        <CircularProgress size="lg" variant="soft" color="neutral" value={60} />
      </div>}
    </>
  );
}

export default Page;
