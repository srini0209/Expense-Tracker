"use client";
import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

export default function PieActiveArc({ data, type }) {
  const valueFormatter = (item) => `${item.value}%`;
  const totalIncome = data[0]?.totalAmount;
  const totalExpense = data[1]?.totalAmount;
  const TxnType = data
    .filter((d) => d.txnType == type)[0]
    .categories.map((item) => ({
      label: item.category,
      value:
       Math.round( (item?.totalAmount / (type == "Income" ? totalIncome : totalExpense)) *
        100),
    }));

  console.log("PieChart Data:", TxnType);
  return (
    <PieChart
      series={[
        {
          data: TxnType,
          highlightScope: { fade: "global", highlight: "item" },
          faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
          valueFormatter,
        },
      ]}
      height={200}
      width={200}
    />
  );
}
