"use client";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "/",
  timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",

//     // Accept: "application/json"
//   },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("token");
    // console.log("Interceptor token:", accessToken); //  DEBUG
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    // console.log("Request headers after adding token:", config.headers); //  DEBUG
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors globally
    if (error.response) {
      if (error.response.status === 401) {
        // Redirect to login page
        window.location.href = "/login";
      } else if (error.response.status === 500) {
        console.error({
          message: "Server error. Please Try again later.",
          error: error.message,
        });
      }
    } else if (error.code === "ENCONNABORTED") {
      console.error("Request timeout. Please try again");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
