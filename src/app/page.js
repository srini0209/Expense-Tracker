"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      router.push("/dashboard");
    }
  }, []);
  return (
    <div className="px-40 flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="@container">
          <div className="flex flex-col gap-6 px-4 py-10 @[480px]:gap-8 @[864px]:flex-row">
            <div
              className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg @[480px]:h-auto @[480px]:min-w-[400px] @[864px]:w-full"
              style={{
                backgroundImage:
                  'url("https://lh3.googleusercontent.com/aida-public/AB6AXuAIfnegNXFvthCpwnLMAaCA3unMlCxzrRWsstmZWvTRNZG1DDUTqH-wMGurhIZdVAuUEe-kqA03vmum2UL9qXjHJ_35FHewLtYlgJHlKrifLtlZGYHreEk_VSywQGkz5Ue1347yHGcaLr5jBUpOOHOOKjOfXvBxnie-kWzACh6G8hh85tEBPvEeTVhlt8i2G-8nUplgEmRATLZU7kEr4KUip07hWxsIZBY44nPiRcksEDtsuzTBAmp1m9YwHJczctoaTLRBH0h60A95")',
              }}
            ></div>
            <div className="flex flex-col gap-6 @[480px]:min-w-[400px] @[480px]:gap-8 @[864px]:justify-center">
              <div className="flex flex-col gap-2 text-left">
                <h1 className="text-[#0d0c1d] text-4xl font-black leading-tight tracking-[-0.033em] @[480px]:text-5xl @[480px]:font-black @[480px]:leading-tight @[480px]:tracking-[-0.033em]">
                  Take Control of Your Finances
                </h1>
                <h2 className="text-[#0d0c1d] text-sm font-normal leading-normal @[480px]:text-base @[480px]:font-normal @[480px]:leading-normal">
                  FinTrack helps you track your expenses, create budgets, and
                  gain insights into your spending habits. Start your journey
                  towards financial wellness today.
                </h2>
              </div>
              <div className="flex-wrap gap-3 flex">
                <Link
                  href={"/register"}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#3c32ff] text-[#f8f8fc] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]"
                >
                  <span className="truncate">Sign Up</span>
                </Link>
                <Link
                  href={"/login"}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 @[480px]:h-12 @[480px]:px-5 bg-[#e7e6f4] text-[#0d0c1d] text-sm font-bold leading-normal tracking-[0.015em] @[480px]:text-base @[480px]:font-bold @[480px]:leading-normal @[480px]:tracking-[0.015em]"
                >
                  <span className="truncate">Log In</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
