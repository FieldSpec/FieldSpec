import { tokens } from "@/lib/design-tokens";

export default function DashboardPage() {
  return (
    <div style={{ 
      padding: tokens.spacing.lg,
      backgroundColor: tokens.colors.surface,
      minHeight: "100vh",
    }}>
      <h1 style={{ 
        ...tokens.typography.headlineMedium,
        color: tokens.colors.onSurface, 
        marginBottom: tokens.spacing.lg,
      }}>
        Dashboard
      </h1>
      <p style={{ 
        ...tokens.typography.bodyLarge,
        color: tokens.colors.onSurface,
      }}>
        Welcome to your dashboard. This is a protected route.
      </p>
      <p style={{ 
        ...tokens.typography.bodyMedium,
        marginTop: tokens.spacing.md,
        color: tokens.colors.onSurfaceVariant,
      }}>
        Dashboard features coming soon...
      </p>
    </div>
  );
}
