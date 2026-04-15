"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || "Signup failed");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setLoading(false);
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="w-full max-w-[400px] p-lg bg-surface rounded-md shadow-level-2 text-center">
        <div className="text-[48px] mb-md text-primary">
          ✉
        </div>
        <h1 className="text-on-surface mb-xs text-headline-small">
          Check Your Email
        </h1>
        <p className="text-on-surface-variant mb-lg text-body-medium">
          We&apos;ve sent a verification link to your email address.
        </p>
        <Link 
          href="/login" 
          className="inline-block px-lg py-md bg-primary text-on-primary no-underline rounded-sm text-label-large"
        >
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[400px] p-lg bg-surface rounded-md shadow-level-2">
      <h1 className="text-center mb-xs text-on-surface text-headline-small">
        Create Account
      </h1>
      <p className="text-center mb-lg text-on-surface-variant text-body-medium">
        Get started with FieldSpec
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-md">
          <label className="block mb-xs text-on-surface text-label-medium">
            Name <span className="text-primary">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full box-border px-md py-sm border border-outline rounded-sm bg-surface text-on-surface focus:outline-primary text-body-medium"
          />
        </div>

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
            minLength={8}
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
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <div className="mt-md text-center text-on-surface-variant text-body-small">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
