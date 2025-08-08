import connectDB from "../../../../utils/dbConnect.js";
import TransactionsModel from "../../../../models/TransactionsModel.js";
import { NextResponse } from "next/server.js";
import jwt from 'jsonwebtoken';

export async function GET(request) {
    // const authHeader = request.headers.get("authorization");
    // console.log("auth Header", authHeader);

    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //     return NextResponse.json({ message: "Not Authorized, No Token" }, { status: 401 })
    // }
    // const token = authHeader.split(' ')[1]
    // console.log("token", token);


    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const userId = decoded.id;
    console.log("api/transactions/route.js request.user:", request.user);


    try {
        await connectDB();
        const txns = await TransactionsModel.find({ userId: request.user._id });
        if (txns) {
            return NextResponse.json(txns);
        }
    } catch (error) {
        return NextResponse.json({ message: "api/transactions/route.js error", error: error.message });
    }

}

export async function POST(request) {

    const authHeader = request.headers.get("authorization");
    console.log("auth Header", authHeader);

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ message: "Not Authorized, No Token" }, { status: 401 })
    }
    const token = authHeader.split(' ')[1]
    console.log("token", token);


    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    try {
        await connectDB();
        const body = await request.json();
        const {
            txnType,
            amount,
            category,
            description,
            date } = body;

        const txn = await TransactionsModel.create({
            userId: userId,
            txnType: txnType,
            amount: amount,
            category: category,
            description: description,
            date: date,
        })

        return NextResponse.json({ message: "Transaction Created Successfully", txn }, { status: 201 })
    } catch (error) {
        return Response.json({ message: "Server Error", error: error.message });
    }
}
