import { NextResponse } from "next/server";
import connectDB from "../../../../../utils/dbConnect.js";
import TransactionsModel from "../../../../../models/TransactionsModel.js";

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    await connectDB();
    const txn = await TransactionsModel.findById(id);
    return NextResponse.json(txn);
  } catch (error) {
    return NextResponse.json({
      message: "Transaction not found",
      TxnID: id,
    });
  }
}

export async function PUT(request, { params }) {
    const { id } = await params;
  try {
    await connectDB();
    const data = await request.json();
    const txn = await TransactionsModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    return NextResponse.json(txn);
  } catch (error) {
    return NextResponse.json({
      message: "Error updating Transaction",
      error: error.message,
    });
  }
}
