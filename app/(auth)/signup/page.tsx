"use client";

import { useState } from "react";
import Link from "next/link";
import { tokens } from "@/lib/design-tokens";

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

  const cardStyle: React.CSSProperties = {
    width: "100%", 
    maxWidth: "400px",
    padding: tokens.spacing.lg,
    backgroundColor: tokens.colors.surface,
    borderRadius: "8px",
    boxShadow: tokens.elevation.level2,
  };

  if (success) {
    return (
      <div style={{
        ...cardStyle,
        textAlign: "center",
      }}>
        <div style={{ 
          fontSize: "48px", 
          marginBottom: tokens.spacing.md,
          color: tokens.colors.primary,
        }}>
          ✉
        </div>
        <h1 style={{ 
          ...tokens.typography.headlineSmall,
          color: tokens.colors.onSurface, 
          marginBottom: tokens.spacing.xs,
        }}>
          Check Your Email
        </h1>
        <p style={{ 
          ...tokens.typography.bodyMedium,
          color: tokens.colors.onSurfaceVariant, 
          marginBottom: tokens.spacing.lg,
        }}>
          We&apos;ve sent a verification link to your email address.
        </p>
        <Link 
          href="/login" 
          style={{ 
            display: "inline-block",
            padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
            backgroundColor: tokens.colors.primary, 
            color: tokens.colors.onPrimary,
            textDecoration: "none",
            borderRadius: "6px",
            ...tokens.typography.labelLarge,
          }}
        >
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div style={cardStyle}>
      <h1 style={{ 
        ...tokens.typography.headlineSmall,
        color: tokens.colors.onSurface, 
        marginBottom: tokens.spacing.xs, 
        textAlign: "center" 
      }}>
        Create Account
      </h1>
      <p style={{ 
        ...tokens.typography.bodyMedium,
        color: tokens.colors.onSurfaceVariant, 
        marginBottom: tokens.spacing.lg, 
        textAlign: "center" 
      }}>
        Get started with FieldSpec
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: tokens.spacing.md }}>
          <label style={{ 
            display: "block", 
            marginBottom: tokens.spacing.xs, 
            ...tokens.typography.labelMedium,
            color: tokens.colors.onSurface,
          }}>
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
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
            minLength={8}
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
          {loading ? "Creating account..." : "Create Account"}
        </button>
      </form>

      <div style={{ 
        marginTop: tokens.spacing.md, 
        textAlign: "center", 
        ...tokens.typography.bodySmall, 
        color: tokens.colors.onSurfaceVariant 
      }}>
        Already have an account?{" "}
        <Link href="/login" style={{ color: tokens.colors.primary }}>
          Sign in
        </Link>
      </div>
    </div>
  );
}
