import Link from "next/link";
import { tokens } from "@/lib/design-tokens";

export default function MarketingPage() {
  return (
    <main style={{ flex: 1 }}>
      <nav style={{ 
        padding: `${tokens.spacing.md} ${tokens.spacing.lg}`, 
        borderBottom: `1px solid ${tokens.colors.outline}`,
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        backgroundColor: tokens.colors.surface,
      }}>
        <h1 style={{ 
          ...tokens.typography.titleLarge,
          color: tokens.colors.primary,
        }}>
          FieldSpec
        </h1>
        <div style={{ display: "flex", gap: tokens.spacing.md }}>
          <Link 
            href="/login" 
            style={{ 
              ...tokens.typography.labelLarge,
              color: tokens.colors.onSurface, 
              textDecoration: "none",
            }}
          >
            Login
          </Link>
          <Link 
            href="/signup" 
            style={{ 
              ...tokens.typography.labelLarge,
              color: tokens.colors.onSurface, 
              textDecoration: "none",
            }}
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <section style={{ 
        padding: `${tokens.spacing.xxl} ${tokens.spacing.lg}`, 
        textAlign: "center", 
        backgroundColor: tokens.colors.surfaceVariant,
      }}>
        <h2 style={{ 
          ...tokens.typography.displayLarge,
          color: tokens.colors.onSurface,
          marginBottom: tokens.spacing.md,
        }}>
          Market Intelligence<br />Made Simple
        </h2>
        <p style={{ 
          ...tokens.typography.bodyLarge,
          color: tokens.colors.onSurfaceVariant, 
          maxWidth: "600px", 
          margin: `0 auto ${tokens.spacing.lg}`,
        }}>
          Capture field data, generate AI-powered insights, and create professional reports in minutes.
        </p>
        <div style={{ display: "flex", gap: tokens.spacing.md, justifyContent: "center" }}>
          <Link 
            href="/signup" 
            style={{ 
              padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
              backgroundColor: tokens.colors.primary, 
              color: tokens.colors.onPrimary, 
              textDecoration: "none", 
              borderRadius: "8px",
              ...tokens.typography.labelLarge,
            }}
          >
            Get Started
          </Link>
          <Link 
            href="/login" 
            style={{ 
              padding: `${tokens.spacing.md} ${tokens.spacing.lg}`,
              backgroundColor: tokens.colors.surface, 
              color: tokens.colors.onSurface, 
              textDecoration: "none", 
              borderRadius: "8px",
              border: `1px solid ${tokens.colors.outline}`,
              ...tokens.typography.labelLarge,
            }}
          >
            Login
          </Link>
        </div>
      </section>

      <section style={{ padding: `${tokens.spacing.xl} ${tokens.spacing.lg}` }}>
        <h3 style={{ 
          ...tokens.typography.headlineMedium,
          color: tokens.colors.onSurface,
          textAlign: "center", 
          marginBottom: `${tokens.spacing.xxl}`,
        }}>
          Features
        </h3>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
          gap: tokens.spacing.lg, 
          maxWidth: "1000px", 
          margin: "0 auto" 
        }}>
          {[
            { title: "Image Capture", desc: "Upload and organize field photos with GPS metadata" },
            { title: "AI Insights", desc: "Get automated findings and recommendations" },
            { title: "Reports", desc: "Generate and export professional reports" },
          ].map((feature, i) => (
            <div 
              key={i} 
              style={{ 
                padding: tokens.spacing.lg, 
                border: `1px solid ${tokens.colors.outlineVariant}`, 
                borderRadius: "8px",
                backgroundColor: tokens.colors.surface,
              }}
            >
              <h4 style={{ 
                ...tokens.typography.titleMedium,
                color: tokens.colors.onSurface, 
                marginBottom: tokens.spacing.sm,
              }}>
                {feature.title}
              </h4>
              <p style={{ 
                ...tokens.typography.bodyMedium,
                color: tokens.colors.onSurfaceVariant,
              }}>
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ 
        padding: `${tokens.spacing.xl} ${tokens.spacing.lg}`, 
        backgroundColor: tokens.colors.surfaceVariant,
      }}>
        <h3 style={{ 
          ...tokens.typography.headlineMedium,
          color: tokens.colors.onSurface,
          textAlign: "center", 
          marginBottom: `${tokens.spacing.xxl}`,
        }}>
          How It Works
        </h3>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          {[
            "Create a project",
            "Upload your field photos",
            "Generate AI-powered report",
          ].map((step, i) => (
            <div 
              key={i} 
              style={{ 
                marginBottom: tokens.spacing.lg,
                display: "flex",
                alignItems: "center",
              }}
            >
              <span style={{ 
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px", 
                height: "32px", 
                backgroundColor: tokens.colors.primary, 
                color: tokens.colors.onPrimary, 
                borderRadius: "50%",
                marginRight: tokens.spacing.md,
                ...tokens.typography.labelLarge,
              }}>
                {i + 1}
              </span>
              <span style={{ 
                ...tokens.typography.bodyLarge,
                color: tokens.colors.onSurface,
              }}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ 
        padding: tokens.spacing.lg, 
        textAlign: "center", 
        borderTop: `1px solid ${tokens.colors.outlineVariant}`,
        ...tokens.typography.bodyMedium,
        color: tokens.colors.onSurfaceVariant,
      }}>
        <p>FieldSpec - Market Intelligence Platform</p>
      </footer>
    </main>
  );
}
