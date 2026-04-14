import { NextRequest } from "next/server";

export interface AuthUser {
  userId: string;
  email: string;
}

export function getAuthUser(request: NextRequest): AuthUser | null {
  const userId = request.headers.get("x-user-id");
  const email = request.headers.get("x-user-email");

  if (!userId || !email) {
    return null;
  }

  return { userId, email };
}

export function requireAuth(request: NextRequest): AuthUser {
  const user = getAuthUser(request);

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}
