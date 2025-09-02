"use client";
import React, { useContext } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { UserContext } from "../Context/UserContext.js";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";

import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

const Header = () => {
  const path = usePathname();
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid sticky top-0 bg-[#303f9f] px-10 py-5">
      <div className=" text-[#0d0c1d]">
        <Link href={"/dashboard"} className="flex items-center gap-2">
          <CurrencyRupeeOutlinedIcon className="text-white" />

          <h2 className="text-white text-2xl font-bold leading-tight tracking-[-0.015em]">
            FinTrack
          </h2>
        </Link>
      </div>
      {["/", "/login", "/register"].includes(path) ? (
        <div className="flex flex-1 justify-end gap-8">
          <div className="flex items-center gap-9">
            <Link
              className="text-white text-sm font-medium leading-normal"
              href="#"
            >
              Features
            </Link>
            <Link
              className="text-white text-sm font-medium leading-normal"
              href="#"
            >
              Pricing
            </Link>
            <Link
              className="text-white text-sm font-medium leading-normal"
              href="#"
            >
              Support
            </Link>
          </div>
          <div className="flex gap-2">
            <Link
              className="bg-secondary-500 hover:bg-secondary-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 truncate"
              href="/register"
            >
              Sign Up
            </Link>

            <Link
              className="border-2 border-white/40 text-white hover:bg-white/10 hover:border-white/60 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200"
              href="/login"
            >
              Log In
            </Link>
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
  const path = usePathname();

  // const { user, loading, error, clearUser } = useContext(UserContext);
  // console.log("header.js user:", user);
  // console.log("header.js localStorage token", localStorage.getItem("token"));

  return (
    <div className="flex flex-1 justify-end gap-8">
      <div className="flex items-center gap-9">
        <MenuLinks path={path} />
        {/* <Image
            src={"/globe.svg" || user.profileImage}
            width={40}
            height={40}
            alt="Profile Picture"
          /> */}<Link
          className="text-white text-sm font-medium leading-normal"
          href="#"
        >
          <SettingsOutlinedIcon sx={{ fontSize: 30 }} />
        </Link>
        <p
          className="bg-error-500 hover:bg-error-600 text-white px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-colors duration-200"
          onClick={() => {
            // clearUser();
            localStorage.removeItem("token");
            document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
            router.push("/login");
          }}
        >
          Logout
        </p>
      </div>
    </div>
  );
};

const MenuLinks = ({ path }) => {

  return (
    <>
      <Link
        className={` ${path == "/dashboard" ? "text-[#4caf50]" : "text-white"
          } text-[0.875rem] font-medium leading-normal`}
        href="/dashboard"
      >
        Dashboard
      </Link>
      <Link
        className={`   text-[0.875rem] font-medium leading-normal ${path == "/transactions" ? "text-[#4caf50]" : "text-white"
          }`}
        href="/transactions"
      >
        Transactions
      </Link>
      <Link
        className={`${path == "/categories" ? "text-[#4caf50]" : "text-white"
          } text-[0.875rem] font-medium leading-normal`}
        href="/categories"
      >
        Categories
      </Link>
      <Link
        className="text-white text-[0.875rem] font-medium leading-normal"
        href="/budgets"
      >
        Budgets
      </Link>
    </>
  )
}
