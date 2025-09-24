'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogIn, UserPlus } from 'lucide-react'
const LoginSigupTab = () => {

    const path = usePathname();
    // return (
    //     <div className="justify-center items-center w-full p-2 mb-5 gap-8 login-signup-tab rounded-full bg-white shadow-md">
    //         <div className='flex  rounded-full w-full justify-around'>

    //             <Link className={`${path === "/register" ? "active text-indigo-500 bg-indigo-50" : "text-slate-700"} flex gap-2 w-full items-center justify-center rounded-full font-medium leading-normal  pb-[13px] pt-4 transition-all duration-100 ease-in`} href="/register">
    //                 <UserPlus /><span> Sign Up
    //                 </span>
    //             </Link>
    //             <Link className={`${path === "/login" ? "active text-indigo-500 bg-indigo-50" : "text-slate-700"} flex gap-2 w-full items-center justify-center rounded-full font-medium leading-normal  pb-[13px] pt-4 transition-colors duration-100 ease-in`} href="/login">
    //                 <LogIn /><span> Login
    //                 </span>
    //             </Link></div>
    //     </div>
    // )
    // return (
    //     <div className="relative justify-center items-center w-full p-2 mb-5 gap-8 login-signup-tab rounded-full bg-white shadow-md">
    //         <div className='flex rounded-full w-full justify-around'>
    //             <div
    //                 className={`absolute bottom-0 h-full w-1/2 bg-indigo-50 rounded-full transition-all duration-300 ease-in-out`}
    //                 style={{ transform: `translateX(${path === "/register" ? '0%' : '100%'})` }}
    //             ></div>
    //             <Link className={`${path === "/register" ? "text-indigo-500" : "text-slate-700"} relative z-10 flex gap-2 w-full items-center justify-center rounded-full font-medium leading-normal pb-[13px] pt-4 transition-all duration-100 ease-in`} href="/register">
    //                 <UserPlus /><span>Sign Up</span>
    //             </Link>
    //             <Link className={`${path === "/login" ? "text-indigo-500" : "text-slate-700"} relative z-10 flex gap-2 w-full items-center justify-center rounded-full font-medium leading-normal pb-[13px] pt-4 transition-colors duration-100 ease-in`} href="/login">
    //                 <LogIn /><span>Login</span>
    //             </Link>
    //         </div>
    //     </div>
    // )
    return (
        <div className="relative w-full p-2 mb-5 login-signup-tab items-center rounded-full bg-white shadow-md">

            {/* The Slider Element */}
            <div
                className={`absolute h-[calc(100%-16px)] rounded-full bg-indigo-50 transition-all duration-300 ease-in-out`}
                style={{
                    width: 'calc(50% - 16px)',
                    top: '8px',
                    left: path === "/register" ? '8px' : 'calc(50% + 8px)'
                }}
            ></div>

            {/* The Links Container */}
            <div className='flex relative z-10 w-full rounded-full'>
                <Link
                    className={`${path === "/register" ? "text-indigo-500" : "text-slate-700"} flex gap-2 w-1/2 items-center justify-center rounded-full font-medium leading-normal pb-[13px] pt-4 transition-all duration-100 ease-in`}
                    href="/register"
                >
                    <UserPlus />
                    <span>Sign Up</span>
                </Link>

                <Link
                    className={`${path === "/login" ? "text-indigo-500" : "text-slate-700"} flex gap-2 w-1/2 items-center justify-center rounded-full font-medium leading-normal pb-[13px] pt-4 transition-colors duration-100 ease-in`}
                    href="/login"
                >
                    <LogIn />
                    <span>Login</span>
                </Link>
            </div>
        </div>
    );
}

export default LoginSigupTab