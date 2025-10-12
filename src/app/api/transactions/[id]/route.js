import { NextResponse } from "next/server";
import connectDB from "../../../../utils/dbConnect.js";
import TransactionsModel from "../../../../../models/TransactionsModel.js";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  const { id } = await params;
  try {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "ID is not a Valid ObjectId" },
        { status: 403 }
      );
    }
    const txn = await TransactionsModel.findById(id).lean();
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "ID is not a Valid ObjectId" },
        { status: 403 }
      );
    }
    const rawData = await request.json();
    const data = sanitizeInput(rawData);
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

export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "ID is not a Valid ObjectId" },
        { status: 403 }
      );
    }
    // const data = await request.json();
    const txn = await TransactionsModel.findByIdAndDelete(id).lean();
    return NextResponse.json(txn);
  } catch (error) {
    return NextResponse.json({
      message: "Error deleting Transaction",
      error: error.message,
    });
  }
}
