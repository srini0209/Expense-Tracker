import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import userModel from "../models/UserModel.js";

export default async function middleware(request) {
    try {
        let token = request.headers.get("authorization");
        if (token && token.startsWith("Bearer")) {
            token = token.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            request.user = await userModel.findById(decoded.id).select("-password");  // assigning user Object in request
            console.log("middleware request.user:", request.user);

        } else {
            return NextResponse.json({ message: "Ullae vara anumathi illai" }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ message: "Token Failed", error: error.message });
    }
}

export const config = {
    matcher: ['/transactions/:path']
}