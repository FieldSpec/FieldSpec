"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="w-full max-w-[400px] p-lg bg-surface rounded-md shadow-level-2">
      <h1 className="text-center mb-xs text-on-surface text-headline-small">
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
          <label className="block mb-xs text-on-surface text-label-medium">
            Password <span className="text-primary">*</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full box-border px-md py-sm border border-outline rounded-sm bg-surface text-on-surface focus:outline-primary text-body-medium"
          />
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
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
 
      <div className="mt-md text-center text-on-surface-variant text-body-small">
        <Link href="/signup" className="text-primary hover:underline">
          Don&apos;t have an account? Sign up
        </Link>
      </div>
    </div>
  );
}
