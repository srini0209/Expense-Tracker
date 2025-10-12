"use client";
import { Suspense, useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { useRouter } from "next/navigation";

export default function Page() {
  const [message, setMessage] = useState("Verifying...");
  const router = useRouter();

  const verify = async (token) => {
    try {
      const res = await axiosInstance.get(`/api/auth/verify?token=${token}`);
      setMessage(res.data?.message);
      if (res.data?.message === "Email Verified Successfully") {
        router.push("/login"); // Redirect only if verification is successful
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Something went wrong during verification"
      );
    }
  };
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    if (!token) return setMessage("Invalid verification link");
    verify(token);
    // fetch(`/api/auth/verify?token=${token}`)
    //   .then((res) => res.json())
    //   .then((data) => setMessage(data.message || data.error))
    //   .catch(() => setMessage("Something went wrong"));
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex h-screen items-center justify-center">
        <h2 className="text-xl font-bold">{message}</h2>
      </div>
    </Suspense>
  );
}
