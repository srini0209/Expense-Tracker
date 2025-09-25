import mongoose from "mongoose";

// const connectDB = async () => mongoose.connect(process.env.MONGO_URI);
// /lib/mongodb.js (for App Router)

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) throw new Error("Missing MONGO_URI");

let cached = global.mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false })
      .then(mongoose => mongoose);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
if (process.env.NODE_ENV !== 'production') global.mongoose = cached;


export default connectDB;