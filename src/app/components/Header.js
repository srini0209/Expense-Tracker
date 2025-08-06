"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const Header = () => {
  const path = usePathname();
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7e6f4] bg-[#f8f8fc] px-10 py-3">
      <div className="flex items-center gap-4 text-[#0d0c1d]">
        <div className="size-4">
          <Image src={"/window.svg"} alt="Logo Image" width={40} height={40} />
        </div>
        <h2 className="text-[#0d0c1d] text-lg font-bold leading-tight tracking-[-0.015em]">
          FinTrack
        </h2>
      </div>
      {["/", "/login", "/register"].includes(path) ? (
        <div className="flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9">
            <Link
              className="text-[#0d0c1d] text-sm font-medium leading-normal"
              href="#"
            >
              Features
            </Link>
            <Link
              className="text-[#0d0c1d] text-sm font-medium leading-normal"
              href="#"
            >
              Pricing
            </Link>
            <Link
              className="text-[#0d0c1d] text-sm font-medium leading-normal"
              href="#"
            >
              Support
            </Link>
          </div>
          <div className="flex gap-2">
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#3c32ff] text-[#f8f8fc] text-sm font-bold leading-normal tracking-[0.015em]">
              <Link className="truncate" href="/register">
                Sign Up
              </Link>
            </button>
            <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#e7e6f4] text-[#0d0c1d] text-sm font-bold leading-normal tracking-[0.015em]">
              <Link className="truncate" href="/login">
                Log In
              </Link>
            </button>
          </div>
        </div>
      ) : (
        <Navbar />
      )}
    </header>
  );
};

export default React.memo(Header);

const Navbar = () => {
    const router=useRouter();
  return (
    <div className="flex flex-1 justify-end gap-8">
      <div className="flex items-center gap-9">
        <Link
          className="text-[#0d0c1d] text-sm font-medium leading-normal"
          href="/dashboard"
        >
          Dashboard
        </Link>
        <Link
          className="text-[#0d0c1d] text-sm font-medium leading-normal"
          href="/transactions"
        >
          Transactions
        </Link>
        <Link
          className="text-[#0d0c1d] text-sm font-medium leading-normal"
          href="#"
        >
          Budgets
        </Link>
        <Link
          className="text-[#0d0c1d] text-sm font-medium leading-normal"
          href="#"
        >
          <Image
            src={"/globe.svg"}
            width={40}
            height={40}
            alt="Profile Picture"
          />
        </Link>
        <p className="bg-red-100/50 border-red-300 border text-red-500 text-sm px-3 py-2 rounded-lg cursor-pointer" onClick={()=>{localStorage.removeItem("token"); router.push("/login")}}>Logout</p>
      </div>
    </div>
  );
};
