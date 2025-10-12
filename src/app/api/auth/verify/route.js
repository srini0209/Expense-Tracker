import jwt from "jsonwebtoken";
import userModel from "../../../../../models/UserModel";
import { NextResponse } from "next/server";
import connectDB from "../../../../utils/dbConnect";

export async function GET(request, { params }) {
  try {
    const  token = request.nextUrl.searchParams.get("token");
    if (!token) {
      return NextResponse.json(
        { message: "Token is missing" },
        { status: 400 }
      );
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded: ", decoded);

    await connectDB();
    const user = await userModel.findOne({ email: decoded.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    user.emailVerified = true;
    await user.save();
    return NextResponse.json(
      { message: "Email Verified Successfully" },
      { status: 200 }
    );
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      console.log("Token is expired");
      return NextResponse.json({ message: "Token is expired" }, { status: 401 });
    } else if (error.name === "JsonWebTokenError") {
      console.log("Invalid token");
      return NextResponse.json({ message: "Invalid Token" }, { status: 400 });
    } else {
      console.log("Error verifying token:", error);
      return NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }
  }
}
