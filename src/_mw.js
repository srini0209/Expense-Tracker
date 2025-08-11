import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
// import userModel from "../models/UserModel.js";

export default async function middleware(request) {
  try {
    let token = request.headers.get("Authorization");
    console.log("middleware token:", token);

    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //   console.log("middleware request.user:", request.user);
      const reqHeaders = new Headers(request.headers);
      reqHeaders.set("user-id", decoded.id);
      return NextResponse.next({
        request: { headers: reqHeaders },
      });
    } else {
      return NextResponse.json(
        { message: "Ullae vara anumathi illai" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json({ message: "Token Failed", error: error.message });
  }
}

export const config = {
  matcher: ["/transactions/:path*", "/api/transactions/:path*"],
};
