import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { signup } from "@/services/auth/auth.service";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1, "Name is required"),
  companyName: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = signupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: { message: result.error.issues[0].message, code: "VALIDATION_ERROR" } },
        { status: 400 }
      );
    }

    const { email, password, name, companyName } = result.data;
    const signupResult = await signup(email, password, name, companyName);

    if (!signupResult.success) {
      return NextResponse.json(
        { error: { message: signupResult.error, code: "SIGNUP_FAILED" } },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { data: { message: "Account created. Please check your email to verify your account." } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup route error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
