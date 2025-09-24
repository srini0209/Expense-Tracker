import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(request) {
  console.log(`middleware executed at ${request.url}`);
  const token = request.cookies.get("AuthToken")?.value;

  console.log("middleware Token", token);
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  let userId;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("middleware.js decoded token", decoded);
    userId = decoded.id;
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      console.log("Token is expired");
      return NextResponse.redirect(new URL("/login", request.url));
    } else if (err.name === "JsonWebTokenError") {
      console.log("Invalid token");
      return NextResponse.redirect(new URL("/login", request.url));
    } else {
      console.log("Error verifying token:", err);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/transactions/:path*", "/dashboard/:path*", "/categories/:path*"],
};
