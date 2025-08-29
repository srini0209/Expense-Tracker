import connectDB from "../../../../../utils/dbConnect.js";
import UserModel from "../../../../../models/UserModel.js";
import CategoriesModel from "../../../../../models/CategoriesModel.js"
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "3d" });
};
export async function POST(request) {
  const authHeader = request.headers?.get("Authorization");
  const token = authHeader?.split(" ")[1];

  if (token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  try {
    await connectDB();

    const body = await request.json();

    const { name, email, password, profileImage } = body;

    const isUserExists = await UserModel.findOne({ email });
    if (isUserExists) {
      return NextResponse.json(
        { message: "User Already Exists" },
        { status: 400 }
      );
    }

    //Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user in DB
    const user = await UserModel.create({
      name: name,
      email: email,
      password: hashedPassword,
      // profileImage: profileImage,
      createdAt: Date.now(),
    });

    const defaultCategories = [
      { type: "Income", name: "Salary" },
      { type: "Income", name: "Dividend" },
      { type: "Income", name: "Rental" },
      { type: "Expense", name: "Food" },
      { type: "Expense", name: "Transport" },
      { type: "Expense", name: "Rent" },
      { type: "Expense", name: "Bill Payments" },
      { type: "Expense", name: "Groceries" },
    ].map((cat) => ({ userId: user._id, ...cat }))
    const Categories = await CategoriesModel.insertMany(defaultCategories);

    return NextResponse.json(
      {
        message: "User Registered Successfully",
        data: {
          userId: user._id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
          token: generateToken(user._id),
          categories:Categories
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Unknown Error", error: error.message },
      { status: 500 }
    );
  }
}
