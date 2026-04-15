"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { tokens } from "@/lib/design-tokens";

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Missing verification token");
      return;
    }

    fetch(`/api/auth/verify-email?token=${token}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setStatus("success");
          setMessage(data.data.message || "Email verified successfully");
        } else {
          setStatus("error");
          setMessage(data.error?.message || "Verification failed");
        }
      })
      .catch(() => {
        setStatus("error");
        setMessage("Something went wrong");
      });
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: tokens.spacing.lg,
        backgroundColor: tokens.colors.surface,
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          width: "100%",
          padding: tokens.spacing.xl,
          backgroundColor: tokens.colors.surface,
          borderRadius: tokens.radius.lg,
          boxShadow: tokens.elevation.level1,
          textAlign: "center",
        }}
      >
        {status === "loading" && (
          <>
            <div
              style={{
                fontSize: "48px",
                marginBottom: tokens.spacing.md,
              }}
            >
              ⏳
            </div>
            <p
              style={{
                ...tokens.typography.bodyLarge,
                color: tokens.colors.onSurface,
              }}
            >
              Verifying your email...
            </p>
          </>
        )}

        {status === "success" && (
          <>
            <div
              style={{
                fontSize: "48px",
                marginBottom: tokens.spacing.md,
              }}
            >
              ✓
            </div>
            <h1
              style={{
                ...tokens.typography.headlineSmall,
                color: tokens.colors.onSurface,
                marginBottom: tokens.spacing.md,
              }}
            >
              Email Verified
            </h1>
            <p
              style={{
                ...tokens.typography.bodyMedium,
                color: tokens.colors.onSurfaceVariant,
                marginBottom: tokens.spacing.lg,
              }}
            >
              {message}
            </p>
            <Link
              href="/login"
              style={{
                display: "inline-block",
                padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
                backgroundColor: tokens.colors.primary,
                color: tokens.colors.onPrimary,
                textDecoration: "none",
                borderRadius: tokens.radius.md,
                ...tokens.typography.labelLarge,
              }}
            >
              Go to Login
            </Link>
          </>
        )}

        {status === "error" && (
          <>
            <div
              style={{
                fontSize: "48px",
                marginBottom: tokens.spacing.md,
              }}
            >
              ✕
            </div>
            <h1
              style={{
                ...tokens.typography.headlineSmall,
                color: tokens.colors.onSurface,
                marginBottom: tokens.spacing.md,
              }}
            >
              Verification Failed
            </h1>
            <p
              style={{
                ...tokens.typography.bodyMedium,
                color: tokens.colors.onSurfaceVariant,
                marginBottom: tokens.spacing.lg,
              }}
            >
              {message}
            </p>
            <Link
              href="/signup"
              style={{
                display: "inline-block",
                padding: `${tokens.spacing.sm} ${tokens.spacing.lg}`,
                backgroundColor: tokens.colors.primary,
                color: tokens.colors.onPrimary,
                textDecoration: "none",
                borderRadius: tokens.radius.md,
                ...tokens.typography.labelLarge,
              }}
            >
              Sign Up Again
            </Link>
          </>
        )}
      </div>
    </div>
  );
}