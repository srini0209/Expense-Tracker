"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import {
  TrendingDown,
  TrendingUp,
  Wallet,
  ShoppingCart,
  SearchIcon,
  Edit2,
  Delete,
  Trash2,
  Plus,
} from "lucide-react";
import Modal from "../components/Modal";
import CategoriesForm from "../components/CategoriesForm";
import toast from "react-hot-toast";
import { CircularProgress } from "@mui/joy";
import { capitalize } from "../../utils/helper";

const Page = () => {
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
  const [activeTab, setActiveTab] = useState("Expense");
  const [searchTerm, setsearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editCatID, setEditCatID] = useState("");
  const [modalType, setModalType] = useState("");

  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      // setLoading(true)

      const params = {};
      params.startDate = startDate.toISOString();
      params.endDate = endDate.toISOString();
      const response = await axiosInstance.get("/api/transactions", { params });
      setAnalyData(response.data.analyticsData);
      // setLoading(false)
    } catch (error) {
      console.log("budgets page.js Error fetching Data:", error);
      // setLoading(false)
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
      setLoading(true);
      const response = await axiosInstance.get("/api/categories/");
      setCatData(response.data);
      setLoading(false);
    } catch (error) {
      console.log("budgets page.js Error fetching Categories:", error);
      setLoading(false);
    }
  };
  console.log("budgets: Cat data:", catData);
  // Calculating Total Income and Expense
  const totInc = () => {
    const found = AnalyData?.find((item) => item.txnType === "Income");
    return found ? found.totalAmount : 0;
  };
  const totExp = () => {
    const found = AnalyData?.find((item) => item.txnType === "Expense");
    return found ? found.totalAmount : 0;
  };
  useEffect(() => {
    fetchCategories();
    fetchData();
  }, []);

  useEffect(() => {
    setTotalIncome(totInc());
    setTotalExpense(totExp());
  }, [AnalyData]);

  // Filtered Categories
  const filteredCategories = catData.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      cat.type === activeTab
  );

  // Categories count by Type
  const IncomeCats = () => {
    const incomeData = catData?.filter((item) => item.type === "Income");
    console.log("Income Data:", incomeData);
    return incomeData?.length;
  };
  const ExpenseCats = () => {
    const expenseData = catData?.filter((item) => item.type === "Expense");
    console.log("Expense Data:", expenseData);
    return expenseData?.length;
  };
  // Category total
  const exCatTotal = (catName) => {
    const expenseData = AnalyData?.find((item) => item.txnType === "Expense");
    const found = expenseData?.categories?.find(
      (item) => item.category === catName
    );
    return found ? found.totalAmount : 0;
  };
  const inCatTotal = (catName) => {
    const incomeData = AnalyData?.find((item) => item.txnType === "Income");
    const found = incomeData?.categories?.find(
      (item) => item.category === catName
    );
    return found ? found.totalAmount : 0;
  };
  return (
    <div className="my-10 px-5">
      <div className="flex flex-wrap sm:flex-nowrap justify-between mb-8 items-center">
        <h2 className=" text-2xl font-semibold text-blue-500">Categories</h2>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setModalType("add");
          }}
          className="px-3 py-2 bg-linear-to-br from-indigo-500 to-blue-500 shadow-lg rounded-lg cursor-pointer text-white font-semibold flex gap-2 items-center"
        >
          <Plus /> Add Category
        </button>
      </div>
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
              ₹{" "}
              {
                /* ₹ {
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
              ₹{" "}
              {
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
          <button
            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === "Expense"
                ? "bg-red-500 text-white shadow-md"
                : "text-gray-600 hover:text-red-500 hover:bg-red-50"
            }`}
            onClick={() => setActiveTab("Expense")}
          >
            <TrendingDown />
            Expense ({ExpenseCats()})
          </button>
          <button
            className={`px-6 py-3 rounded-md font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTab === "Income"
                ? "bg-green-500 text-white shadow-md"
                : "text-gray-600 hover:text-green-500 hover:bg-green-50"
            }`}
            onClick={() => setActiveTab("Income")}
          >
            <TrendingUp />
            Income ({IncomeCats()})
          </button>
        </div>
        {/* Search Box */}
        <div className="flex p-3 gap-3 items-center border bg-white border-gray-300 rounded-xl shadow-lg w-full md:w-auto">
          <SearchIcon className="text-slate-600" />
          <input
            type="text"
            placeholder="Search Categories"
            className="border-0 focus:border-0 focus:outline-none"
            value={searchTerm}
            onChange={(e) => setsearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Displaying Categories */}
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {loading ? (
          <div className="text-center py-10 col-span-full">
            <div className="flex flex-col justify-center items-center">
              <CircularProgress
                size="lg"
                variant="soft"
                color="neutral"
                value={60}
              />
              <p className="text-slate-500 text-center text-sm mt-3">
                Loading...
              </p>
            </div>
          </div>
        ) : (
          filteredCategories.map((cat) => (
            <div
              key={cat._id}
              className={`bg-white rounded-xl p-6 shadow-lg border-l-4 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                cat.type === "Income"
                  ? "border-l-green-500 bg-gradient-to-br from-green-50 to-white"
                  : "border-l-red-500 bg-gradient-to-br from-red-50 to-white"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-[18px] capitalize">
                  {cat.name}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setIsModalOpen(true);
                      setModalType("edit");
                      setEditCatID(cat._id);
                    }}
                    className="hover:bg-blue-50 hover:text-blue-500 text-neutral-500 p-2 rounded cursor-pointer"
                  >
                    <Edit2 className="h-4 w-4 " />
                  </button>
                  <button
                    onClick={() => {
                      setIsModalOpen(true);
                      setModalType("delete");
                      setEditCatID(cat._id);
                    }}
                    className="hover:bg-red-50 hover:text-red-500 text-neutral-500 p-2 rounded cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4 " />
                  </button>
                </div>
              </div>
              {cat.type === "Expense" && (
                <p className="font-medium text-sm text-gray-800 mb-2">
                  Budget: ₹ {cat.budget > 0 ? cat.budget : "NA"}
                </p>
              )}

              <p className="font-medium text-sm text-gray-800 mb-2">
                Total {cat.type === "Expense" ? "Spending" : "Gains"}: ₹{" "}
                {activeTab === "Expense"
                  ? exCatTotal(cat.name)
                  : inCatTotal(cat.name)}
              </p>
              {cat.budget > 0 ? (
                <div className="flex items-center gap-1.5">
                  <div className="h-[10px] w-full bg-gray-200 text-left rounded-lg">
                    <div
                      className={`bg-amber-500 h-[10px] rounded-lg`}
                      style={{
                        width: `${
                          cat.budget > 0
                            ? Math.round(
                                (exCatTotal(cat.name) / cat.budget) * 100
                              ) <= 100
                              ? Math.round(
                                  (exCatTotal(cat.name) / cat.budget) * 100
                                )
                              : 100
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-gray-700 text-[10px]">
                    {Math.round((exCatTotal(cat.name) / cat.budget) * 100)}%
                  </span>
                </div>
              ) : (
                ""
              )}
            </div>
          ))
        )}
      </div>

      {/* Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        title={`${
          modalType !== "delete"
            ? `${modalType === "add" ? "Add" : "Edit"} `
            : "Delete "
        } Category`}
        onClose={() => setIsModalOpen(false)}
      >
        {modalType !== "delete" ? (
          modalType === "add" ? (
            <CategoriesForm
              fetchCategories={fetchCategories}
              fetchData={fetchData}
              setIsModalOpen={setIsModalOpen}
            />
          ) : (
            <CategoriesForm
              fetchCategories={fetchCategories}
              fetchData={fetchData}
              setIsModalOpen={setIsModalOpen}
              initialData={catData.find((item) => item._id === editCatID)}
            />
          )
        ) : (
          <>
            <p className="text-lg font-medium text-blue-500 mb-2">
              Are you sure?
            </p>
            <p className="text-slate-800 text-sm">
              <span className="text-indigo-500">
                &quot;
                {capitalize(
                  catData.find((item) => item._id === editCatID)?.name
                )}
                &quot;
              </span>{" "}
              Will be Deleted.
            </p>
            <div className="flex gap-2 justify-end items-center mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="border-blue-200 border text-blue-500 cursor-pointer p-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  try {
                    await axiosInstance.delete(`/api/categories/${editCatID}`);
                    toast.success("Category Deleted");
                    setIsModalOpen(false);
                    fetchCategories();
                  } catch (error) {
                    console.log("Error deleting category", error);
                    toast.error("Error deleting category");
                    setIsModalOpen(false);
                  }
                }}
                className="bg-red-500 text-white border border-red-500 cursor-pointer p-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Page;
