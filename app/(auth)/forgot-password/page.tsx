"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const isValidEmail = validateEmail(email);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          setError("This email is not associated with any account");
        } else {
          setError(data.error?.message || "Failed to send reset link");
        }
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-[400px] p-lg bg-surface rounded-md">
        <div className="text-center">
          <div 
            className="mb-md rounded-full inline-flex items-center justify-center"
            style={{ 
              width: "64px", 
              height: "64px", 
              backgroundColor: "var(--sys-primary)",
              color: "var(--sys-on-primary)",
            }}
          >
            <span className="material-icons" style={{ fontSize: "32px" }}>check</span>
          </div>
          <h1 className="text-center mb-xs text-on-surface tracking-normal" style={{ fontSize: "28px", fontWeight: "600", lineHeight: "36px" }}>
            Check Your Email
          </h1>
          <p className="text-center mb-lg text-on-surface-variant text-body-medium">
            We&apos;ve sent a password reset link to your email address.
          </p>
          <Link
            href="/login"
            className="text-primary text-body-medium"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[400px] p-lg bg-surface rounded-md">
      <h1 className="text-center mb-xs text-on-surface tracking-normal" style={{ fontSize: "28px", fontWeight: "600", lineHeight: "36px" }}>
        Reset Password
      </h1>
      <p className="text-center mb-lg text-on-surface-variant text-body-medium">
        Enter your email to receive a password reset link
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-md">
          <label className="block mb-xs text-on-surface text-label-medium">
            Email <span className="text-primary">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            className="w-full box-border px-md py-sm border rounded-sm text-on-surface focus:outline-primary text-body-medium bg-transparent"
            style={{ 
              borderColor: error ? "var(--sys-error)" : "var(--sys-outline)",
              transition: "border-color 0.2s ease",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = error ? "var(--sys-error)" : "var(--sys-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = error ? "var(--sys-error)" : "var(--sys-outline)";
            }}
          />
          {error && (
            <p className="mt-xs text-error text-label-small">{error}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !isValidEmail}
          className="w-full p-md bg-primary text-on-primary rounded-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 text-label-large"
          style={{ transition: "background-color 0.2s ease, transform 0.2s ease", border: "none", textDecoration: "none" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--sys-add-on-primary-fixed)";
            e.currentTarget.style.color = "var(--sys-primary)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--sys-primary)";
            e.currentTarget.style.color = "var(--sys-on-primary)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
          }}
          onFocus={(e) => {
            e.currentTarget.style.outline = "none";
          }}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>

      <div className="mt-md text-center text-on-surface-variant text-body-small">
        Remember your password?{" "}
        <Link href="/login" className="text-primary">
          Sign in
        </Link>
      </div>
    </div>
  );
}