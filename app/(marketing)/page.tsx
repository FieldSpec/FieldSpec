import Link from "next/link";
import type { Metadata } from "next";
import { tokens } from "@/lib/design-tokens";
import Brand from "@/components/Brand";
import Navbar from "@/components/marketing/Navbar";
import { Features, HowItWorks } from "@/components/marketing/Sections";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "FieldSpec — AI Report Builder for Drone Inspections",
  description:
    "Upload drone images, get AI-generated analysis, and export professional PDF reports. Built for agriculture, survey, and infrastructure teams.",
  keywords: [
    "drone survey",
    "AI analysis",
    "aerial inspection",
    "crop health",
    "infrastructure inspection",
    "professional reports",
    "drone mapping",
    "field analysis",
  ],
};

export default function MarketingPage() {
  const features = [
    {
      title: "Skip the Manual Analysis",
      description: "AI examines every image and produces findings automatically. No more staring at photos wondering what to write.",
      imageUrl: "/images/ai-generated-insights.jpg",
    },
    {
      title: "GPS-Tagged Analysis",
      description: "Upload images with GPS coordinates. AI extracts patterns tied to exact locations so you know where issues are, not just what they are.",
      imageUrl: "/images/image-based-analysis.jpg",
    },
    {
      title: "Consistent Reports Every Time",
      description: "Generate formatted, professional PDF reports with one click. Your clients get the same quality, project after project.",
      imageUrl: "/images/structured-reports.jpg",
    },
    {
      title: "Pinpoint Issues on a Map",
      description: "Every image appears on an interactive map. See exactly where problems are without flipping through folders.",
      imageUrl: "/images/map-visualisation.jpg",
    },
    {
      title: "Export & Share in One Click",
      description: "Generate a PDF and share with stakeholders instantly. No formatting, no file conversion, no delays.",
      imageUrl: "/images/hand-holding-stopwatch.jpg",
    },
  ];

  const useCases = [
    { title: "Agricultural Inspections", description: "Assess crop health, map pest damage, and monitor irrigation across hundreds of acres. Deliver clear reports growers can act on.", imageUrl: "/images/agricultural-inspections.jpg" },
    { title: "Land Surveys", description: "Document site conditions, track changes between surveys, and produce professional reports clients trust for decision-making.", imageUrl: "/images/land-surveys.jpg" },
    { title: "Infrastructure Inspections", description: "Inspect roofs, bridges, and utility assets from the air. Generate professional reports without putting boots on the ground.", imageUrl: "/images/infrastructure-inspections.jpg" },
    { title: "Drone Service Providers", description: "Stand out from competitors by delivering polished inspection reports with every flight. Turn aerial data into a premium service.", imageUrl: "/images/drone-operators.jpg" },
  ];

  const steps = [
    { num: "1", title: "Upload Your Images", description: "Drag and drop your drone images. GPS data is extracted automatically.", icon: "upload" },
    { num: "2", title: "Tag & Organize", description: "Categorize images by project, location, or condition in seconds.", icon: "label" },
    { num: "3", title: "Analyze with AI", description: "AI detects patterns, flags issues, and generates findings for every image.", icon: "auto_awesome" },
    { num: "4", title: "Export Your Report", description: "Generate a polished PDF report and share with stakeholders immediately.", icon: "description" },
  ];

  return (
    <main style={{ flex: 1 }}>
      {/* Navigation */}
      <nav style={{
        padding: `${tokens.spacing.md} ${tokens.spacing.xxl}`,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 10,
      }}>
<style>{`
              .nav-link:hover { color: ${tokens.colors.primary} !important; opacity: 0.8; }
              .nav-link { text-decoration: none; transition: color 0.3s ease; color: #ffffff !important; font-weight: 500; }
              .btn-primary:hover { background-color: ${tokens.colors.primaryContainer} !important; color: ${tokens.colors.onPrimaryContainer} !important; }
              .btn-primary { text-decoration: none; transition: background-color 0.3s ease, color 0.3s ease; border-radius: 16px; }
              .btn-outline:hover { background-color: ${tokens.colors.surfaceVariant} !important; }
              .btn-outline { text-decoration: none; transition: background-color 0.3s ease; color: ${tokens.colors.onSurface} !important; border-radius: 16px; }
              .btn-text:hover { color: ${tokens.colors.onPrimary} !important; opacity: 1; }
              .btn-text { text-decoration: none; transition: color 0.3s ease; color: ${tokens.colors.onPrimary} !important; border-radius: 16px; }
              .social-icon { color: ${tokens.colors.onSurfaceVariant}; transition: color 0.3s ease; }
              .social-icon:hover { color: ${tokens.colors.onSurface} !important; }
              /* Header layout */
              .header-container {
                display: flex;
                justify-content: space-between;
                align-items: center;
                width: 100%;
              }
              .header-brand {
                display: flex;
                align-items: center;
              }
              .header-nav {
                display: flex;
                align-items: center;
                gap: ${tokens.spacing.lg};
              }
              .header-actions {
                display: flex;
                align-items: center;
                gap: ${tokens.spacing.lg};
              }
            `}</style>
          <div className="header-brand">
            <Brand size="md" />
          </div>
          <div className="header-nav">
            <Link href="#features" className="nav-link" style={{ ...tokens.typography.labelLarge }}>
              Features
            </Link>
            <Link href="#how-it-works" className="nav-link" style={{ ...tokens.typography.labelLarge }}>
              How It Works
            </Link>
            <Link href="#use-cases" className="nav-link" style={{ ...tokens.typography.labelLarge }}>
              Use Cases
            </Link>
          </div>
          <div className="header-actions">
<Link href="/login" className="btn-text" style={{ ...tokens.typography.labelLarge, color: tokens.colors.onPrimary }}>
              Log In
            </Link>
            <Link href="/signup" className="btn-primary" style={{
                padding: "16px 20px",
                backgroundColor: tokens.colors.primary,
                color: tokens.colors.onPrimary,
                textDecoration: "none",
                borderRadius: "16px",
                ...tokens.typography.labelLarge,
                fontWeight: "600",
              }}>
              Get Started
            </Link>
<ThemeToggle />
          </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section" style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        minHeight: "700px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        zIndex: 1,
        animation: "heroFadeIn 1s ease-out forwards",
        backgroundColor: "#000",
      }}>
        {/* Video Background */}
        <div className="hero-video-container">
          <iframe
            className="hero-video"
            src="https://streamable.com/e/lbw4qo?autoplay=1&loop=1&muted=1&controls=0"
            title="Promotional video background"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            loading="eager"
            aria-hidden="true"
            sandbox="allow-same-origin allow-scripts allow-popups allow-presentation"
          />
        </div>
        <div className="hero-video-overlay" />
        {/* Image Background for Mobile */}
        <div className="hero-image-container">
          <img
            className="hero-image"
            src="https://i.postimg.cc/fLq17NNx/agriculture-healthy-food-(1).jpg"
            alt="Drone surveying healthy crops"
            loading="eager"
          />
        </div>

        {/* Content */}
        <div className="hero-content" style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "1000px",
          width: "100%",
          padding: `0 ${tokens.spacing.lg}`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          animation: "contentSlideUp 1.2s ease-out forwards",
          opacity: 0,
          animationDelay: "0.2s",
        }}>
          <h1 className="hero-title" style={{
            fontFamily: tokens.typography.displayLarge.fontFamily,
            fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
            fontWeight: 600,
            color: "#FFFFFF",
            marginBottom: tokens.spacing.lg,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}>
            Turn Drone Images into<br />
            <span style={{ color: "#FFFFFF" }}>Client-Ready Reports</span>
          </h1>
          <p className="hero-subcopy" style={{
            fontFamily: tokens.typography.bodyLarge.fontFamily,
            fontSize: "clamp(1.125rem, 2vw, 1.5rem)",
            fontWeight: 500,
            color: "#f0f4fa",
            maxWidth: "700px",
            marginBottom: tokens.spacing.xl,
            lineHeight: 1.5,
            textShadow: "0 1px 4px rgba(0,0,0,0.3)",
          }}>
            Upload aerial images, get AI-generated analysis and findings, and export a structured PDF report. No manual writing, no missed details, no delays.
          </p>
          <div className="hero-buttons" style={{
            display: "flex",
            gap: tokens.spacing.md,
            justifyContent: "center",
            flexWrap: "wrap",
          }}>
            <Link href="/signup" className="hero-btn-primary">
              Start Your First Report
            </Link>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes heroFadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes contentSlideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }

          .hero-video-container {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
            z-index: 0;
            background-color: #000;
          }
          .hero-video-overlay {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
              to bottom,
              rgba(0, 0, 0, 0.55) 0%,
              rgba(0, 0, 0, 0.45) 100%
            );
            z-index: 1;
          }
          .hero-video {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 177.77778vh;
            min-width: 100%;
            height: 56.25vw;
            min-height: 100%;
            transform: translate(-50%, -50%);
            border: none;
            pointer-events: none;
          }
          .hero-image-container {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            overflow: hidden;
            z-index: 0;
            background-color: #000;
            display: none;
          }
          .hero-image {
            position: absolute;
            top: 50%; left: 50%;
            min-width: 100%; min-height: 100%;
            width: auto; height: auto;
            transform: translate(-50%, -50%);
            object-fit: cover;
          }

          /* Token-Based Primary Button */
          .hero-btn-primary {
            padding: var(--sys-spacing-spacing-md) var(--sys-spacing-spacing-md-y);
            background-color: #315f9b;
            color: #ffffff;
            text-decoration: none;
            border-radius: 16px;
            font-family: var(--sys-typescale-label-large-fontfamily);
            font-size: var(--sys-typescale-label-large-fontsize);
            font-weight: 500;
            border: none;
            transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          .hero-btn-primary:hover {
            background-color: #d8e4f3;
            color: #0c1827;
            transform: translateY(-2px);
            box-shadow: var(--sys-elevation-8dp) !important;
          }

          /* Token-Based Secondary Button */
          .hero-btn-secondary {
            padding: var(--sys-spacing-spacing-md) var(--sys-spacing-spacing-xl);
            background-color: transparent;
            color: #ffffff;
            text-decoration: none;
            border-radius: 16px;
            font-family: var(--sys-typescale-label-large-fontfamily);
            font-size: var(--sys-typescale-label-large-fontsize);
            font-weight: 500;
            border: 2px solid #ffffff;
            transition: background-color 0.2s ease, border-color 0.2s ease, color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          .hero-btn-secondary:hover {
            background-color: #d8e4f3;
            color: #0c1827;
            border-color: #d8e4f3;
            transform: translateY(-2px);
            box-shadow: var(--sys-elevation-8dp) !important;
          }

          /* Responsive Adjustments */
          @media (max-width: 1024px) {
            .hero-section {
              height: 90vh;
              min-height: 600px;
            }
          }
          @media (max-width: 768px) {
            .hero-section {
              height: 100vh;
              min-height: 600px;
            }
            .hero-video-container { display: none; }
            .hero-image-container { display: block; }
            
            .hero-buttons { flex-direction: column; width: 100%; }
            .hero-buttons > a { width: 100%; max-width: none; }
          }
        `}} />
      </section>

      {/* Problem → Solution Section */}
      <section style={{
        position: "relative",
        padding: `${tokens.spacing.xxl} ${tokens.spacing.lg}`,
        backgroundColor: "var(--color-section-bg)",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: "1000px",
          height: "400px",
          background: `radial-gradient(ellipse at top, ${tokens.colors.primaryContainer}80, transparent 70%)`,
          zIndex: 0,
          pointerEvents: "none",
        }} />

        <div style={{ maxWidth: "1000px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: tokens.spacing.md }}>
            <span style={{
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: "50px",
              backgroundColor: tokens.colors.surfaceVariant,
              color: tokens.colors.onSurfaceVariant,
              ...tokens.typography.labelSmall,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "1px",
              border: `1px solid ${tokens.colors.outlineVariant}`
            }}>
              The Old Way vs. FieldSpec
            </span>
          </div>

          <h2 style={{
            ...tokens.typography.headlineLarge,
            color: tokens.colors.onSurface,
            textAlign: "center",
            marginBottom: tokens.spacing.xl,
          }}>
            From Hours of Manual Work <br />
            <span style={{ color: tokens.colors.primary }}>to Automated Reports</span>
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: tokens.spacing.xl,
            marginTop: tokens.spacing.xl,
            marginBottom: "80px",
          }}>
            {/* Left: Problem */}
            <div style={{
              borderRadius: "8px",
              padding: "24px",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute",
                inset: 0,
                backgroundImage: 'url("/images/land-surveys.jpg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "grayscale(100%)",
                zIndex: 0,
              }} />
              <div style={{
                position: "absolute",
                inset: 0,
                backgroundColor: `color-mix(in srgb, ${tokens.colors.surface} 50%, transparent)`,
                zIndex: 0,
              }} />
              
              <div style={{
                position: "relative",
                zIndex: 1,
                backgroundColor: `color-mix(in srgb, ${tokens.colors.surfaceContainer} 90%, transparent)`,
                backdropFilter: "blur(12px)",
                borderRadius: "8px",
                border: `1px solid ${tokens.colors.outlineVariant}`,
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
              }}>
                <div style={{
                  padding: "16px 24px",
                  borderBottom: `1px solid ${tokens.colors.outlineVariant}`,
                  textAlign: "center",
                }}>
                  <h3 style={{ ...tokens.typography.titleLarge, color: tokens.colors.onSurface, fontWeight: 500, margin: 0 }}>
                    Traditional methods
                  </h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {["Images are unstructured", "Findings are written manually", "Reports take hours to compile"].map((text, i, arr) => (
                    <div key={i} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "24px",
                      borderBottom: i === arr.length - 1 ? "none" : `1px solid ${tokens.colors.outlineVariant}`,
                    }}>
                      <div style={{ color: tokens.colors.error, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </div>
                      <span style={{ ...tokens.typography.bodyLarge, color: tokens.colors.onSurfaceVariant }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Solution */}
            <div style={{
              borderRadius: "8px",
              padding: "24px",
              position: "relative",
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute",
                inset: 0,
                backgroundImage: 'url("/images/agricultural-inspections.jpg")',
                backgroundSize: "cover",
                backgroundPosition: "center",
                zIndex: 0,
              }} />
              <div style={{
                position: "absolute",
                inset: 0,
                backgroundColor: `color-mix(in srgb, ${tokens.colors.primary} 40%, transparent)`,
                mixBlendMode: "multiply",
                zIndex: 0,
              }} />
              <div style={{
                position: "absolute",
                inset: 0,
                backgroundColor: `color-mix(in srgb, ${tokens.colors.surface} 30%, transparent)`,
                zIndex: 0,
              }} />
              
              <div style={{
                position: "relative",
                zIndex: 1,
                backgroundColor: `color-mix(in srgb, ${tokens.colors.primaryContainer} 90%, transparent)`,
                backdropFilter: "blur(12px)",
                borderRadius: "8px",
                border: `1px solid ${tokens.colors.outlineVariant}`,
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
              }}>
                <div style={{
                  padding: "16px 24px",
                  borderBottom: `1px solid ${tokens.colors.outlineVariant}`,
                  textAlign: "center",
                }}>
                  <h3 style={{ ...tokens.typography.titleLarge, color: tokens.colors.primary, fontWeight: 500, margin: 0 }}>
                    With FieldSpec
                  </h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {["AI analyzes images instantly", "Findings are structured automatically", "Reports are generated and ready to export"].map((text, i, arr) => (
                    <div key={i} style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      padding: "24px",
                      borderBottom: i === arr.length - 1 ? "none" : `1px solid ${tokens.colors.outlineVariant}`,
                    }}>
                      <div style={{ color: tokens.colors.primary, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      </div>
                      <span style={{ ...tokens.typography.bodyLarge, color: tokens.colors.onSurfaceVariant }}>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product UI Transformation Preview (Pure CSS) */}
          <div style={{
            width: "100%",
            backgroundColor: tokens.colors.surfaceContainerLow,
            border: `1px solid ${tokens.colors.outlineVariant}`,
            borderRadius: "24px",
            boxShadow: `0 32px 64px rgba(0,0,0,0.1), 0 0 0 1px rgba(255,255,255,0.05) inset`,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            position: "relative"
          }}>
             {/* Mock App Header */}
             <div style={{ height: "56px", borderBottom: `1px solid ${tokens.colors.outlineVariant}`, display: "flex", alignItems: "center", padding: "0 20px", backgroundColor: tokens.colors.surfaceContainer, zIndex: 2 }}>
               <div style={{ display: "flex", gap: "8px" }}>
                 <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: tokens.colors.error }} />
                 <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: "#facc15" }} />
                 <div style={{ width: "12px", height: "12px", borderRadius: "50%", backgroundColor: tokens.colors.primary }} />
               </div>
               <div style={{ marginLeft: "24px", ...tokens.typography.labelMedium, color: tokens.colors.onSurfaceVariant, fontWeight: 600, letterSpacing: "0.5px" }}>FieldSpec Transformation Engine</div>
             </div>
             
             {/* Split Interface Container */}
             <div className="transformation-grid" style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", minHeight: "400px", backgroundColor: tokens.colors.surface, position: "relative" }}>
               
               {/* Image Input side */}
               <div style={{ padding: "32px", display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
                 <div style={{ ...tokens.typography.labelMedium, color: tokens.colors.onSurfaceVariant, marginBottom: "20px", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700 }}>Raw Drone Data</div>
                 <div style={{ flex: 1, borderRadius: "12px", border: `1px solid ${tokens.colors.outlineVariant}`, position: "relative", overflow: "hidden", backgroundImage: 'url("/images/map-visualisation.jpg")', backgroundSize: "cover", backgroundPosition: "center", boxShadow: "0 12px 24px rgba(0,0,0,0.15)", minHeight: "250px" }}>
                   {/* Scanning animation overlay */}
                   <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "3px", backgroundColor: tokens.colors.primary, boxShadow: `0 4px 16px ${tokens.colors.primary}`, animation: "scanLine 3s infinite linear", zIndex: 10 }} />
                   
                   {/* AI Bounding Boxes */}
                   <div style={{ position: "absolute", top: "30%", left: "40%", width: "60px", height: "60px", border: `2px solid ${tokens.colors.primary}`, borderRadius: "4px", backgroundColor: `color-mix(in srgb, ${tokens.colors.primary} 20%, transparent)`, animation: "pulseBox 2s infinite ease-in-out" }}>
                      <div style={{ position: "absolute", top: "-20px", left: "-2px", backgroundColor: tokens.colors.primary, color: tokens.colors.onPrimary, fontSize: "10px", padding: "2px 6px", borderRadius: "2px", fontWeight: "bold" }}>Defect 98%</div>
                   </div>
                   <div style={{ position: "absolute", top: "60%", left: "20%", width: "80px", height: "50px", border: `2px solid ${tokens.colors.error}`, borderRadius: "4px", backgroundColor: `color-mix(in srgb, ${tokens.colors.error} 20%, transparent)`, animation: "pulseBox 2s infinite ease-in-out 1s" }}>
                      <div style={{ position: "absolute", top: "-20px", left: "-2px", backgroundColor: tokens.colors.error, color: tokens.colors.onError, fontSize: "10px", padding: "2px 6px", borderRadius: "2px", fontWeight: "bold" }}>Rust 94%</div>
                   </div>
                 </div>
               </div>

               {/* Center Arrow Connector */}
               <div className="transformation-connector" style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", zIndex: 2 }}>
                  <div className="transformation-arrow" style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: tokens.colors.primaryContainer, display: "flex", alignItems: "center", justifyContent: "center", border: `4px solid ${tokens.colors.surface}`, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 2 }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={tokens.colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                  </div>
                  <div className="transformation-dashed-line" style={{ position: "absolute", top: 0, bottom: 0, left: "50%", width: "1px", borderLeft: `1px dashed ${tokens.colors.outlineVariant}`, zIndex: 1, transform: "translateX(-50%)" }} />
               </div>

               {/* Report Output side */}
               <div style={{ padding: "32px", display: "flex", flexDirection: "column", position: "relative", zIndex: 1 }}>
                 <div style={{ ...tokens.typography.labelMedium, color: tokens.colors.primary, marginBottom: "20px", textTransform: "uppercase", letterSpacing: "1.5px", fontWeight: 700 }}>Structured Report</div>
                 <div style={{ flex: 1, backgroundColor: tokens.colors.surfaceContainerLow, borderRadius: "12px", border: `1px solid ${tokens.colors.outlineVariant}`, padding: "24px", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "0 12px 32px rgba(0,0,0,0.1)", overflow: "hidden", position: "relative", minHeight: "250px" }}>
                    
                    {/* Report Header Actual Data */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${tokens.colors.outlineVariant}`, paddingBottom: "16px" }}>
                       <div>
                          <div style={{ ...tokens.typography.titleMedium, color: tokens.colors.onSurface, fontWeight: 700 }}>Inspection Report #492</div>
                          <div style={{ ...tokens.typography.labelSmall, color: tokens.colors.onSurfaceVariant, marginTop: "4px" }}>Site: North Ridge Solar Array</div>
                       </div>
                       <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", backgroundColor: tokens.colors.primaryContainer, borderRadius: "8px", color: tokens.colors.onPrimaryContainer }}>
                           <span className="material-icons" style={{ fontSize: "20px" }}>picture_as_pdf</span>
                       </div>
                    </div>

                    {/* Report Map/Image */}
                    <div style={{ width: "100%", height: "100px", borderRadius: "8px", overflow: "hidden", position: "relative" }}>
                       <div style={{ position: "absolute", inset: 0, backgroundImage: 'url("/images/map-visualisation.jpg")', backgroundSize: "cover", backgroundPosition: "center" }} />
                    </div>

                    {/* Report List Items */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                       {[
                         { color: tokens.colors.error, title: "Critical: Severe Rust", desc: "Found on support structure B4", confidence: "98% Match" },
                         { color: "#facc15", title: "Warning: Micro-cracking", desc: "Detected on panel array 12", confidence: "87% Match" },
                         { color: tokens.colors.primary, title: "Routine: Maintenance", desc: "Scheduled cleaning needed", confidence: "Auto-tagged" }
                       ].map((item, idx) => (
                          <div key={idx} style={{ display: "flex", gap: "16px", alignItems: "flex-start", backgroundColor: tokens.colors.surface, padding: "12px", borderRadius: "8px", border: `1px solid ${tokens.colors.outlineVariant}` }}>
                             <div style={{ marginTop: "4px", width: "12px", height: "12px", borderRadius: "50%", backgroundColor: item.color, flexShrink: 0 }} />
                             <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "4px" }}>
                                   <div style={{ ...tokens.typography.labelMedium, color: tokens.colors.onSurface, fontWeight: 600 }}>{item.title}</div>
                                   <div style={{ ...tokens.typography.labelSmall, color: item.color, fontWeight: 600 }}>{item.confidence}</div>
                                </div>
                                <div style={{ ...tokens.typography.bodySmall, color: tokens.colors.onSurfaceVariant }}>{item.desc}</div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
               </div>
             </div>
          </div>
          <style dangerouslySetInnerHTML={{ __html: `
            @keyframes scanLine {
              0% { top: 0; opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { top: 100%; opacity: 0; }
            }
            @keyframes pulseBox {
              0% { transform: scale(1); opacity: 0.8; }
              50% { transform: scale(1.05); opacity: 1; box-shadow: 0 0 12px var(--sys-primary); }
              100% { transform: scale(1); opacity: 0.8; }
            }
            @media (max-width: 768px) {
               .transformation-grid {
                  display: flex !important;
                  flex-direction: column !important;
               }
               .transformation-connector {
                  padding: 24px 0;
               }
               .transformation-arrow {
                  transform: rotate(90deg);
               }
               .transformation-dashed-line {
                  width: 100% !important;
                  height: 1px !important;
                  border-left: none !important;
                  border-top: 1px dashed var(--sys-outline-roles-outline-variant) !important;
                  top: 50% !important;
                  left: 0 !important;
                  bottom: auto !important;
                  transform: translateY(-50%) !important;
               }
            }
          `}} />
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{
        padding: `160px ${tokens.spacing.lg} ${tokens.spacing.xxl}`, 
        backgroundColor: "var(--color-section-bg)",
      }}>
        <style dangerouslySetInnerHTML={{
          __html: `
            .step-card:hover {
              transform: translateY(-4px);
              box-shadow: 0 12px 32px rgba(0,0,0,0.4);
              border-color: rgba(255,255,255,0.2) !important;
            }
           @media (min-width: 768px) {
             .step-connector {
               display: block !important;
             }
           }
         `}} />
        <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
          <h2 style={{
            ...tokens.typography.headlineLarge,
            color: tokens.colors.onSurface,
            textAlign: "center",
            marginBottom: tokens.spacing.xs,
          }}>
            How It Works
          </h2>
          <p style={{
            ...tokens.typography.bodyLarge,
            color: tokens.colors.onSurfaceVariant,
            textAlign: "center",
            marginBottom: tokens.spacing.xxl,
          }}>
            Get from drone flight to delivered report in 4 steps
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: tokens.spacing.lg,
          }}>
            {steps.map((step, index) => (
              <div
                key={step.num}
                className="step-card"
                style={{
                  padding: tokens.spacing.xl,
                  backgroundColor: tokens.colors.surfaceContainer,
                  borderRadius: tokens.radius.lg,
                  border: `1px solid ${tokens.colors.outlineVariant}`,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  position: "relative",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                <div style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: tokens.radius.lg,
                  background: `linear-gradient(135deg, ${tokens.colors.primary} 0%, ${tokens.colors.secondary} 100%)`,
                  color: tokens.colors.onPrimary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: tokens.spacing.md,
                  boxShadow: `0 6px 20px ${tokens.colors.primary}40`,
                }}>
                  <span className="material-icons" style={{ fontSize: "28px" }}>{step.icon}</span>
                </div>
                <h3 style={{
                  ...tokens.typography.titleMedium,
                  color: tokens.colors.onSurface,
                  marginBottom: tokens.spacing.xs,
                }}>
                  {step.title}
                </h3>
                <p style={{
                  ...tokens.typography.bodySmall,
                  color: tokens.colors.onSurfaceVariant,
                  lineHeight: 1.5,
                }}>
                  {step.description}
                </p>
                {index < steps.length - 1 && (
                  <div className="step-connector" style={{
                    position: "absolute",
                    right: "-12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: "24px",
                    height: "24px",
                    color: tokens.colors.outlineVariant,
                    opacity: 0.3,
                    display: "none",
                  }}>
                    <span className="material-icons" style={{ fontSize: "24px" }}>arrow_forward</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{
        padding: `${tokens.spacing.xxl} ${tokens.spacing.lg}`,
        backgroundColor: "var(--color-section-bg)",
      }}>
        <style dangerouslySetInnerHTML={{
          __html: `
           .feature-card:hover {
             transform: translateY(-4px);
             box-shadow: 0 12px 32px rgba(49,87,155,0.12);
              border-color: var(--sys-primary);
           }
           .use-case-card:hover {
             transform: translateY(-4px);
             box-shadow: 0 12px 32px rgba(0,0,0,0.4);
             border-color: var(--sys-primary);
           }
           :root.light .feature-card {
             background-color: #D8E4F3 !important;
             border-color: #c3d5ed !important;
           }
         `}} />
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <h2 style={{
            ...tokens.typography.headlineLarge,
             color: tokens.colors.onSurface,
            textAlign: "center",
            marginBottom: tokens.spacing.xs,
          }}>
            Everything You Need to Deliver Professional Reports
          </h2>
          <p style={{
            ...tokens.typography.bodyLarge,
             color: tokens.colors.onSurfaceVariant,
            textAlign: "center",
            marginBottom: tokens.spacing.xxl,
          }}>
            Speed, accuracy, and consistency — built for field inspectors
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: tokens.spacing.lg,
          }}>
            {features.map((feature, i) => (
              <div
                key={i}
                className="feature-card"
                style={{
                  backgroundColor: tokens.colors.surfaceContainer,
                  borderRadius: "20px",
                  border: `1px solid ${tokens.colors.outlineVariant}`,
                  padding: tokens.spacing.md,
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {feature.imageUrl ? (
                  <div style={{
                    borderRadius: "14px",
                    overflow: "hidden",
                    marginBottom: tokens.spacing.lg,
                    backgroundColor: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}>
                    <img
                      src={feature.imageUrl}
                      alt={feature.title}
                      style={{
                        width: "100%",
                        height: "220px",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </div>
                ) : (
                  <div style={{ height: "16px" }} />
                )}
                <div style={{
                  padding: `0 ${tokens.spacing.sm}`,
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                }}>
                  <h4 style={{
                    fontFamily: "var(--sys-typescale-body-large-fontfamily)",
                    fontSize: "20px",
                    fontStyle: "italic",
                    fontWeight: 500,
                    color: tokens.colors.onSurface,
                    marginBottom: "12px",
                  }}>
                    {feature.title}
                  </h4>
                  <p style={{
                    fontFamily: "var(--sys-typescale-body-large-fontfamily)",
                    fontSize: "15px",
                    fontStyle: "italic",
                    color: tokens.colors.onSurfaceVariant,
                    lineHeight: 1.6,
                    paddingBottom: tokens.spacing.sm,
                  }}>
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="use-cases" style={{
        padding: `${tokens.spacing.xxl} ${tokens.spacing.lg}`,
        backgroundColor: "var(--color-section-bg)",
        position: "relative",
      }}>
        <style dangerouslySetInnerHTML={{
          __html: `
          .bento-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 24px;
            margin-top: 48px;
          }
          .use-case-card-bento {
             background: var(--sys-surface-roles-surface-container);
            border: 1px solid var(--sys-outline-variant);
            border-radius: 20px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transition: transform 0.3s ease, border-color 0.3s ease;
          }
          .use-case-card-bento:hover {
            transform: translateY(-4px);
             border-color: var(--sys-outline-variant);
            box-shadow: 0 12px 32px rgba(0,0,0,0.3);
          }
          .bento-span-2 {
            grid-column: span 2;
          }
          .bento-span-1 {
            grid-column: span 1;
          }
          @media (max-width: 900px) {
            .bento-grid {
              grid-template-columns: 1fr;
            }
            .bento-span-2, .bento-span-1 {
              grid-column: span 1;
            }
          }
        `}} />
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ marginBottom: "60px", textAlign: "center" }}>
            <span style={{
               color: tokens.colors.primary,
              fontSize: "14px",
              fontWeight: 600,
              fontFamily: "var(--sys-typescale-body-large-fontfamily)",
              display: "block",
              marginBottom: "12px",
              letterSpacing: "0.01em"
            }}>Who It&apos;s For</span>
            <h2 style={{
              ...tokens.typography.headlineLarge,
              color: tokens.colors.onSurface,
              textAlign: "center",
              margin: "0 auto",
              maxWidth: "800px",
            }}>
              Built for Field Professionals
            </h2>
          </div>

          <div className="bento-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
            marginTop: "48px",
          }}>
            {useCases.map((useCase, i) => {
              const spanClass = (i === 0 || i === 3) ? "bento-span-2" : "bento-span-1";

              return (
                <div
                  key={i}
                  className={`use-case-card-bento ${spanClass}`}
                >
                  {useCase.imageUrl && (
                    <div style={{
                      height: "240px",
                      width: "100%",
                      backgroundColor: "#0B1120",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                      overflow: "hidden",
                    }}>
                      <img
                        src={useCase.imageUrl}
                        alt={useCase.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          opacity: 0.85,
                        }}
                      />
                    </div>
                  )}
                  <div style={{
                    padding: "32px",
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end" // Pushes text down nicely
                  }}>
                    <span style={{
                      color: tokens.colors.onSurfaceVariant,
                      fontFamily: "var(--sys-typescale-body-large-fontfamily)",
                      fontSize: "13px",
                      fontWeight: 500,
                      marginBottom: "8px",
                      textTransform: "capitalize",
                    }}>
                      {useCase.title.split(" ")[0]}
                    </span>
                    <h4 style={{
                      color: tokens.colors.onSurface,
                      fontFamily: "var(--sys-typescale-body-large-fontfamily)",
                      fontSize: "20px",
                      fontWeight: "500",
                      marginBottom: "12px",
                    }}>
                      {useCase.title}
                    </h4>
                    <p style={{
                      color: tokens.colors.onSurfaceVariant,
                      fontFamily: "var(--sys-typescale-body-large-fontfamily)",
                      fontSize: "14px",
                      lineHeight: 1.6,
                      opacity: 0.7,
                    }}>
                      {useCase.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{
        padding: `0 24px 160px`, // Added large explicit spacing between CTA and footer
        backgroundColor: "var(--color-section-bg)",
      }}>
        <style dangerouslySetInnerHTML={{
          __html: `
           .cta-card {
              background-color: var(--sys-surface-roles-surface-container);
             background-image: radial-gradient(ellipse at bottom, var(--sys-primary) 0%, transparent 60%);
             border: 1px solid var(--sys-outline-variant);
             border-radius: 20px;
             padding: 50px 24px; // Removed another 50px of total height
             text-align: center;
             position: relative;
             overflow: hidden;
             box-shadow: 0 20px 40px rgba(0,0,0,0.3);
           }
            .cta-primary-btn {
              background-color: var(--sys-primary);
              color: var(--sys-on-primary);
              padding: 12px 24px;
             border-radius: 8px;
             font-size: 15px;
             font-weight: 500;
             text-decoration: none;
             transition: background-color 0.2s, transform 0.2s;
             border: none;
             display: inline-block;
           }
           .cta-primary-btn:hover {
             background-color: var(--sys-primary-container);
             color: var(--sys-on-primary-container);
             transform: translateY(-1px);
           }
            .cta-secondary-link {
              color: var(--sys-on-surface);
              font-size: 15px;
             font-weight: 500;
             text-decoration: none;
             display: inline-flex;
             align-items: center;
             gap: 6px;
             transition: color 0.2s, transform 0.2s;
           }
           .cta-secondary-link:hover {
             color: rgba(255,255,255,0.8);
           }
         `}} />
        <div className="cta-card" style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ maxWidth: "700px", margin: "0 auto", position: "relative", zIndex: 1 }}>
            <h2 style={{
              fontFamily: "var(--sys-typescale-headline-large-fontfamily)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 600,
              color: tokens.colors.onSurface,
              marginBottom: "24px",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              textAlign: "center",
            }}>
              Go From Images to Report in Minutes
            </h2>
            <p style={{
              fontFamily: "var(--sys-typescale-body-large-fontfamily)",
              fontSize: "17px",
              color: tokens.colors.onSurfaceVariant,
              lineHeight: 1.6,
              marginBottom: "40px",
              maxWidth: "540px",
              margin: "0 auto 40px",
              textAlign: "center",
            }}>
              Upload your first set of images and see what FieldSpec can do. No credit card required.
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", flexWrap: "wrap", marginTop: "40px" }}>
              <Link href="/signup" className="cta-primary-btn">
                Start Free
              </Link>
              <Link href="#how-it-works" className="cta-secondary-link">
                Watch the Demo <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

<footer style={{
        backgroundColor: "var(--footer-bg)",
        borderTop: `1px solid ${tokens.colors.outlineVariant}`,
        padding: `${tokens.spacing.xxl} ${tokens.spacing.lg}`,
        fontFamily: tokens.typography.bodyMedium.fontFamily,
      }}>
        <style>{`
            .footer-link { color: var(--footer-color); opacity: 0.8; text-decoration: none; transition: color 0.3s ease, opacity 0.3s ease; font-family: ${tokens.typography.bodyMedium.fontFamily}; }
            .footer-link:hover { opacity: 1; color: var(--footer-color) !important; }
            .social-footer-icon { color: var(--footer-color); opacity: 0.6; transition: color 0.3s ease, opacity 0.3s ease; font-size: 20px; display: flex; align-items: center; justify-content: center; }
            .social-footer-icon:hover { opacity: 1; color: var(--footer-color) !important; }
          `}</style>
        
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: tokens.spacing.xl,
        }}>
          <div>
            <Brand size="md" />
             <p style={{ ...tokens.typography.bodySmall, color: "var(--footer-color)", opacity: 0.8, marginTop: tokens.spacing.md }}>
              From drone images to professional reports. In minutes.
            </p>
          </div>

           <div>
             <h4 style={{ ...tokens.typography.labelLarge, color: "var(--footer-color)", marginBottom: tokens.spacing.md }}>
               Product
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
              <a href="#features" className="footer-link" style={tokens.typography.bodySmall}>Features</a>
              <a href="#how-it-works" className="footer-link" style={tokens.typography.bodySmall}>How It Works</a>
              <a href="#use-cases" className="footer-link" style={tokens.typography.bodySmall}>Use Cases</a>
              <Link href="/signup" className="footer-link" style={tokens.typography.bodySmall}>Get Started</Link>
            </div>
          </div>

           <div>
             <h4 style={{ ...tokens.typography.labelLarge, color: "var(--footer-color)", marginBottom: tokens.spacing.md }}>
               Company
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
              <a href="#" className="footer-link" style={tokens.typography.bodySmall}>About</a>
              <a href="#" className="footer-link" style={tokens.typography.bodySmall}>Blog</a>
              <a href="#" className="footer-link" style={tokens.typography.bodySmall}>Careers</a>
              <a href="#" className="footer-link" style={tokens.typography.bodySmall}>Contact</a>
            </div>
          </div>

           <div>
             <h4 style={{ ...tokens.typography.labelLarge, color: "var(--footer-color)", marginBottom: tokens.spacing.md }}>
               Legal
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
              <a href="#" className="footer-link" style={tokens.typography.bodySmall}>Privacy Policy</a>
              <a href="#" className="footer-link" style={tokens.typography.bodySmall}>Terms of Service</a>
              <a href="#" className="footer-link" style={tokens.typography.bodySmall}>Cookie Policy</a>
            </div>
          </div>
        </div>

        <div style={{
          maxWidth: "1200px",
          margin: `${tokens.spacing.xl} auto 0`,
          paddingTop: tokens.spacing.lg,
          borderTop: `1px solid ${tokens.colors.outlineVariant}`,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: tokens.spacing.md,
        }}>
           <p style={{ ...tokens.typography.bodySmall, color: "var(--footer-color)", opacity: 0.8 }}>
            &copy; {new Date().getFullYear()} FieldSpec. All rights reserved.
          </p>
          <div style={{ display: "flex", gap: tokens.spacing.md }}>
            <a href="https://x.com/fieldspec" target="_blank" rel="noopener noreferrer" className="social-footer-icon" aria-label="Twitter" style={{ padding: "6px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.5H2.66l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://linkedin.com/company/fieldspec" target="_blank" rel="noopener noreferrer" className="social-footer-icon" aria-label="LinkedIn" style={{ padding: "6px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
            </a>
            <a href="https://github.com/fieldspec" target="_blank" rel="noopener noreferrer" className="social-footer-icon" aria-label="GitHub" style={{ padding: "6px" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
