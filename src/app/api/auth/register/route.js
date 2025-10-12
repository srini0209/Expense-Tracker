import connectDB from "../../../../utils/dbConnect.js";
import UserModel from "../../../../../models/UserModel.js";
import CategoriesModel from "../../../../../models/CategoriesModel.js";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { sanitizeInput } from "../../../../utils/sanitizeInput.js";

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
    const cleanData = sanitizeInput(body);
    const { name, email, password } = cleanData;

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
      emailVerified: false,
    });

    const defaultCategories = [
      { type: "Income", name: "Salary" },
      { type: "Income", name: "Freelance" },
      { type: "Income", name: "Rental" },
      { type: "Expense", name: "Food" },
      { type: "Expense", name: "Transport" },
      { type: "Expense", name: "Rent" },
      { type: "Expense", name: "Bill Payments" },
      { type: "Expense", name: "Groceries" },
    ].map((cat) => ({ userId: user._id, ...cat }));
    const Categories = await CategoriesModel.insertMany(defaultCategories);

    const VerifyToken = jwt.sign({ email }, process.env.JWT_SECRET );

    // Create verification link
    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${VerifyToken}`;

    // 5. Send verification email
    const transporter = nodemailer.createTransport({
      service: "Gmail", // or SMTP config
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"FinTrack" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email",
      html: `<p>Hi ${name},</p>
           <p>Click below to verify your email:</p>
           <a href="${verifyUrl}">${verifyUrl}</a>`,
    });

    return NextResponse.json(
      {
        message: "User Registered Successfully, check your email to verify.",
        data: {
          userId: user._id,
          name: user.name,
          email: user.email,
          profileImage: user.profileImage,
          createdAt: user.createdAt,
          token: generateToken(user._id),
          categories: Categories,
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
