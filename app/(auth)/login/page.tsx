"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { tokens } from "@/lib/design-tokens";

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

      localStorage.setItem("token", data.data.token);
      router.push("/dashboard");
    } catch {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  }

  const cardStyle: React.CSSProperties = {
    width: "100%", 
    maxWidth: "400px",
    padding: tokens.spacing.lg,
    backgroundColor: tokens.colors.surface,
    borderRadius: "8px",
    boxShadow: tokens.elevation.level2,
  };

  return (
    <div style={cardStyle}>
      <h1 style={{ 
        ...tokens.typography.headlineSmall,
        color: tokens.colors.onSurface, 
        marginBottom: tokens.spacing.xs, 
        textAlign: "center" 
      }}>
        Welcome Back
      </h1>
      <p style={{ 
        ...tokens.typography.bodyMedium,
        color: tokens.colors.onSurfaceVariant, 
        marginBottom: tokens.spacing.lg, 
        textAlign: "center" 
      }}>
        Sign in to your account
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: tokens.spacing.md }}>
          <label style={{ 
            display: "block", 
            marginBottom: tokens.spacing.xs, 
            ...tokens.typography.labelMedium,
            color: tokens.colors.onSurface,
          }}>
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ 
              width: "100%", 
              padding: `${tokens.spacing.sm} ${tokens.spacing.md}`, 
              border: `1px solid ${tokens.colors.outline}`, 
              borderRadius: "6px",
              ...tokens.typography.bodyMedium,
              backgroundColor: tokens.colors.surface,
              color: tokens.colors.onSurface,
            }}
          />
        </div>

        <div style={{ marginBottom: tokens.spacing.lg }}>
          <label style={{ 
            display: "block", 
            marginBottom: tokens.spacing.xs, 
            ...tokens.typography.labelMedium,
            color: tokens.colors.onSurface,
          }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ 
              width: "100%", 
              padding: `${tokens.spacing.sm} ${tokens.spacing.md}`, 
              border: `1px solid ${tokens.colors.outline}`, 
              borderRadius: "6px",
              ...tokens.typography.bodyMedium,
              backgroundColor: tokens.colors.surface,
              color: tokens.colors.onSurface,
            }}
          />
        </div>

        {error && (
          <div style={{ 
            padding: tokens.spacing.md, 
            backgroundColor: tokens.colors.errorContainer, 
            color: tokens.colors.onErrorContainer, 
            borderRadius: "6px",
            marginBottom: tokens.spacing.md,
            ...tokens.typography.bodySmall,
          }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{ 
            width: "100%", 
            padding: tokens.spacing.md,
            backgroundColor: tokens.colors.primary, 
            color: tokens.colors.onPrimary,
            border: "none",
            borderRadius: "6px",
            ...tokens.typography.labelLarge,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <div style={{ 
        marginTop: tokens.spacing.md, 
        textAlign: "center", 
        ...tokens.typography.bodySmall, 
        color: tokens.colors.onSurfaceVariant 
      }}>
        <Link href="/signup" style={{ color: tokens.colors.primary }}>
          Don&apos;t have an account? Sign up
        </Link>
      </div>
    </div>
  );
}
