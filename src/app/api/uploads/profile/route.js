import { writeFile, mkdir } from "fs/promises";
import { NextResponse } from "next/server";
import { join } from "path";

export async function POST(request) {
  const data = await request.formData();
  const file = data.get("file");
  console.log("file:", file);

  try {
    if (!file) {
      return NextResponse.json({ message: "No file found" });
    }

    const bytes = await file.arrayBuffer();
    console.log("bytes:", bytes);
    const buffer = Buffer.from(bytes);
    console.log("buffer:", buffer);

    const uploadDir = join(process.cwd(), "public", "uploads", "profileImages");
    await mkdir(uploadDir, { recursive: true });

    const fileName =
      Date.now() + "-ProfileImage-" + file.name.replace(" ", "-");
    const filePath = join(uploadDir, fileName);
    console.log("filePath:", filePath);

    await writeFile(filePath, buffer);

    return NextResponse.json(
      {
        message: "File Upload success",
        imageUrl: `/public/uploads/profileImages/${fileName}`,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: "error on uploading image - /upload/profile/route.js",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
