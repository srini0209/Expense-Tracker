import { NextResponse } from "next/server";
import connectDB from "../../../../utils/dbConnect.js";
// import TransactionsModel from "../../../../../models/TransactionsModel.js";
import CategoriesModel from "../../../../../models/CategoriesModel.js";
import { sanitizeInput } from "../../../../utils/sanitizeInput.js";
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
    const txn = await CategoriesModel.findById(id);
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
    const rawData = await request.json();
    const data = sanitizeInput(rawData);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "ID is not a Valid ObjectId" },
        { status: 403 }
      );
    }
    const txn = await CategoriesModel.findByIdAndUpdate(id, data, {
      new: true,
    }).lean();
    return NextResponse.json(txn);
  } catch (error) {
    return NextResponse.json({
      message: "Error updating Category",
      error: error.message,
    });
  }
}
export async function DELETE(request, { params }) {
  const { id } = await params;
  try {
    await connectDB();
    // const data = await request.json();
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "ID is not a Valid ObjectId" },
        { status: 403 }
      );
    }
    const txn = await CategoriesModel.findByIdAndDelete(id);
    return NextResponse.json(txn);
  } catch (error) {
    return NextResponse.json({
      message: "Error deleting Category",
      error: error.message,
    });
  }
}
