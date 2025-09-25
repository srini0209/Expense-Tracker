import connectDB from "../../../../utils/dbConnect.js";
import CategoriesModel from "../../../../models/CategoriesModel.js";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server.js";

export async function GET(request) {
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
    const categories = await CategoriesModel.find({ userId: userId }).lean();
    if (categories) {
      return NextResponse.json(categories);
    }
  } catch (error) {
    return NextResponse.json({ message: error.message });
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
    let budget;
    const body = await request.json();
    const { type, name } = body;
    const recordToCreate = { userId: userId, type: type, name: name.trim().toLowerCase() };
    if (body.budget && body.budget > 0) {
      recordToCreate.budget = body.budget;
    }
    const exists = await CategoriesModel.findOne({ userId: userId, type: type, name: name.trim().toLowerCase() });
    if (exists) {
      return NextResponse.json(
        { message: "Category Already Exists" },
        { status: 400 }
      );
    }

    const category = await CategoriesModel.create(recordToCreate);
    return NextResponse.json(
      { message: "Category Created Successfully", category },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server Error", error: error.message },
      { status: 500 }
    );
  }
}
