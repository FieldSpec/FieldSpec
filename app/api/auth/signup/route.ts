import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { signup } from "@/services/auth/auth.service";
import { signupLimiter } from "@/lib/security/rate-limit";
import { passwordSchema } from "@/lib/security/validation";

const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: passwordSchema,
  name: z.string().min(1, "Name is required"),
  companyName: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const realIp = request.headers.get("x-real-ip");
    const ip = realIp || (forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown");
    const limit = await signupLimiter(ip);
    if (!limit.allowed) {
      console.error(`[Signup] Rate limited for IP: ${ip}`);
      return NextResponse.json(
        { error: { message: "Too many signup attempts. Please try again later.", code: "RATE_LIMITED" } },
        { status: 429, headers: { "Retry-After": String(Math.ceil(limit.retryAfterMs / 1000)) } }
      );
    }

    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch {
      console.error("[Signup] Invalid JSON in request body");
      return NextResponse.json(
        { error: { message: "Invalid request body", code: "INVALID_JSON" } },
        { status: 400 }
      );
    }

    const result = signupSchema.safeParse(body);

    if (!result.success) {
      const issues = result.error.issues.map((i) => ({ path: i.path.join("."), message: i.message }));
      console.error("[Signup] Validation errors:", JSON.stringify(issues));
      return NextResponse.json(
        { error: { message: result.error.issues[0].message, code: "VALIDATION_ERROR", details: issues } },
        { status: 400 }
      );
    }

    const { email, password, name, companyName } = result.data;
    console.log(`[Signup] Attempting signup for email: ${email}`);
    const signupResult = await signup(email, password, name, companyName);

    if (!signupResult.success) {
      console.error(`[Signup] Failed signup for ${email}: ${signupResult.error}`);
      const errorCode = signupResult.error === "Email already registered" ? "DUPLICATE_EMAIL" : "SIGNUP_FAILED";
      return NextResponse.json(
        { error: { message: signupResult.error, code: errorCode } },
        { status: 409 }
      );
    }

    console.log(`[Signup] Account created successfully for ${email}`);
    return NextResponse.json(
      { data: { message: "Account created. Please check your email to verify your account." } },
      { status: 201 }
    );
  } catch (error) {
    console.error("[Signup] Unhandled route error:", error);
    return NextResponse.json(
      { error: { message: "Internal server error", code: "INTERNAL_ERROR" } },
      { status: 500 }
    );
  }
}
