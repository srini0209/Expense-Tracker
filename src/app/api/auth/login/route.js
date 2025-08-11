import connectDB from "../../../../../utils/dbConnect.js";
import UserModel from "../../../../../models/UserModel.js";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "3d" });
};
export async function POST(request) {
  try {
    await connectDB();

    const body = await request.json();

    const { email, password } = body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "Invalid Credentials" },
        { status: 401 }
      );
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return NextResponse.json(
        { message: "Invalid Credentials" },
        { status: 401 }
      );
    }
    return NextResponse.json(
      {
        userId: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
        token: generateToken(user._id),
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Unknown Error! Try again later", error: error.message },
      { status: 500 }
    );
  }
}