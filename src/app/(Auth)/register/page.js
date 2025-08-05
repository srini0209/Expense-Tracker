'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Form from 'next/form';
import LoginSigupTab from '../../components/LoginSigupTab.js';
import { validateEmail } from '../../../../utils/helper.js';
import axios from 'axios';
import { TextField } from '@mui/material';
import Input from '../../components/Inputs/Input.js';
import axiosInstance from '../../../../utils/axiosInstance.js';

const page = () => {

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState(null);


    const handleSubmit = async (e) => {
        e.preventDefault();
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
        if(password!==confirmPassword){
            setError("Password did not match");
            return
        }
        setError("");

        // API calls to Register

        try {
            const response = await axiosInstance.post('/api/auth/register', {
                name: name,
                email: email,
                password: password
            });

           
        } catch (error) {
            if (error.response && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Something went wrong. Please try again");
            }
        }
    }
    return (
        <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
                <div className="pb-3 mb-5">
                    <LoginSigupTab />
                </div>
                <Form onSubmit={handleSubmit}>
                    {/* <TextField
                        required
                        type='text'
                        id='outlined-required'
                        label="Name"
                        placeholder='Your Name'
                    /> */}
                    <div className="flex flex-col md:w-[50%] w-full gap-4">

                        <Input
                            placeholder="Enter your name"
                            type='text'
                            label={"Name"}
                            className="form-Input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d0c1d] focus:outline-0 focus:ring-0 border-none bg-[#e7e6f4] focus:border-none h-14 placeholder:text-[#3c32ff] p-4 text-base font-normal leading-normal"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            type='text'
                            label={"Email"}
                            placeholder="Enter your email"
                            className="form-Input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d0c1d] focus:outline-0 focus:ring-0 border-none bg-[#e7e6f4] focus:border-none h-14 placeholder:text-[#3c32ff] p-4 text-base font-normal leading-normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            type='password'
                            label={"Password"}
                            placeholder="Enter your password"
                            className="form-Input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d0c1d] focus:outline-0 focus:ring-0 border-none bg-[#e7e6f4] focus:border-none h-14 placeholder:text-[#3c32ff] p-4 text-base font-normal leading-normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Input
                            type='password'
                            label={"Confirm Password"}
                            placeholder="Confirm your password"
                            className="form-Input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d0c1d] focus:outline-0 focus:ring-0 border-none bg-[#e7e6f4] focus:border-none h-14 placeholder:text-[#3c32ff] p-4 text-base font-normal leading-normal"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    {error &&
                        <p className='text-red-500 font-medium text-[13px] pb-3'>{error}</p>
                    }
                    <button
                        className="md:w-[50%] w-full cursor-pointer items-center justify-center rounded-xl h-10 my-3  bg-[#3c32ff] text-[#f8f8fc] text-[13px] font-bold"
                        type='submit'
                    >
                        Sign Up
                    </button>

                </Form>
                <p className="text-[#3c32ff] text-sm font-normal leading-normal pb-3 my-3 text-start underline">Already have an account? <Link href='/login'>Log In
                </Link></p>
            </div>
        </div>
    )
}

export default page