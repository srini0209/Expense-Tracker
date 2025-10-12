"use client";
import React, { useContext, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserContext } from "../Context/UserContext";
import { Menu, X } from "lucide-react"; // lightweight icons

const Header = () => {
  const { user, loading, logout } = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);

  if (loading) return null; // prevent flicker

  const guestLinks = (
    <>
      <Link href="/signup" className="hover:text-blue-600 transition">
        Sign Up
      </Link>
      <Link href="/login" className="hover:text-blue-600 transition">
        Login
      </Link>
    </>
  );

  const authLinks = (
    <>
      <Link href="/dashboard" className="hover:text-blue-600 transition">
        Dashboard
      </Link>
      <Link href="/transactions" className="hover:text-blue-600 transition">
        Transactions
      </Link>
      <Link href="/categories" className="hover:text-blue-600 transition">
        Categories
      </Link>
      <button
        onClick={logout}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
      >
        Logout
      </button>
    </>
  );

  return (
    <header className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          <span className="text-xl font-bold text-gray-800">MyApp</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center space-x-6 text-gray-700">
          {!user ? guestLinks : authLinks}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md border-t">
          <nav className="flex flex-col items-start space-y-4 px-6 py-4 text-gray-700">
            {!user ? guestLinks : authLinks}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
