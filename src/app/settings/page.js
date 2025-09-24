'use client';
import React, { useContext, useState } from "react";
import { UserContext } from "../Context/UserContext";

const page = () => {
  const { user, userCategories } = useContext(UserContext)
  const [usrName, setUsrName] = useState("");
  const [usrEmail, setUsrEmail] = useState("");
  const [usrPswd, setUsrPswd] = useState("");
  const [isUserEditing, setIsUserEditing] = useState(false);
  return (
    <div className="my-10">
      {/* User Profile Section */}
      <div className="bg-white shadow-lg rounded-lg p-5 flex flex-col mb-10">
        <h2 className="mb-3 text-2xl font-semibold text-blue-500">User Profile</h2>
        <div className="lg:w-[40%] md:w-[80%] w-full flex flex-col gap-4">


          <input type="text"
            className="bg-gray-50 border border-gray-200 rounded-lg text-[14px] text-slate-800 px-3 py-2"
            placeholder="Email" value={user.email} disabled />
          <input
            type="text"
            className="bg-gray-50 border border-gray-200 rounded-lg text-[14px] text-slate-800  px-3 py-2"
            placeholder="Name"
            value={user.name}
            onChange={(e) => setUsrName(e.target.value)}
          />

          <input
            type="Password"
            placeholder="Password"
            value={usrPswd}
            onChange={(e) => setUsrPswd(e.target.value)}
          />  </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-5 flex flex-col">
        <h2>Category & Budget Management</h2>
        
        
      </div>
    </div>
  );
};

export default page;
