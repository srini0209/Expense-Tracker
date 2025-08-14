import connectDB from "../../../../utils/dbConnect.js";
import TransactionsModel from "../../../../models/TransactionsModel.js";
import userModel from "../../../../models/UserModel.js";
import { NextResponse } from "next/server.js";
import jwt from "jsonwebtoken";
import customMiddleware from "../../customMiddleware.js";
import mongoose from "mongoose";

export async function GET(request, { params }) {
  const authHeader = request.headers.get("authorization");
  console.log("auth Header", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Not Authorized, No Token" },
      { status: 401 }
    );
  }
  const token = authHeader.split(" ")[1];
  console.log("token", token);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;
  // const userId = request.headers.get("user-id");
  // const mwres = customMiddleware(request); //Calling CustomMiddleware and Passing request
  // let userId;
  // if (mwres instanceof NextResponse) {
  //   // console.log("mwres is Instance of NextReponse:", mwres);
  //   return NextResponse.json(
  //     { message: mwres.message },
  //     { status: mwres.status }
  //   );
  // } else {
  //   userId = mwres;
  // }
  try {
    const filter = { userId: userId };
    // const today = new Date();
    // console.log("today", today.toISOString())
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const limitCount = searchParams.get("limit")
    if (type) filter.txnType = type;
    if (category) filter.category = category;

    await connectDB();
    // request.user = await userModel.findById(userId).select("-password");

    console.log("api/transactions/route.js fitter:", filter);
    console.log("api/transactions/route.js Type:", type);
    console.log("api/transactions/route.js userId:", userId);
    const txns = await TransactionsModel.find(filter).sort({ date: -1 }).limit(limitCount ? limitCount : '');

    const Incomepipeline =
      [
        {
          '$match': {
            'userId': new mongoose.Types.ObjectId(userId),
            'txnType': 'Income'
          }
        }, {
          '$group': {
            '_id': null,
            'totIncome': {
              '$sum': '$amount'
            }
          }
        }
      ]
    console.log("/transactions/route.js IncomeResult:")
    const IncomeResult = await TransactionsModel.aggregate(Incomepipeline);
    console.log("/transactions/route.js IncomeResult:", IncomeResult);
    const totalIncome = IncomeResult[0].totIncome || 0;


    const Expensepipeline = [
      {
        '$match': {
          'userId': new mongoose.Types.ObjectId(userId),
          'txnType': 'Expense'
        }
      }, {
        '$group': {
          '_id': null,
          'totExpense': {
            '$sum': '$amount'
          }
        }
      }
    ]
    const ExpenseResult = await TransactionsModel.aggregate(Expensepipeline);
    console.log("/transactions/route.js ExpenseResult:", ExpenseResult);
    const totalExpense = ExpenseResult[0].totExpense || 0;

    const res = { txns, totalExpense, totalIncome };
    if (txns) {
      return NextResponse.json(res);
    }
  } catch (error) {
    return NextResponse.json({
      message: "api/transactions/route.js error",
      error: error.message,
    });
  }
}

export async function POST(request) {
  const authHeader = request.headers.get("authorization");
  console.log("auth Header", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Not Authorized, No Token" },
      { status: 401 }
    );
  }
  const token = authHeader.split(" ")[1];
  console.log("token", token);

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;

  try {
    await connectDB();
    const body = await request.json();
    const { txnType, amount, category, description, date } = body;

    const txn = await TransactionsModel.create({
      userId: userId,
      txnType: txnType,
      amount: amount,
      category: category,
      description: description,
      date: date,
    });

    return NextResponse.json(
      { message: "Transaction Created Successfully", txn },
      { status: 201 }
    );
  } catch (error) {
    return Response.json({ message: "Server Error", error: error.message });
  }
}
