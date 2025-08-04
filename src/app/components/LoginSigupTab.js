import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
const LoginSigupTab = () => {

    const path = usePathname();
    return (
        <div className="flex border-b border-[#cecdea] px-4 gap-8 login-signup-tab">
            <Link className={`${path === "/register" ? "active" : ""} flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#4945a1]  pb-[13px] pt-4`} href="/register">
                <p className=" text-sm font-bold leading-normal tracking-[0.015em]">Sign Up</p>
            </Link>
            <Link className={`${path === "/login" ? "active" : ""} flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#4945a1] pb-[13px] pt-4`} href="/login">
                <p className="text-sm font-bold leading-normal tracking-[0.015em]">Log In</p>
            </Link>
        </div>
    )
}

export default LoginSigupTab