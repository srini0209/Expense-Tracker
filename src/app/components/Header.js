"use client";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { UserContext } from "../Context/UserContext.js";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";

import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { LogOut, Menu, User, X } from "lucide-react";
import { Modal, Tooltip, useMediaQuery } from "@mui/material";
// import Modal from "./Modal.jsx";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const path = usePathname();
  return (<>
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
        <Navbar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      )}
    </header>
    {isMobileMenuOpen && <MobileMenu path={path} isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />}
  </>
  );
};

export default Header;

const Navbar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  "use client";
  const router = useRouter();
  const path = usePathname();
  const { user } = useContext(UserContext)

  const [isModalOpen, setIsModalOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width: 845px)");
  useEffect(() => {
    if (!isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile, setIsMobileMenuOpen]);

  // Action to Logout button
  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "AuthToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
    router.push("/login");
  }


  // const { user, loading, error, clearUser } = useContext(UserContext);
  // console.log("header.js user:", user);
  // console.log("header.js localStorage token", localStorage.getItem("token"));

  return (
    <div className="flex flex-1 justify-end gap-8">
      <div className="flex items-center gap-9">
        {!isMobile ?
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
{/* UnComment when Implementing user page */}
              {/* <button className="cursor-pointer bg-gray-100/20 rounded-full p-2"
                onClick={() => setIsModalOpen(true)}
              >
                <User />
              </button> */}

            </Link>
            <p
              className="bg-error-500 hover:bg-error-600 text-white px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-colors duration-200"
              onClick={handleLogout}
            >
              Logout
            </p>

          </div>
          :
          (<>
            <Menu onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white cursor-pointer" />

            <Tooltip title="Logout" >
              <LogOut className="text-white cursor-pointer" onClick={handleLogout} />
            </Tooltip>
          </>
          )}
      </div>


      <Modal
        open={isModalOpen}
        title={`User Profile`}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="fixed inset-0 flex items-center justify-center  " onClick={() => setIsModalOpen(false)}>


          <div className="flex flex-col gap-4 bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl" onClick={(e) => { e.stopPropagation() }}>
            <div className="flex justify-between items-center mb-2">

              <h2 className="font-semibold text-2xl text-indigo-600"> User Profile</h2>
              <button className="text-gray-500 cursor-pointer" onClick={() => setIsModalOpen(false)}>

                <X />
              </button>
            </div>
            <input type="text"
              className="bg-gray-50 border border-gray-200 rounded-lg text-[14px] cursor-not-allowed text-slate-800 px-3 py-2"
              placeholder="Email" value={user.email} disabled />
            <input
              type="text"
              className="bg-gray-50 border border-gray-200 rounded-lg text-[14px] text-slate-800  px-3 py-2"
              placeholder="Name"
              value={user.name}
              onChange={(e) => setUsrName(e.target.value)}
            />

            <input
              type="Password"
              placeholder="Password"


            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

const MobileMenu = ({ path, isMobileMenuOpen, setIsMobileMenuOpen }) => {

  return (
    // <Modal
    //   open={isMobileMenuOpen}
    //   onClose={() => setIsMobileMenuOpen(false)}
    //   className="fixed top-[100px] flex items-center justify-center z-50 border-0" }
    // >

    <div className=" mobile-menu flex flex-col text-center bg-white w-full relative shadow-lg rounded-lg z-50 " onClick={() => setIsMobileMenuOpen(false)}>
      <MenuLinks path={path} />

    </div>
    // </Modal>
  )
}
const MenuLinks = ({ path }) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <>
      <Link
        className={` ${path == "/dashboard" ? "text-[#4caf50]" : (isMobile ? "text-slate-800" : "text-white")
          } text-[0.875rem] font-medium leading-normal`}
        href="/dashboard"
      >
        Dashboard
      </Link>
      <Link
        className={`text-[0.875rem] font-medium leading-normal ${path == "/transactions" ? "text-[#4caf50]" : isMobile ? "text-slate-800" : "text-white"
          }`}
        href="/transactions"
      >
        Transactions
      </Link>
      <Link
        className={`${path == "/categories" ? "text-[#4caf50]" : isMobile ? "text-slate-800" : "text-white"
          } text-[0.875rem] font-medium leading-normal`}
        href="/categories"
      >
        Categories
      </Link>
  
    </>
  )
}
