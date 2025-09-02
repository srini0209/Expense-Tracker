"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { TrendingDown, TrendingUp, Wallet, ShoppingCart, SearchIcon } from "lucide-react";

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
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [activeTab, setActiveTab] = useState('Expense');
  const [searchTerm, setsearchTerm] = useState('')

  const fetchData = async () => {
    try {
      const params = {};
      params.startDate = startDate.toISOString();
      params.endDate = endDate.toISOString();
      const response = await axiosInstance.get("/api/transactions", { params });
      setAnalyData(response.data.analyticsData);
    } catch (error) {
      console.log("budgets page.js Error fetching Data:", error);
    }
  };
  console.log("budgets page analydata:", AnalyData);
  //   console.log(
  // "budgets page analydata Expense:",
  // AnalyData.filter((d) => d.txnType === "Expense")
  //   );
  //   console.log(
  //     "budgets page analydata Expense:",
  //     AnalyData.filter((d) => d.txnType === "Expense")
  //   );
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/api/categories/");
      setCatData(response.data);
    } catch (error) {
      console.log("budgets page.js Error fetching Categories:", error);
    }
  };
  console.log("budgets: Cat data:", catData);
  // Calculating Total Income and Expense
  const totInc = () => {
    const found = AnalyData?.find(item => item.txnType === 'Income');
    return found ? found.totalAmount : 0;
  }
  const totExp = () => {
    const found = AnalyData?.find(item => item.txnType === 'Expense');
    return found ? found.totalAmount : 0;
  }
  useEffect(() => {
    fetchCategories();
    fetchData();

  }, []);

  useEffect(() => {
    setTotalIncome(totInc());
    setTotalExpense(totExp());
  }, [AnalyData])

  // Filtered Categories
  const filteredCategories = catData.filter(cat => cat.name.toLowerCase().includes(searchTerm.toLowerCase()) && cat.type === activeTab);

  // Categories count by Type
  const IncomeCats = () => {
    const incomeData = catData?.filter(item => item.type === 'Income');
    console.log('Income Data:', incomeData)
    return incomeData?.length;
  }
  const ExpenseCats = () => {
    const expenseData = catData?.filter(item => item.type === 'Expense');
    console.log('Expense Data:', expenseData)
    return expenseData?.length;
  }
  // Category total
  const catTotal = (catName) => {
    const expenseData = AnalyData?.find(item => item.txnType === 'Expense');
    const found = expenseData?.categories?.find(item => item.category === catName);
    return found ? found.totalAmount : 0;
  }
  return (
    <div className="my-10 px-5">
      <h2 className="mb-5 text-2xl font-semibold text-blue-800">Budgets</h2>

      {/* Summaries: Total Income, Total Expense, Balance, Total Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5  justify-between mb-10">
        <div className="flex flex-row items-center gap-3 w-full  p-5 min-h-[100px] bg-white shadow-lg rounded-lg">
          <div className={"p-3 rounded-lg bg-green-100"}>
            <TrendingUp className=" text-green-500" />
          </div>
          <div>
            <p className="text-sm text-slate-800 font-medium text-left">
              Total Income
            </p>
            <h3 className="text-xl font-bold text-left text-green-500">
              ₹ {/* ₹ {
                      (() => {
                        const found = analyData?.find(item => item.txnType === 'Income');
                        return found ? ` ${found.totalAmount}` : " 0";
                      })() }*/
                totalIncome.toLocaleString()
              }
            </h3>
          </div>
        </div>
        <div className="flex flex-row items-center gap-3 w-full  p-5 min-h-[100px] bg-white shadow-lg rounded-lg">
          <div className={"p-3 rounded-lg bg-red-100"}>
            <TrendingDown className="text-red-500" />
          </div>
          <div>
            <p className="text-sm text-slate-800 font-medium text-left">
              Total Expense
            </p>
            <h3 className="text-xl font-bold text-left text-red-500">
              ₹ {
                // (() => {
                //   const found = analyData?.find(item => item.txnType === 'Income');
                //   return found ? ` ${found.totalAmount}` : " 0";
                // })() 
                totalExpense.toLocaleString()
              }
            </h3>
          </div>
        </div>
        <div className="flex flex-row items-center gap-3 w-full  p-5 min-h-[100px] bg-white shadow-lg rounded-lg">
          <div className={"p-3 rounded-lg bg-blue-100"}>
            <Wallet className="text-blue-500" />
          </div>
          <div>
            <p className="text-sm text-slate-800 font-medium text-left">
              Balance
            </p>
            <h3 className="text-xl font-bold text-left text-blue-500">
              ₹ {(totalIncome - totalExpense).toLocaleString()}
            </h3>
          </div>
        </div>
        <div className="flex flex-row items-center gap-3 w-full  p-5 min-h-[100px] bg-white shadow-lg rounded-lg">
          <div className={"p-3 rounded-lg bg-indigo-100"}>
            <ShoppingCart className="text-indigo-500" />
          </div>
          <div>
            <p className="text-sm text-slate-800 font-medium text-left">
              Total Categories
            </p>
            <h3 className="text-xl font-bold text-left text-indigo-500">
              {catData.length}
            </h3>
          </div>
        </div>
      </div>

      {/* Income/Expense Tab */}
      <div className="flex justify-between mb-8 items-center md:gap-0 gap-8 flex-wrap md:flex-nowrap">
        {/* Tabs */}
        <div className="p-1.5 flex gap-0.5 rounded-lg shadow-lg bg-white">
          <button className={`px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === 'Expense'
            ? 'bg-red-500 text-white shadow-md'
            : 'text-gray-600 hover:text-red-500 hover:bg-red-50'
            }`}
            onClick={() => setActiveTab('Expense')}
          ><TrendingDown />Expense ({ExpenseCats()})</button>
          <button className={`px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center gap-2 ${activeTab === 'Income'
            ? 'bg-green-500 text-white shadow-md'
            : 'text-gray-600 hover:text-green-500 hover:bg-green-50'
            }`}
            onClick={() => setActiveTab('Income')}
          ><TrendingUp />Income ({IncomeCats()})</button>
        </div>
        {/* Search Box */}
        <div className="flex p-3 gap-3 items-center border border-gray-300 rounded-xl shadow-lg w-full md:w-auto">
          <SearchIcon className="text-slate-800" />
          <input type="text" placeholder="Search Categories" value={searchTerm} onChange={(e) => setsearchTerm(e.target.value)} />
        </div>
      </div>
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredCategories.map((cat) => (

          <div key={cat._id}
            className={`bg-white rounded-xl p-6 shadow-lg border-l-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${cat.type === 'Income' ? 'border-l-green-500 bg-gradient-to-br from-green-50 to-white' : 'border-l-red-500 bg-gradient-to-br from-red-50 to-white'
              }`}>
            <p className="font-semibold text-[18px] mb-2">{cat.name}</p>

            <p>Budget: ₹ {cat.budget}</p>

            <p>
              Total Spending: ₹ {
                catTotal(cat.name)
              }
            </p>

            <div className="h-3 w-full bg-gray-100 text-left rounded-lg">
              <div className={`bg-amber-500 h-3 rounded-lg`} style={{ width: `${cat.budget > 0 ? Math.round((catTotal(cat.name) / cat.budget) * 100) : 0}%` }} >
              </div>
            </div>
          </div>
        ))}
      </div>
    </div >
  );
};

export default page;
