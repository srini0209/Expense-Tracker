import connectDB from "../../../../utils/dbConnect.js";
import TransactionsModel from "../../../../models/TransactionsModel.js";
import { NextResponse } from "next/server.js";

export async function GET(req) {

    try {
        await connectDB();
        const txns = await TransactionsModel.find();
        if (txns) {
            return Response.json(txns);
        }
    } catch (error) {
        return Response.json({ message: error.message });
    }

}

export async function POST(request) {

    try {
        await connectDB();
        const body = await request.json();
        const {
            userId,
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
            createdAt: Date.now()
        })

        return NextResponse.json({ message: "Transaction Created Successfully", txn },{status: 201})
    } catch (error) {
        return Response.json({ message: "Server Error", error: error.message });
    }
}
