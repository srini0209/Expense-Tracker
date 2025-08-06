import multer from "multer";
import nextConnect from "next-connect";
import { NextResponse } from "next/server";
export async function POST(request, response) {
  // Configuring multer for file upload
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "/public/uploads/profile"); // Folder where files will be stored
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-ProfileImage-" + file.originalname); // Adding timestamp prefix to prevent FileName conflict
    },
  });

  // File filter to restrict to only image files (jpg, jpeg, png, gif)
  const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];

    // If the file's mime type is not in the allowed types, return an error
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(
        new Error("Invalid file type. Only images are allowed."),
        false
      );
    }

    // Otherwise, accept the file
    cb(null, true);
  };

  const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limits the file size to 5MB
  });

  // Initialize nextConnect to handle middleware and routes
  const handler = nextConnect();

  //use multer to handle single file upload
  handler.use(upload.single("file")); // 'file' is the name of the form field

  if (!request.file) {
    return NextResponse.json({ error: "No File Uploaded" }, { status: 400 });
  }

  return NextResponse.json(
    { message: "File Uploaded Successfully", file: request.file },
    { status: 200 }
  );
}
