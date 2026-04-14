import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { resetPassword } from "@/services/auth/auth.service";

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = resetPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: { message: result.error.issues[0].message, code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const { token, newPassword } = result.data;
    const resetResult = await resetPassword(token, newPassword);

    if (!resetResult.success) {
      return NextResponse.json(
        { error: { message: resetResult.error, code: "RESET_FAILED" } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { data: { message: "Password reset successfully" } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Reset password route error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
