import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { forgotPassword } from "@/services/auth/auth.service";
import { authLimiter } from "@/lib/security/rate-limit";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get("x-forwarded-for") || (request as any).ip || "unknown";
    const limit = await authLimiter(ip);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: { message: "Too many requests. Please try again later.", code: "RATE_LIMITED" } },
        { status: 429, headers: { "Retry-After": String(Math.ceil(limit.retryAfterMs / 1000)) } }
      );
    }

    const body = await request.json();
    const result = forgotPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: { message: result.error.issues[0].message, code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const { email } = result.data;
    const forgotPasswordResult = await forgotPassword(email);

    if (forgotPasswordResult.emailExists) {
      return NextResponse.json(
        { data: { message: "We have sent a reset link to your inbox." } },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: { message: "This email is not associated with any account.", code: "EMAIL_NOT_FOUND" } },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Forgot password route error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
