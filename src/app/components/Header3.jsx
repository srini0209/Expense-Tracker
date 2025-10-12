"use client";
import React, { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserContext } from "../Context/UserContext.js";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import { LogOut, Menu, X } from "lucide-react";
import { Modal, Tooltip, useMediaQuery } from "@mui/material";

const Header = () => {
  const { user } = useContext(UserContext);
  const [userToken, setUserToken] = useState(null); // null until we check
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const path = usePathname();
  const router = useRouter();

  // ✅ Only run on client
  useEffect(() => {
    const token = localStorage.getItem("token");
    setUserToken(token);
  }, []);

  // ✅ useMediaQuery fix (disable SSR check)
  const isMobile = useMediaQuery("(max-width: 845px)", { noSsr: true });

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie =
      "AuthToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  const menuLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/transactions", label: "Transactions" },
    { href: "/categories", label: "Categories" },
  ];

  return (
    <>
      <header className="flex items-center justify-between border-b sticky top-0 bg-[#303f9f] px-10 py-5">
        {/* Logo */}
        <Link
          href={user ? "/dashboard" : "/"}
          className="flex items-center gap-2 text-white"
        >
          <CurrencyRupeeOutlinedIcon />
          <h2 className="text-2xl font-bold">FinTrack</h2>
        </Link>

        {/* If not logged in */}
        {userToken === null ? null : !userToken ? (
          <div className="flex gap-2">
            <Link
              href="/register"
              className="bg-secondary-500 hover:bg-secondary-600 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Sign Up
            </Link>
            <Link
              href="/login"
              className="border-2 border-white/40 text-white hover:bg-white/10 hover:border-white/60 px-4 py-2 rounded-md text-sm font-medium"
            >
              Log In
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            {/* Desktop Menu */}
            {!isMobile && (
              <>
                {menuLinks.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`text-sm font-medium ${
                      path === href
                        ? "text-[#4caf50]"
                        : "text-white hover:opacity-80"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
                <p
                  onClick={handleLogout}
                  className="bg-error-500 hover:bg-error-600 text-white px-4 py-2 rounded-md text-sm font-medium cursor-pointer"
                >
                  Logout
                </p>
              </>
            )}

            {/* Mobile Menu */}
            {isMobile && (
              <div className="flex items-center gap-4">
                <button
                  className="text-white border border-white p-1.5 rounded"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
                <Tooltip title="Logout">
                  <LogOut
                    className="text-white cursor-pointer"
                    onClick={handleLogout}
                  />
                </Tooltip>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Mobile Menu */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="flex flex-col text-center bg-white w-full shadow-lg rounded-lg z-50"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {menuLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`py-3 text-sm font-medium ${
                path === href ? "text-[#4caf50]" : "text-slate-800"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}

      {/* User Profile Modal */}
      <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div
          className="fixed inset-0 flex items-center justify-center"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="flex flex-col gap-4 bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold text-2xl text-indigo-600">
                User Profile
              </h2>
              <button
                className="text-gray-500"
                onClick={() => setIsModalOpen(false)}
              >
                <X />
              </button>
            </div>
            <input
              type="text"
              className="bg-gray-50 border rounded-lg px-3 py-2 text-sm"
              value={user?.email || ""}
              disabled
            />
            <input
              type="text"
              className="bg-gray-50 border rounded-lg px-3 py-2 text-sm"
              value={user?.name || ""}
              readOnly
            />
            <input
              type="password"
              placeholder="Password"
              className="bg-gray-50 border rounded-lg px-3 py-2 text-sm"
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Header;
