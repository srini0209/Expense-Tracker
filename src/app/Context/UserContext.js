"use client";
import React, { createContext, useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
// import { error } from "console"

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null);

  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      setLoading(false);
      //   return;
    }

    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/api/auth/user");
        console.log("userContext fetchUser res.data:", res.data);
        setUser(res.data && res.data.user);
      } catch (error) {
        console.error("User not found", error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    // fetchUser();
    // if (user===null) {
    // fetchUser();
    // }
  }, []);

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
  };
  return (
    <UserContext.Provider value={{ user, loading, error, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};
