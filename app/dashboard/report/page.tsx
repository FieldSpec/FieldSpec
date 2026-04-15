"use client";

import { tokens } from "@/lib/design-tokens";

export default function ReportPage() {
  return (
    <div
      style={{
        padding: tokens.spacing.lg,
        maxWidth: "1200px",
      }}
    >
      <div
        style={{
          marginBottom: tokens.spacing.xl,
        }}
      >
        <h2
          style={{
            ...tokens.typography.headlineMedium,
            color: tokens.colors.onSurface,
          }}
        >
          Report
        </h2>
        <p
          style={{
            ...tokens.typography.bodyMedium,
            color: tokens.colors.onSurfaceVariant,
            marginTop: tokens.spacing.xs,
          }}
        >
          Generate and manage field inspection reports
        </p>
      </div>

      <div
        style={{
          padding: tokens.spacing.xl,
          backgroundColor: tokens.colors.surface,
          borderRadius: "12px",
          boxShadow: tokens.elevation.level1,
          textAlign: "center",
        }}
      >
        <p
          style={{
            ...tokens.typography.bodyLarge,
            color: tokens.colors.onSurfaceVariant,
          }}
        >
          Report generation coming soon.
        </p>
      </div>
    </div>
  );
}