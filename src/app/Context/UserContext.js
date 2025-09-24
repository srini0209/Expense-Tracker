"use client";
import React, { createContext, useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState('');
  const [userloading, setUserLoading] = useState(true); // To handle loading state
  const [error, setError] = useState(null);
  const [userCategories, setUserCategories] = useState([]);

  // Fetch user profile
  const fetchUser = async () => {
    try {
      const res = await axiosInstance.get("/api/auth/user");
      console.log("userContext fetchUser res.data:", res.data);
      setUser(res.data && res.data.user);
    } catch (error) {
      console.error("User not found", error.message);
      setError(error.message);
    } finally {
      setUserLoading(false);
    }
  };

  // Fetch User's Categories
  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get("/api/categories");
      console.log("userContext fetchCategories res.data:", res.data);
      setUserCategories(res.data && res.data);
    } catch (error) {
      console.error("User not found", error.message);
      setError(error.message);
    } finally {
      setUserLoading(false);
    }
  }

  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    console.log('Context useEffect accessToken', accessToken)
    if (!accessToken) {
      setUserLoading(false);
      return;
    }
    fetchUser();
    // if (user===null) {
    // fetchUser();
    // }
    fetchCategories();
  }, []);

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
  };
  return (
    <UserContext.Provider value={{ user, userloading, userCategories, error, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};
