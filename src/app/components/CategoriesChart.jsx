"use client";
import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

export default function PieActiveArc({
  data,
  type,
  totalIncome,
  totalExpense,
}) {
  const valueFormatter = (item) => `${item.value}%`;
  const [highlighted, setHighlighted] = React.useState(null);
  // const totalIncome = data[0]?.totalAmount;
  // const totalExpense = data[1]?.totalAmount;
  const found = data.find((d) => d.txnType == type);
  const denominator = type == "Income" ? totalIncome : totalExpense;
  const inputData = found.categories.map((item, index) => ({
    id: index,
    label: item.category,
    value:
      denominator && denominator !== 0
        ? ((item?.totalAmount / denominator) * 100).toFixed(2)
        : "0.00",
  }));

  console.log(
    "PieChart Data totalIncome, TotalExpense:",
    totalIncome,
    totalExpense
  );
  console.log("PieChart Data Found:", found);
  console.log("PieChart Data from dashboard:", data);
  console.log("PieChart Data:", inputData);
  return (
    <PieChart
      series={[
        {
          data: inputData,
          highlightedItem: { faded: "global", highlighted: "item" },
          // innerRadius:60,
          valueFormatter,
        },
      ]}
      height={200}
      width={200}
    />
  );
}
