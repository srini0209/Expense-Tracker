"use client";
import React, { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { UserContext } from "../Context/UserContext.js";

import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';

const Header = () => {
  const path = usePathname();
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid sticky top-0 border-b-[#e7e6f4] bg-[#f8f8fc] px-10 py-3">
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
  "use client";
  const router = useRouter();
  // const { user, loading, error, clearUser } = useContext(UserContext);
  // console.log("header.js user:", user);
  // console.log("header.js localStorage token", localStorage.getItem("token"));

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
          href="/categories"
        >
          Categories
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
          {/* <Image
            src={"/globe.svg" || user.profileImage}
            width={40}
            height={40}
            alt="Profile Picture"
          /> */}
          <SettingsOutlinedIcon sx={{fontSize:30}}/>
        </Link>
        <p
          className="bg-red-100/50 border-red-300 border text-red-500 text-sm px-3 py-2 rounded-lg cursor-pointer"
          onClick={() => {clearUser();
            router.push('/login');
          }}
        >
          Logout
        </p>
      </div>
    </div>
  );
};
