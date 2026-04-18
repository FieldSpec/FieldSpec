"use client";

import { useRouter } from "next/navigation";
import { useEffect, useCallback } from "react";
import Navbar from "@/components/marketing/Navbar";
import Hero from "@/components/marketing/Hero";
import { Features, HowItWorks, ProblemSolution } from "@/components/marketing/Sections";
import { tokens } from "@/lib/design-tokens";

export default function MarketingPage() {
  const router = useRouter();

  // Proactive background prefetching for core auth routes
  useEffect(() => {
    router.prefetch("/signup");
    router.prefetch("/login");
  }, [router]);

  // Handler for manual prefetching on hover to minimize latency
  const handlePrefetch = useCallback((path: string) => {
    router.prefetch(path);
  }, [router]);

  return (
    <div style={{ backgroundColor: tokens.colors.background }}>
      <Navbar onPrefetch={handlePrefetch} />
      <Hero onPrefetch={handlePrefetch} />
      
      <ProblemSolution />
      
      <Features />
      
      <HowItWorks />

      {/* Footer */}
      <footer style={{
        padding: tokens.spacing.xxl,
        backgroundColor: "#0f172a",
        borderTop: "1px solid rgba(255, 255, 255, 0.05)",
        textAlign: "center",
      }}>
        <p style={{ ...tokens.typography.bodyMedium, color: "rgba(255, 255, 255, 0.6)" }}>
          &copy; {new Date().getFullYear()} FieldSpec. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
