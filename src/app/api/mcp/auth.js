// Example: JWT verification; replace with real verification
import jwt from "jsonwebtoken";

export async function authenticate(req) {
  const auth =
    req.headers.get("authorization") || req.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const token = auth.slice("Bearer ".length).trim();
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { userId: decoded.id };
  } catch {
    return null;
  }
}
