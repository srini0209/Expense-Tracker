'use client'
import React, { useState } from 'react'
import LoginSigupTab from '../../components/LoginSigupTab';
import Form from 'next/form';
import Link from 'next/link';
import { validateEmail } from '../../../../utils/helper';
import Input from '../../components/Inputs/Input.js';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import axiosInstance from '../../axiosInstance.js';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const router = useRouter();

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
            const response = await axiosInstance.post("/api/auth/login", { email: email, password: password });
            console.log("Login/Page.js  /api/login response:",response);
            
            const { token } = response.data;
            console.log("Login/Page.js  /api/login response-token", token);
            
            if (token) {
                localStorage.setItem("token", token);
            }
            console.log('Login/Page.js LocalStorage Token:',localStorage.getItem(token))

            router.push("/dashboard");
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
                <div className="pb-3">
                    <LoginSigupTab />
                </div>
                <Form onSubmit={handleSubmit}>

                    <div className="flex flex-col md:w-[50%] w-full gap-4">
                        <Input id='login-email'
                            type='text'
                            label={"Email"}
                            placeholder="Enter your email"
                            className="form-Input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d0c1d] focus:outline-0 focus:ring-0 border-none bg-[#e7e6f4] focus:border-none h-14 placeholder:text-[#4945a1] p-4 text-base font-normal leading-normal"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />



                        <Input id='login-password'
                            type={"password"}
                            label={"Password"}
                            placeholder="Enter your password"
                            className="form-Input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#0d0c1d] focus:outline-0 focus:ring-0 border-none bg-[#e7e6f4] focus:border-none h-14 placeholder:text-[#4945a1] p-4 text-base font-normal leading-normal"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                    </div>

                    {error &&
                        <p className='text-red-500 font-medium text-[13px] pb-3'>{error}</p>
                    }
                    <button
                        className="md:w-[50%] w-full cursor-pointer items-center justify-center rounded-xl h-10 my-3  bg-[#3c32ff] text-[#f8f8fc] text-[13px] font-bold"
                        type='submit'
                    >
                        Login
                    </button>
                </Form>
                <p className="text-[#3c32ff] text-sm font-normal leading-normal pb-3 my-3 text-start underline">Don't have an account? <Link href='/register'>Sign up
                </Link></p>
            </div>
        </div>
    )
}

export default Login