import { NextResponse } from "next/server";
import customMiddleware from "../../../customMiddleware.js";
import connectDB from "../../../../utils/dbConnect.js";
import userModel from "../../../../../models/UserModel.js";
import jwt from 'jsonwebtoken'

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
    await connectDB();
    const user = await userModel.findById(userId).select("-password").lean();
    console.log("api/auth/user/route.js user:", user);
    if (!user) {
      return NextResponse.json({ message: "User Not FOund" }, { status: 404 });
    }
    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      message: "api/auth/user/route.js Error on getting user profile",
      error: error.message,
    }, { status: 500 });
  }
}
