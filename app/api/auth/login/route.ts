import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { login } from "@/services/auth/auth.service";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: { message: result.error.issues[0].message, code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const loginResult = await login(email, password);

    if (!loginResult.success) {
      const statusCode = loginResult.error === "Please verify your email first" ? 403 : 401;
      return NextResponse.json(
        { error: { message: loginResult.error, code: "AUTH_FAILED" } },
        { status: statusCode }
      );
    }

    return NextResponse.json(
      { data: { token: loginResult.token } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
