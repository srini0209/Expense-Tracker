import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export default function customMiddleware(request) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Not Authorized, No Token" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    // ✅ Added try-catch for JWT verification
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    return userId;
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid Token", error: error.message },
      { status: 401 }
    );
  }
}
