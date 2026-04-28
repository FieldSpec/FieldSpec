import Link from "next/link";
import { tokens } from "@/lib/design-tokens";

const CheckIcon = () => (
  <svg
    className="w-5 h-5 shrink-0"
    style={{ color: tokens.colors.primary }}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

export const metadata = {
  title: "Pricing — FieldSpec",
  description:
    "Simple, transparent pricing for AI-powered field inspection reports. Choose the plan that fits your workflow.",
};

export default function PricingPage() {
  return (
    <main className="flex flex-col" style={{ backgroundColor: tokens.colors.background }}>
      {/* Header */}
      <section
        className="py-16 md:py-24"
        style={{ backgroundColor: tokens.colors.surfaceContainerLow }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1
            className="text-4xl md:text-5xl font-bold"
            style={{ color: tokens.colors.onSurface }}
          >
            Pricing
          </h1>
          <p
            className="mt-4 text-lg md:text-xl max-w-2xl mx-auto"
            style={{ color: tokens.colors.onSurfaceVariant }}
          >
            Simple plans designed for every inspection workflow
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Starter */}
            <div
              className="rounded-xl p-8 space-y-6 border"
              style={{
                backgroundColor: tokens.colors.surface,
                borderColor: tokens.colors.outlineVariant,
              }}
            >
              <div>
                <h3
                  className="text-2xl font-bold"
                  style={{ color: tokens.colors.onSurface }}
                >
                  Starter
                </h3>
                <p
                  className="mt-2 text-4xl font-bold"
                  style={{ color: tokens.colors.onSurface }}
                >
                  $0<span className="text-lg font-normal" style={{ color: tokens.colors.onSurfaceVariant }}>/mo</span>
                </p>
                <p className="mt-2" style={{ color: tokens.colors.onSurfaceVariant }}>
                  For individual inspectors getting started
                </p>
              </div>
              <ul className="space-y-3">
                {[
                  "3 projects, 5 reports/month",
                  "Basic AI generation",
                  "Upload + tagging",
                  "Basic map view",
                  "2 exports/month",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckIcon />
                    <span style={{ color: tokens.colors.onSurface }}>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full text-center py-3 px-6 rounded-lg border font-medium transition-colors"
                style={{
                  borderColor: tokens.colors.primary,
                  color: tokens.colors.primary,
                  backgroundColor: "transparent",
                }}
              >
                Get Started
              </Link>
            </div>

            {/* Pro (Highlighted) */}
            <div
              className="rounded-xl p-8 space-y-6 border-2 relative"
              style={{
                backgroundColor: tokens.colors.primaryContainer,
                borderColor: tokens.colors.primary,
                boxShadow: `0 8px 32px ${tokens.colors.primary}20`,
              }}
            >
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 text-sm font-medium px-3 py-1 rounded-full"
                style={{
                  backgroundColor: tokens.colors.primary,
                  color: tokens.colors.onPrimary,
                }}
              >
                Most Popular
              </div>
              <div>
                <h3
                  className="text-2xl font-bold"
                  style={{ color: tokens.colors.onSurface }}
                >
                  Pro
                </h3>
                <p
                  className="mt-2 text-4xl font-bold"
                  style={{ color: tokens.colors.onSurface }}
                >
                  $29<span className="text-lg font-normal" style={{ color: tokens.colors.onSurfaceVariant }}>/mo</span>
                </p>
                <p className="mt-2" style={{ color: tokens.colors.onSurfaceVariant }}>
                  For professionals building regular reports
                </p>
              </div>
              <ul className="space-y-3">
                {[
                  "Unlimited projects & reports",
                  "Full AI analysis (captions, findings, recommendations)",
                  "Map + marker review",
                  "Full report editing",
                  "PDF export",
                  "Client management",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckIcon />
                    <span style={{ color: tokens.colors.onSurface }}>{feature}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className="block w-full text-center py-3 px-6 rounded-lg font-medium transition-colors"
                style={{
                  backgroundColor: tokens.colors.primary,
                  color: tokens.colors.onPrimary,
                }}
              >
                Start Building Reports
              </Link>
            </div>

            {/* Teams */}
            <div
              className="rounded-xl p-8 space-y-6 border opacity-90"
              style={{
                backgroundColor: tokens.colors.surface,
                borderColor: tokens.colors.outlineVariant,
              }}
            >
              <div>
                <h3
                  className="text-2xl font-bold"
                  style={{ color: tokens.colors.onSurface }}
                >
                  Teams
                </h3>
                <p
                  className="mt-2 text-4xl font-bold"
                  style={{ color: tokens.colors.onSurface }}
                >
                  Coming Soon
                </p>
                <p className="mt-2" style={{ color: tokens.colors.onSurfaceVariant }}>
                  For organizations collaborating on inspections
                </p>
              </div>
              <ul className="space-y-3">
                {[
                  "Multi-user collaboration",
                  "Shared projects",
                  "Advanced reporting",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <CheckIcon />
                    <span style={{ color: tokens.colors.onSurface }}>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                disabled
                className="w-full py-3 px-6 rounded-lg font-medium cursor-not-allowed"
                style={{
                  backgroundColor: tokens.colors.surfaceContainer,
                  color: tokens.colors.onSurfaceVariant,
                }}
              >
                Coming Soon
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Clarity */}
      <section
        className="py-16 md:py-24"
        style={{ backgroundColor: tokens.colors.surfaceContainer }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-3xl font-bold text-center mb-12"
            style={{ color: tokens.colors.onSurface }}
          >
            Plan Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "What's a \"report\"?",
                description:
                  "A structured output with inspection findings, AI insights, and spatial map data.",
              },
              {
                title: "What's included in AI generation?",
                description:
                  "Automated analysis of drone images: object detection, anomaly flags, and descriptive captions.",
              },
              {
                title: "What's included in exports?",
                description:
                  "Client-ready PDF reports with maps, findings, and customizable branding.",
              },
            ].map((item) => (
              <div key={item.title} className="space-y-2">
                <h4
                  className="font-semibold text-lg"
                  style={{ color: tokens.colors.onSurface }}
                >
                  {item.title}
                </h4>
                <p style={{ color: tokens.colors.onSurfaceVariant }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Reinforcement */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ color: tokens.colors.onSurface }}
          >
            Built for field inspections
          </h2>
          <div className="flex flex-col md:flex-row justify-center gap-6 md:gap-12">
            {[
              "Built for real-world inspections",
              "From image to report in minutes",
              "Designed for clarity and speed",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 justify-center"
              >
                <CheckIcon />
                <span style={{ color: tokens.colors.onSurface }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section
        className="py-16 md:py-24"
        style={{ backgroundColor: tokens.colors.primaryContainer }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2
            className="text-3xl md:text-4xl font-bold"
            style={{ color: tokens.colors.onSurface }}
          >
            Ready to transform your inspection workflow?
          </h2>
          <p
            className="text-lg md:text-xl"
            style={{ color: tokens.colors.onSurfaceVariant }}
          >
            Start creating professional reports for free today.
          </p>
          <Link
            href="/signup"
            className="inline-block py-3 px-8 rounded-lg font-medium text-lg transition-colors"
            style={{
              backgroundColor: tokens.colors.primary,
              color: tokens.colors.onPrimary,
            }}
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </main>
  );
}
