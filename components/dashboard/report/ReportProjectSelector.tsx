"use client";

import { useRouter } from "next/navigation";
import { tokens } from "@/lib/design-tokens";
import { Project, ProjectStats } from "@/hooks/useReportState";

interface ReportProjectSelectorProps {
  projects: Project[];
  selectedProjectId: string;
  onProjectChange: (projectId: string) => void;
  projectStats: ProjectStats | null;
}

export function ReportProjectSelector({
  projects,
  selectedProjectId,
  onProjectChange,
  projectStats,
}: ReportProjectSelectorProps) {
  const router = useRouter();

  if (projects.length === 0) {
    return (
      <div
        className="animate-content"
        style={{
          padding: tokens.spacing.xl,
          backgroundColor: tokens.colors.surface,
          borderRadius: tokens.radius.lg,
          boxShadow: tokens.elevation.level1,
          border: `1px solid ${tokens.colors.outlineVariant}`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            padding: `${tokens.spacing.xxl} ${tokens.spacing.xl}`,
            backgroundColor: "var(--ref-neutral-neutral-98)",
            borderRadius: tokens.radius.lg,
            textAlign: "center",
            border: `2px dashed var(--ref-neutral-variant-neutral-variant80)`,
            marginBottom: tokens.spacing.lg,
          }}
        >
          <svg
            style={{
              width: "48px",
              height: "48px",
              marginBottom: tokens.spacing.md,
              fill: "var(--ref-neutral-variant-neutral-variant40)",
            }}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 12H4V8h16v10z" />
          </svg>
          <p
            style={{
              ...tokens.typography.titleMedium,
              color: "var(--ref-neutral-variant-neutral-variant30)",
              margin: 0,
              marginBottom: tokens.spacing.xs,
            }}
          >
            No projects available
          </p>
          <p
            style={{
              ...tokens.typography.bodySmall,
              color: "var(--ref-neutral-variant-neutral-variant40)",
              opacity: 0.8,
              margin: 0,
            }}
          >
            Create a project first to generate reports
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard/projects")}
          style={{
            padding: `${tokens.spacing.md} ${tokens.spacing.xl}`,
            backgroundColor: tokens.colors.primary,
            color: tokens.colors.onPrimary,
            border: "none",
            borderRadius: tokens.radius.md,
            cursor: "pointer",
            ...tokens.typography.labelLarge,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = tokens.colors.primaryContainer;
            e.currentTarget.style.color = tokens.colors.onPrimaryContainer;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = tokens.colors.primary;
            e.currentTarget.style.color = tokens.colors.onPrimary;
          }}
        >
          Create Project
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        className="animate-content"
        style={{
          marginBottom: tokens.spacing.lg,
          display: "flex",
          alignItems: "center",
          gap: tokens.spacing.md,
          flexWrap: "wrap",
        }}
      >
        <label style={{ ...tokens.typography.labelLarge, color: tokens.colors.onSurface }}>
          Project:
        </label>
        <select
          value={selectedProjectId}
          onChange={(e) => onProjectChange(e.target.value)}
          className="custom-select"
          style={{
            padding: `${tokens.spacing.sm} ${tokens.spacing.xl} ${tokens.spacing.sm} ${tokens.spacing.sm}`,
            border: `1px solid ${tokens.colors.outlineVariant}`,
            borderRadius: tokens.radius.md,
            backgroundColor: tokens.colors.surface,
            color: tokens.colors.onSurface,
            ...tokens.typography.bodyLarge,
            minWidth: "200px",
            boxSizing: "border-box",
            appearance: "none",
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: `right ${tokens.spacing.sm} center`,
            backgroundSize: "16px",
            cursor: "pointer",
          }}
        >
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      {projectStats && (
        <div
          className="animate-content"
          style={{
            marginBottom: tokens.spacing.lg,
            padding: tokens.spacing.lg,
            backgroundColor: tokens.colors.surface,
            borderRadius: tokens.radius.lg,
            boxShadow: tokens.elevation.level1,
            border: `1px solid ${tokens.colors.outlineVariant}`,
          }}
        >
          <h3
            style={{
              ...tokens.typography.titleMedium,
              color: tokens.colors.onSurface,
              marginBottom: tokens.spacing.md,
            }}
          >
            Project Status
          </h3>
          <div style={{ display: "flex", gap: tokens.spacing.xl, flexWrap: "wrap" }}>
            <div>
              <p style={{ ...tokens.typography.labelMedium, color: tokens.colors.onSurfaceVariant }}>
                Total Images
              </p>
              <p style={{ ...tokens.typography.headlineSmall, color: tokens.colors.onSurface }}>
                {projectStats.total}
              </p>
            </div>
            <div>
              <p style={{ ...tokens.typography.labelMedium, color: tokens.colors.onSurfaceVariant }}>
                Untagged
              </p>
              <p
                style={{
                  ...tokens.typography.headlineSmall,
                  color: projectStats.untagged > 0 ? tokens.colors.error : tokens.colors.onSurface,
                }}
              >
                {projectStats.untagged}
              </p>
            </div>
            <div>
              <p style={{ ...tokens.typography.labelMedium, color: tokens.colors.onSurfaceVariant }}>
                With Notes
              </p>
              <p style={{ ...tokens.typography.headlineSmall, color: tokens.colors.onSurface }}>
                {projectStats.withNotes}
              </p>
            </div>
          </div>

          {projectStats.total === 0 && (
            <div
              style={{
                marginTop: tokens.spacing.md,
                padding: tokens.spacing.md,
                backgroundColor: tokens.colors.errorContainer,
                borderRadius: tokens.radius.md,
              }}
            >
              <p style={{ ...tokens.typography.bodyMedium, color: tokens.colors.onErrorContainer }}>
                No images in this project. Upload images first to generate a report.
              </p>
            </div>
          )}

          {projectStats.untagged > 0 && projectStats.total > 0 && (
            <div
              style={{
                marginTop: tokens.spacing.md,
                padding: tokens.spacing.md,
                backgroundColor: tokens.colors.surfaceVariant,
                borderRadius: tokens.radius.md,
              }}
            >
              <p style={{ ...tokens.typography.bodyMedium, color: tokens.colors.onSurfaceVariant }}>
                {projectStats.untagged} image(s) are untagged. Tagging helps improve report accuracy.
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}