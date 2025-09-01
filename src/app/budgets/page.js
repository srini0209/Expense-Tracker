"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";

const page = () => {
  // Date range
  const now = new Date();
  const [startDate, setStartDate] = useState(
    new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1))
  );
  const [endDate, setEndDate] = useState(
    new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1))
  );

  const [AnalyData, setAnalyData] = useState([]);
  const [catData, setCatData] = useState([]);
  const fetchData = async () => {
    try {
      const params = { type: "Expense" };
      params.startDate = startDate.toISOString();
      params.endDate = endDate.toISOString();
      const response = await axiosInstance.get("/api/transactions", { params });
      setAnalyData(response.data.analyticsData[1]);
    } catch (error) {
      console.log("budgets page.js Error fetching Data:", error);
    }
  };
  console.log("budgets page analydata:", AnalyData.categories);
  //   console.log(
  // "budgets page analydata Expense:",
  // AnalyData.filter((d) => d.txnType === "Expense")
  //   );
  //   console.log(
  //     "budgets page analydata Expense:",
  //     AnalyData.filter((d) => d.txnType === "Expense")
  //   );
  const fetchBudgets = async () => {
    try {
      const response = await axiosInstance.get("/api/categories/type/Expense");
      setCatData(response.data);
    } catch (error) {
      console.log("budgets page.js Error fetching Categories:", error);
    }
  };
  console.log("budgets: Cat data:", catData);

  useEffect(() => {
    fetchBudgets();
    fetchData();
  }, []);
  return (
    <div>
      <h2>Budgets</h2>

      <div>
        {catData.map((cat) => (
          <div key={cat._id}>
            <p>Category: {cat.name}</p>
            <p>Budget: ₹ {cat.budget}</p>

            <p>
              Total Spending: {
                (() => {
                  const found = AnalyData.categories?.find(item => item.category === cat.name);
                  return found ? `₹ ${found.totalAmount}` : "₹ 0";
                })()
              }
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
