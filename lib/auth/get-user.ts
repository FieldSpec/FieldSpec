import { NextRequest } from "next/server";
import { verifyJWT, JWTPayload } from "./jwt";

export function getUserFromRequest(request: NextRequest): JWTPayload | null {
  const token = request.cookies.get("auth_token")?.value;
  if (!token) return null;
  return verifyJWT(token);
}

export function getUserIdFromRequest(request: NextRequest): string | null {
  const user = getUserFromRequest(request);
  return user?.userId || null;
}