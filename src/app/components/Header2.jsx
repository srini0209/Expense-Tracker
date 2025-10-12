"use client";

import React, { useContext, useEffect, useState, useMemo } from "react";
import Link from "next/link";
// import Image from "next/image"; // Removed since it's commented out in the original
import { useRouter, usePathname } from "next/navigation";
import { UserContext } from "../Context/UserContext.js";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined"; // Not used but kept for completeness
import { LogOut, Menu, X } from "lucide-react";
import { Modal, Tooltip, useMediaQuery } from "@mui/material";

// --- Custom Hook to safely handle localStorage access ---
// New/Modified Custom Hook
const useUserToken = () => {
  const [userToken, setUserToken] = useState("");
  const [loading, setLoading] = useState(true); // 💡 New loading state

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        setUserToken(token);
      }
    }
    setLoading(false); // 💡 Set loading to false once the check is done
  }, []);

  return { userToken, loading };
};

// ====================================================================
// HEADER COMPONENT (Root)
// ====================================================================
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useContext(UserContext);
  const { userToken, loading } = useUserToken(); // Use custom hook for safe token access
  const path = usePathname();

  // Use the user state from context to determine the navigation link
  const homeLink = user ? "/dashboard" : "/";

  return (
    <>
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid sticky top-0 bg-[#303f9f] px-10 py-5">
        {/* Logo and App Name */}
        <div className="text-[#0d0c1d]">
          <Link href={homeLink} className="flex items-center gap-2">
            <CurrencyRupeeOutlinedIcon className="text-white" />
            <h2 className="text-white text-2xl font-bold leading-tight tracking-[-0.015em]">
              FinTrack
            </h2>
          </Link>
        </div>

        {/* Conditional Navigation / Auth Buttons */}
        {loading ? (
          // Renders a loading skeleton or nothing while checking localStorage
          <div className="h-8 w-40 bg-white/20 animate-pulse rounded-md flex flex-1 justify-end" />
        ) : !userToken ? (
          // Renders Sign Up/Log In if no token is found
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
          // Renders Navbar if a token IS found
          <Navbar
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            user={user}
          />
        )}
      </header>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <MobileMenu path={path} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      )}
    </>
  );
};

export default Header;

// ====================================================================
// NAVBAR COMPONENT (Desktop/Mobile Toggle)
// ====================================================================
const Navbar = ({ isMobileMenuOpen, setIsMobileMenuOpen, user }) => {
  const router = useRouter();
  const path = usePathname();
  // isMobile check should ideally happen in useEffect or useMemo if it affects rendering logic,
  // but using it directly is fine for conditional rendering based on screen size.
  const isMobile = useMediaQuery("(max-width: 845px)");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Close mobile menu if screen size becomes desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMobileMenuOpen(false);
    }
  }, [isMobile, setIsMobileMenuOpen]);

  // Action to Logout button
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    // Clear the server-side cookie as well
    document.cookie =
      "AuthToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  return (
    <div className="flex flex-1 justify-end gap-8">
      <div className="flex items-center gap-9">
        {!isMobile ? (
          /* Desktop Menu */
          <div className="flex items-center gap-9">
            <MenuLinks path={path} isMobile={isMobile} />

            {/* Profile Button - Uncommented structure for future use */}
            {/* <Link className="text-white text-sm font-medium leading-normal" href="#">
              <button 
                className="cursor-pointer bg-gray-100/20 rounded-full p-2"
                onClick={() => setIsModalOpen(true)}
              >
                <User />
              </button>
            </Link> */}

            <p
              className="bg-error-500 hover:bg-error-600 text-white px-4 py-2 cursor-pointer rounded-md text-sm font-medium transition-colors duration-200"
              onClick={handleLogout}
              role="button" // Accessibility improvement
            >
              Logout
            </p>
          </div>
        ) : (
          /* Mobile Menu Toggle & Logout */
          <>
            <button
              className="text-white border border-white p-1.5 rounded cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <Tooltip title="Logout">
              <LogOut
                className="text-white cursor-pointer"
                onClick={handleLogout}
                role="button" // Accessibility improvement
              />
            </Tooltip>
          </>
        )}
      </div>

      {/* User Profile Modal */}
      {isModalOpen && (
        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          aria-labelledby="user-profile-modal-title"
        >
          <div
            className="fixed inset-0 flex items-center justify-center"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="flex flex-col gap-4 bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
            >
              <div className="flex justify-between items-center mb-2">
                <h2
                  id="user-profile-modal-title"
                  className="font-semibold text-2xl text-indigo-600"
                >
                  User Profile
                </h2>
                <button
                  className="text-gray-500 cursor-pointer"
                  onClick={() => setIsModalOpen(false)}
                  aria-label="Close profile modal"
                >
                  <X />
                </button>
              </div>
              {/* Note: The state setting for name (setUsrName) is missing in this scope, 
                      so I've kept the original structure but commented out the onChange for safety. */}
              <input
                type="text"
                className="bg-gray-50 border border-gray-200 rounded-lg text-[14px] cursor-not-allowed text-slate-800 px-3 py-2"
                placeholder="Email"
                value={user?.email || ""}
                disabled
              />
              <input
                type="text"
                className="bg-gray-50 border border-gray-200 rounded-lg text-[14px] text-slate-800 px-3 py-2"
                placeholder="Name"
                value={user?.name || ""}
                // onChange={(e) => setUsrName(e.target.value)} // setUsrName not defined here
              />
              <input type="Password" placeholder="Password" />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ====================================================================
// MOBILE MENU COMPONENT (Overlay content)
// ====================================================================
const MobileMenu = ({ path, setIsMobileMenuOpen }) => {
  return (
    <div
      className="mobile-menu flex flex-col text-center bg-white w-full sticky top-[72px] shadow-lg rounded-b-lg z-50 transition-all duration-300 ease-in-out"
      // Added a more specific sticky top value (header height is roughly 72px)
      onClick={() => setIsMobileMenuOpen(false)}
      role="navigation" // Accessibility improvement
    >
      {/* Explicitly set isMobile true for MobileMenu links */}
      <MenuLinks path={path} isMobile={true} />
    </div>
  );
};

// ====================================================================
// MENU LINKS COMPONENT (Shared Nav Links)
// ====================================================================
const MenuLinks = ({ path, isMobile }) => {
  // Define links once to make the component cleaner
  const links = useMemo(
    () => [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/transactions", label: "Transactions" },
      { href: "/categories", label: "Categories" },
    ],
    []
  );

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          // The active path check is moved into the class calculation for cleaner code
          className={`
            text-[0.875rem] font-medium leading-normal p-3 transition-colors duration-150
            ${
              path === link.href
                ? "text-[#4caf50] font-bold" // Active link color
                : isMobile
                ? "text-slate-800 hover:bg-gray-100" // Mobile non-active style
                : "text-white hover:text-gray-300" // Desktop non-active style
            }
          `}
        >
          {link.label}
        </Link>
      ))}
    </>
  );
};
