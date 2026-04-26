"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LoadingCard } from "@/lib/components/loading";

export default function ResetPasswordPage() {
  const [status, setStatus] = useState<"loading" | "form" | "success" | "error">("loading");
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Missing reset token");
      return;
    }

    const timer = setTimeout(() => {
      setStatus("form");
    }, 800);

    return () => clearTimeout(timer);
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (!hasMinLength || !hasUppercase || !hasNumber || !hasSpecial) {
      setError("Please meet all password requirements");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || "Failed to reset password");
        setLoading(false);
        return;
      }

      setStatus("success");
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="w-full max-w-[400px] p-lg bg-surface rounded-md">
        <LoadingCard />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="w-full max-w-[400px] p-lg bg-surface rounded-md">
        <div className="text-center">
          <div className="mb-md text-4xl">✕</div>
          <h1 className="text-center mb-xs text-on-surface tracking-normal" style={{ fontSize: "28px", fontWeight: "600", lineHeight: "36px" }}>
            Invalid Link
          </h1>
          <p className="text-center mb-lg text-on-surface-variant text-body-medium">
            {message}
          </p>
          <Link href="/forgot-password" className="text-primary text-body-medium">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  if (status === "success") {
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
            Password Reset
          </h1>
          <p className="text-center mb-lg text-on-surface-variant text-body-medium">
            Your password has been reset successfully.
          </p>
          <Link href="/login" className="text-primary text-body-medium">
            Go to Login
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
        Enter your new password
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-md">
          <label className="block mb-xs text-on-surface text-label-medium">
            New Password <span className="text-primary">*</span>
          </label>
          <div 
            className="flex items-center border rounded-sm"
            style={{ 
              borderColor: error ? "var(--sys-error)" : "var(--sys-outline)",
              transition: "border-color 0.2s ease",
              width: "352px",
              height: "37.6px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = error ? "var(--sys-error)" : "var(--sys-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = error ? "var(--sys-error)" : "var(--sys-outline)";
            }}
          >
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              className="flex-1 box-border px-md py-sm border-none text-on-surface focus:outline-none text-body-medium bg-transparent"
              style={{ 
                backgroundColor: "transparent",
                outline: "none",
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="px-sm py-sm cursor-pointer flex items-center justify-center bg-transparent border-none"
              style={{ color: "var(--sys-outline)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--sys-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--sys-outline)";
              }}
            >
              <span className="material-icons" style={{ fontSize: "16px" }}>
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        <div className="mb-md">
          <label className="block mb-xs text-on-surface text-label-medium">
            Confirm Password <span className="text-primary">*</span>
          </label>
          <div 
            className="flex items-center border rounded-sm"
            style={{ 
              borderColor: error ? "var(--sys-error)" : "var(--sys-outline)",
              transition: "border-color 0.2s ease",
              width: "352px",
              height: "37.6px",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = error ? "var(--sys-error)" : "var(--sys-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = error ? "var(--sys-error)" : "var(--sys-outline)";
            }}
          >
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError("");
              }}
              className="flex-1 box-border px-md py-sm border-none text-on-surface focus:outline-none text-body-medium bg-transparent"
              style={{ 
                backgroundColor: "transparent",
                outline: "none",
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="px-sm py-sm cursor-pointer flex items-center justify-center bg-transparent border-none"
              style={{ color: "var(--sys-outline)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--sys-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--sys-outline)";
              }}
            >
              <span className="material-icons" style={{ fontSize: "16px" }}>
                {showConfirmPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {error && (
          <p className="mb-xs text-error text-label-small">{error}</p>
        )}

        {isPasswordFocused && (
          <div className="mb-md text-on-surface-variant text-label-small flex flex-col gap-1">
            {password.length < 8 && <span>• Must be at least 8 characters</span>}
            {!/[A-Z]/.test(password) && <span>• Must contain at least an uppercase letter</span>}
            {!/[0-9]/.test(password) && <span>• Must contain at least one number</span>}
            {!/[!@#$%^&*(),.?":{}|<>]/.test(password) && <span>• Must include a special character</span>}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="p-md bg-primary text-on-primary rounded-sm cursor-pointer disabled:cursor-not-allowed disabled:opacity-70 text-label-large"
          style={{ width: "352px", transition: "all 0.2s ease", border: "none", textDecoration: "none" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "var(--sys-primary-container)";
            e.currentTarget.style.color = "var(--sys-on-primary-container)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "var(--sys-primary)";
            e.currentTarget.style.color = "var(--sys-on-primary)";
          }}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}