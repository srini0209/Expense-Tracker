import { NextResponse } from "next/server";
import dbConnect from "../../../../utils/dbConnect";
import userModel from "../../../../../models/UserModel";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

// POST request to initiate the password reset process
export async function POST(request) {
  await dbConnect();

  try {
    const { email } = await request.json();
    console.log("resetpassword:", email);
    const user = await userModel.findOne({ email });

    if (!user) {
      // To prevent user enumeration, always return a success-like message.
      return NextResponse.json(
        {
          message:
            "If your email is registered, you will receive a password reset link.",
        },
        { status: 200 }
      );
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash the token and set it on the user model
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set token expiration to 1 hour from now
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();

    // Construct the reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    // Email options
    const mailOptions = {
      from: `"FinTrack" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
        <p>Please click on the following link, or paste it into your browser to complete the process:</p>
        <a href="${resetUrl}">${resetUrl}</a>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <p>This link will expire in 1 hour.</p>
      `,
    };

    // Send the email
    try {
      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error("Email send error:", error);
    }

    return NextResponse.json(
      {
        message:
          "If your email is registered, you will receive a password reset link.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password Reset Request Error:", error);
    // In case of an error, we should ideally not leak information.
    // The generic message is safer.
    return NextResponse.json(
      {
        message:
          "If your email is registered, you will receive a password reset link.",
      },
      { status: 200 }
    );
  }
}

// PUT request to reset the password using the token
export async function PUT(request) {
  await dbConnect();

  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Invalid request. Token and password are required." },
        { status: 400 }
      );
    }

    // Hash the incoming token to match the one stored in the DB
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    // Find the user by the hashed token and check if the token has not expired
    const user = await userModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired password reset token." },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user's password
    user.password = hashedPassword;
    // Clear the reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return NextResponse.json(
      { message: "Password has been reset successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password Reset Error:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
