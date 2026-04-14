import { NextRequest, NextResponse } from "next/server";
import { verifyEmail } from "@/services/auth/auth.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: { message: "Token is required", code: "MISSING_TOKEN" } },
        { status: 400 }
      );
    }

    const result = await verifyEmail(token);

    if (!result.success) {
      return NextResponse.json(
        { error: { message: result.error, code: "VERIFICATION_FAILED" } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { data: { message: "Email verified successfully" } },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verify email route error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
