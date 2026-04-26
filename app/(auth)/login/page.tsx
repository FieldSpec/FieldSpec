"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || "Login failed");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[400px] p-lg bg-surface rounded-md">
      <h1 className="text-center mb-xs text-on-surface tracking-normal" style={{ fontSize: "28px", fontWeight: "600", lineHeight: "36px" }}>
        Welcome Back
      </h1>
      <p className="text-center mb-lg text-on-surface-variant text-body-medium">
        Sign in to your account
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-md">
          <label className="block mb-xs text-on-surface text-label-medium">
            Email <span className="text-primary">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full box-border px-md py-sm border border-outline rounded-sm bg-surface text-on-surface focus:outline-primary text-body-medium"
          />
        </div>

        <div className="mb-lg">
          <div className="flex justify-between mb-xs">
            <label className="text-on-surface text-label-medium">
              Password <span className="text-primary">*</span>
            </label>
            <Link href="/forgot-password" className="text-primary text-label-small" style={{ textDecoration: "none" }}>
              Forgot Password?
            </Link>
          </div>
          <div 
            className="flex items-center border border-outline rounded-sm"
            style={{ 
              borderColor: "var(--sys-outline)",
              transition: "border-color 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--sys-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--sys-outline)";
            }}
          >
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="flex-1 box-border px-md py-sm border-none text-on-surface focus:outline-none text-body-medium bg-transparent"
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

        {error && (
          <div className="p-md bg-error-container text-on-error-container rounded-sm mb-md text-body-small">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
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
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="my-md flex items-center">
        <div className="flex-1 h-px bg-outline" style={{ height: "0.5px" }}></div>
        <span className="px-sm text-on-surface-variant text-label-medium">or</span>
        <div className="flex-1 h-px bg-outline" style={{ height: "0.5px" }}></div>
      </div>

      <button
        type="button"
        onClick={() => window.location.href = "/api/auth/oauth/google"}
        className="w-full flex items-center justify-center gap-sm py-sm px-md border border-outline rounded-sm bg-surface hover:bg-surface-variant transition-colors"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        <span className="text-on-surface text-label-large">Continue with Google</span>
      </button>

      <div className="mt-md text-center text-on-surface-variant text-body-small">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary" style={{ textDecoration: "none" }}>
          Sign up
        </Link>
      </div>
    </div>
  );
}