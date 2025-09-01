"use client";
import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";

export default function PieActiveArc({ data, type }) {
  const valueFormatter = (item) => `${item.value}%`;
  const [highlighted, setHighlighted] = React.useState(null);
  const totalIncome = data[0]?.totalAmount;
  const totalExpense = data[1]?.totalAmount;
  const TxnType = data
    .filter((d) => d.txnType == type)[0]
    .categories.map((item,index) => ({
      id:index,
      label: item.category,
      value: (
        (item?.totalAmount / (type == "Income" ? totalIncome : totalExpense)) *
        100
      ).toFixed(2),
    }));

  console.log("PieChart Data:", TxnType);
  return (
    <PieChart
      series={[
        {
          data: TxnType,
          highlightedItem: { faded: "global", highlighted: "item" },
          valueFormatter,
        },
      ]}
      height={200}
      width={200}
    />
  );
}
