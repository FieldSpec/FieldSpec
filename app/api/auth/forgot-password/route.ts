import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { forgotPassword } from "@/services/auth/auth.service";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = forgotPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: { message: result.error.issues[0].message, code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const { email } = result.data;
    await forgotPassword(email);

    return NextResponse.json(
      { data: { message: "If an account exists with this email, a password reset link has been sent." } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password route error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
