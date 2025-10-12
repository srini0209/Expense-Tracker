"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { useRouter } from "next/navigation";

export default function VerifyPage() {
  const [message, setMessage] = useState("Verifying...");
  const searchParams = useSearchParams();
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
    const token = searchParams.get("token");
    if (!token) return setMessage("Invalid verification link");
    verify(token);
    // fetch(`/api/auth/verify?token=${token}`)
    //   .then((res) => res.json())
    //   .then((data) => setMessage(data.message || data.error))
    //   .catch(() => setMessage("Something went wrong"));
  }, [searchParams]);

  return (
    <div className="flex h-screen items-center justify-center">
      <h2 className="text-xl font-bold">{message}</h2>
    </div>
  );
}
