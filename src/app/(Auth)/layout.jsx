import React from "react";
import LoginSigupTab from "../components/LoginSigupTab";

const layout = ({ children }) => {
  return (
    <div className="py-10 md:px-auto px-5" >
      <h1 className="text-indigo-500 text-3xl font-semibold text-center mb-10 ">Let's Get Your Spending on Track.</h1>

      <div className="w-full md:w-[600px]  mx-auto bg-blue-50 rounded-2xl shadow-lg px-10 py-5 h-full items-center ">
        <div className="layout-content-container  flex flex-col  py-5  flex-1">
          <div className="pb-3 ">
            <LoginSigupTab />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default layout;
