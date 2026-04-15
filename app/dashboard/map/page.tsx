"use client";

import { tokens } from "@/lib/design-tokens";

export default function MapPage() {
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
          Map
        </h2>
        <p
          style={{
            ...tokens.typography.bodyMedium,
            color: tokens.colors.onSurfaceVariant,
            marginTop: tokens.spacing.xs,
          }}
        >
          View field locations on map
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
          Map view coming soon.
        </p>
      </div>
    </div>
  );
}