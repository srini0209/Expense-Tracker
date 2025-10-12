import connectDB from "../../../../../utils/dbConnect.js";
import CategoriesModel from "../../../../../../models/CategoriesModel.js";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server.js";
import { sanitizeInput } from "../../../../../utils/sanitizeInput.js";

export async function GET(request, { params }) {
  const { type } = await params;
  const sanitizedType = sanitizeInput(type);
  console.log(type);
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
    const categories = await CategoriesModel.find({
      type: sanitizedType,
      userId: userId,
    }).lean();
    if (categories) {
      return NextResponse.json(categories);
    }
  } catch (error) {
    return NextResponse.json({ message: error.message });
  }
}

// export async function PUT(request, { params }) {
//   const { id } = await params;
//   const authHeader = request.headers.get("authorization");
//   console.log("auth Header", authHeader);

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return NextResponse.json(
//       { message: "Not Authorized, No Token" },
//       { status: 401 }
//     );
//   }
//   const token = authHeader.split(" ")[1];
//   console.log("token", token);

//   const decoded = jwt.verify(token, process.env.JWT_SECRET);
//   const userId = decoded.id;

//   try {
//     await connectDB();
//     const data = await request.json();
//     // const { type, name } = body;

//     const category = await CategoriesModel.findByIdAndUpdate(id, data);
//     return NextResponse.json(
//       { message: "Category updated Successfully", category },
//       { status: 201 }
//     );
//   } catch (error) {
//     return NextResponse.json(
//       { message: "Server Error", error: error.message },
//       { status: 500 }
//     );
//   }
// }
