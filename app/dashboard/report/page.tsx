"use client";

import { useReportState } from "@/hooks/useReportState";
import { tokens } from "@/lib/design-tokens";
import { ReportProjectSelector } from "@/components/dashboard/report/ReportProjectSelector";
import { ReportJobStatus } from "@/components/dashboard/report/ReportJobStatus";
import { ReportEditor } from "@/components/dashboard/report/ReportEditor";
import { ReportExporter } from "@/components/dashboard/report/ReportExporter";
import { LoadingScreen } from "@/lib/components/loading";

export default function ReportPage() {
  const { state, actions } = useReportState();

  if (state.loading) {
    return <LoadingScreen message="Loading projects..." />;
  }

  return (
    <div style={{ maxWidth: "1200px", padding: `0 ${tokens.spacing.md}` }}>
      <div className="animate-content" style={{ marginBottom: tokens.spacing.xl, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <h1 style={{ ...tokens.typography.headlineSmall, color: tokens.colors.onSurface, margin: 0 }}>
          Analysis Reports
        </h1>
        <p style={{ ...tokens.typography.bodyMedium, color: tokens.colors.onSurfaceVariant, margin: 0 }}>
          Generate and manage professional survey reports
        </p>
      </div>

      <ReportProjectSelector
        projects={state.projects}
        selectedProjectId={state.selectedProjectId}
        onProjectChange={actions.setSelectedProjectId}
        projectStats={state.projectStats}
      />

      {state.error && (
        <div
          className="animate-content"
          style={{
            padding: tokens.spacing.md,
            marginBottom: tokens.spacing.lg,
            backgroundColor: tokens.colors.errorContainer,
            color: tokens.colors.onErrorContainer,
            borderRadius: tokens.radius.md,
            ...tokens.typography.bodyMedium,
          }}
        >
          {state.error}
        </div>
      )}

      <ReportJobStatus
        jobStatus={state.jobStatus}
        generating={state.generating}
        existingJobId={state.existingJobId}
        onGenerate={actions.handleGenerateReport}
        onCancel={actions.handleCancelJob}
        cancelling={state.cancelling}
        projectStats={state.projectStats}
        showButton={false}
      />

      {state.reportLoading ? (
        <LoadingScreen message="Loading report data..." />
      ) : (
        <>
          {state.editedReport && (
            <div className="animate-content" style={{ position: "relative" }}>
              <div
                style={{
                  position: "sticky",
                  top: tokens.spacing.md,
                  zIndex: 10,
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: tokens.spacing.md,
                  pointerEvents: "none",
                }}
              >
                <div style={{ pointerEvents: "auto", display: "flex", gap: tokens.spacing.sm }}>
                  {state.hasUnsavedChanges && (
                    <span
                      style={{
                        padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                        backgroundColor: tokens.colors.tertiaryContainer,
                        color: tokens.colors.onTertiaryContainer,
                        borderRadius: tokens.radius.pill,
                        ...tokens.typography.labelMedium,
                        boxShadow: tokens.elevation.level1,
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      Unsaved changes
                    </span>
                  )}
                  <button
                    onClick={actions.handleSaveReport}
                    disabled={state.saveState === "saving" || !state.hasUnsavedChanges}
                    style={{
                      padding: `${tokens.spacing.sm} ${tokens.spacing.xl}`,
                      backgroundColor: state.saveState === "saving" || !state.hasUnsavedChanges
                        ? tokens.colors.surfaceVariant
                        : tokens.colors.primary,
                      color: state.saveState === "saving" || !state.hasUnsavedChanges
                        ? tokens.colors.onSurfaceVariant
                        : tokens.colors.onPrimary,
                      border: "none",
                      borderRadius: tokens.radius.pill,
                      cursor: state.saveState === "saving" || !state.hasUnsavedChanges ? "not-allowed" : "pointer",
                      ...tokens.typography.labelLarge,
                      boxShadow: tokens.elevation.level2,
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (state.saveState !== "saving" && state.hasUnsavedChanges) {
                        e.currentTarget.style.backgroundColor = tokens.colors.primaryContainer;
                        e.currentTarget.style.color = tokens.colors.onPrimaryContainer;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (state.saveState !== "saving" && state.hasUnsavedChanges) {
                        e.currentTarget.style.backgroundColor = tokens.colors.primary;
                        e.currentTarget.style.color = tokens.colors.onPrimary;
                      }
                    }}
                  >
                    {state.saveState === "saving" ? "Saving..." : state.saveState === "saved" ? "Saved!" : "Save Changes"}
                  </button>
                </div>
              </div>

              {state.saveError && (
                <div
                  className="animate-content"
                  style={{
                    padding: tokens.spacing.md,
                    marginBottom: tokens.spacing.md,
                    backgroundColor: tokens.colors.errorContainer,
                    color: tokens.colors.onErrorContainer,
                    borderRadius: tokens.radius.md,
                    ...tokens.typography.bodySmall,
                  }}
                >
                  {state.saveError}
                </div>
              )}

              <ReportExporter
                selectedProjectId={state.selectedProjectId}
                editedReport={state.editedReport}
                exportedFileUrl={state.exportedFileUrl}
                exportState={state.exportState}
                exportError={state.exportError}
                onExport={actions.handleExport}
              />

              <ReportEditor
                report={state.report}
                editedReport={state.editedReport}
                editedSections={state.editedSections}
                userProfile={state.userProfile}
                updateReportTitle={actions.updateReportTitle}
                updateSectionSummary={actions.updateSectionSummary}
                updateSectionRecommendations={actions.updateSectionRecommendations}
                updateImageCaption={actions.updateImageCaption}
                updateImageFinding={actions.updateImageFinding}
                updateImageRecommendation={actions.updateImageRecommendation}
                toggleHideImage={actions.toggleHideImage}
              />
            </div>
          )}

          {!state.editedReport && state.selectedProjectId && (
            <div
              className="animate-content"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: tokens.spacing.lg,
                padding: tokens.spacing.xl,
                backgroundColor: tokens.colors.surface,
                borderRadius: tokens.radius.lg,
                boxShadow: tokens.elevation.level1,
                border: `1px solid ${tokens.colors.outlineVariant}`,
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: `${tokens.spacing.xxl} ${tokens.spacing.xl}`,
                  backgroundColor: "var(--ref-primary-primary95)",
                  borderRadius: tokens.radius.lg,
                  textAlign: "center",
                  border: `2px dashed var(--ref-neutral-variant-neutral-variant90)`,
                }}
              >
                <svg
                  style={{
                    width: "48px",
                    height: "48px",
                    marginBottom: tokens.spacing.md,
                    fill: "var(--ref-primary-primary40)",
                  }}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
                </svg>
                <p
                  style={{
                    ...tokens.typography.titleMedium,
                    color: "var(--ref-primary-primary40)",
                    margin: 0,
                    marginBottom: tokens.spacing.xs,
                  }}
                >
                  No report found
                </p>
                <p
                  style={{
                    ...tokens.typography.bodySmall,
                    color: "var(--ref-neutral-variant-neutral-variant40)",
                    opacity: 0.8,
                    margin: 0,
                  }}
                >
                  Generate a report for this project to get started
                </p>
              </div>

              <button
                onClick={actions.handleGenerateReport}
                disabled={state.generating || state.reportLoading || !state.projectStats || state.projectStats.total === 0}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: `${tokens.spacing.md} ${tokens.spacing.xl}`,
                  backgroundColor: (state.generating || state.reportLoading || !state.projectStats || state.projectStats.total === 0) 
                    ? tokens.colors.surfaceVariant 
                    : tokens.colors.primary,
                  color: (state.generating || state.reportLoading || !state.projectStats || state.projectStats.total === 0)
                    ? tokens.colors.onSurfaceVariant 
                    : tokens.colors.onPrimary,
                  border: "none",
                  borderRadius: tokens.radius.md,
                  cursor: (state.generating || state.reportLoading || !state.projectStats || state.projectStats.total === 0) ? "not-allowed" : "pointer",
                  ...tokens.typography.labelLarge,
                  transition: "all 0.2s ease",
                  margin: 0,
                  minWidth: "200px",
                }}
                onMouseEnter={(e) => {
                  if (!state.generating && !state.reportLoading && state.projectStats && state.projectStats.total > 0) {
                    e.currentTarget.style.backgroundColor = tokens.colors.primaryContainer;
                    e.currentTarget.style.color = tokens.colors.onPrimaryContainer;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!state.generating && !state.reportLoading && state.projectStats && state.projectStats.total > 0) {
                    e.currentTarget.style.backgroundColor = tokens.colors.primary;
                    e.currentTarget.style.color = tokens.colors.onPrimary;
                  }
                }}
              >
                {state.generating ? "Generating..." : state.reportLoading ? "Loading..." : "Generate Report"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}