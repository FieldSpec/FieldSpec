"use client";

import { useRouter } from "next/navigation";
import { useReportState } from "@/hooks/useReportState";
import { tokens } from "@/lib/design-tokens";
import { ReportProjectSelector } from "@/components/dashboard/report/ReportProjectSelector";
import { ReportJobStatus } from "@/components/dashboard/report/ReportJobStatus";
import { ReportEditor } from "@/components/dashboard/report/ReportEditor";
import { ReportExporter } from "@/components/dashboard/report/ReportExporter";
import { LoadingScreen } from "@/lib/components/loading";

export default function ReportPage() {
  const router = useRouter();
  const { state, actions } = useReportState();

  if (state.loading) {
    return <LoadingScreen message="Loading projects..." />;
  }

  return (
    <div style={{ maxWidth: "1200px", padding: `0 ${tokens.spacing.md}`, paddingBottom: tokens.spacing.xxl }}>
      <div style={{ marginBottom: tokens.spacing.xl, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <h1 style={{ ...tokens.typography.headlineSmall, color: tokens.colors.onSurface, margin: 0 }}>
              Analysis Reports
            </h1>
            <p style={{ ...tokens.typography.bodyMedium, color: tokens.colors.onSurfaceVariant, margin: 0 }}>
              Generate and manage professional survey reports
            </p>
          </div>
           <button
             onClick={actions.handleGenerateReport}
             disabled={state.generating || state.reportLoading || !state.selectedProjectId || !state.projectStats || state.projectStats.total === 0}
             style={{
               display: "flex",
               alignItems: "center",
               gap: tokens.spacing.xs,
               padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
               backgroundColor: (state.generating || state.reportLoading || !state.selectedProjectId || !state.projectStats || state.projectStats.total === 0)
                 ? tokens.colors.surfaceVariant
                 : tokens.colors.primary,
               color: (state.generating || state.reportLoading || !state.selectedProjectId || !state.projectStats || state.projectStats.total === 0)
                 ? tokens.colors.onSurfaceVariant
                 : tokens.colors.onPrimary,
               border: "none",
               borderRadius: tokens.radius.md,
               cursor: (state.generating || state.reportLoading || !state.selectedProjectId || !state.projectStats || state.projectStats.total === 0) ? "not-allowed" : "pointer",
               opacity: (state.generating || state.reportLoading || !state.selectedProjectId || !state.projectStats || state.projectStats.total === 0) ? 0.6 : 1,
               ...tokens.typography.labelMedium,
               transition: "all 0.2s ease",
             }}
           >
              <span className="material-icons" style={{ fontSize: "18px" }}>description</span>
              {state.generating ? "Generating..." : state.reportLoading ? "Loading..." : state.editedReport ? "Regenerate Report" : "Generate Report"}
           </button>
         </div>
       </div>

      <ReportProjectSelector
        projects={state.projects}
        selectedProjectId={state.selectedProjectId}
        onProjectChange={actions.setSelectedProjectId}
        projectStats={state.projectStats}
      />

      {state.error && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: tokens.spacing.sm,
            padding: tokens.spacing.md,
            marginBottom: tokens.spacing.lg,
            backgroundColor: tokens.colors.errorContainer,
            color: tokens.colors.onErrorContainer,
            borderRadius: tokens.radius.md,
            ...tokens.typography.bodyMedium,
          }}
        >
          <span className="material-icons" style={{ fontSize: "18px" }}>error</span>
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
                  display: "flex",
                  justifyContent: "flex-end",
                  marginBottom: tokens.spacing.md,
                  pointerEvents: "none",
                }}
              >
                <div style={{ pointerEvents: "auto", display: "flex", gap: tokens.spacing.md, alignItems: "center" }}>
                  {state.hasUnsavedChanges && (
                    <span
                      style={{
                        padding: `${tokens.spacing.xs} ${tokens.spacing.sm}`,
                        backgroundColor: tokens.colors.tertiaryContainer,
                        color: tokens.colors.onTertiaryContainer,
                        borderRadius: tokens.radius.sm,
                        ...tokens.typography.labelSmall,
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
                      padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                      backgroundColor: !state.hasUnsavedChanges
                        ? tokens.colors.surfaceVariant
                        : tokens.colors.primary,
                      color: !state.hasUnsavedChanges
                        ? tokens.colors.onSurfaceVariant
                        : tokens.colors.onPrimary,
                      border: "none",
                      borderRadius: tokens.radius.md,
                      cursor: !state.hasUnsavedChanges ? "not-allowed" : "pointer",
                      opacity: !state.hasUnsavedChanges ? 0.6 : 1,
                      ...tokens.typography.labelMedium,
                      transition: "all 0.2s ease",
                    }}
                  >
                    {state.saveState === "saving" ? "Saving..." : state.saveState === "saved" ? "Saved!" : "Save Changes"}
                  </button>
                   <button
                     onClick={actions.handleDeleteReport}
                    style={{
                      padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                      backgroundColor: tokens.colors.errorContainer,
                      color: tokens.colors.onErrorContainer,
                      border: "none",
                      borderRadius: tokens.radius.md,
                      cursor: "pointer",
                      ...tokens.typography.labelMedium,
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = tokens.colors.error;
                      e.currentTarget.style.color = tokens.colors.onError;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = tokens.colors.errorContainer;
                      e.currentTarget.style.color = tokens.colors.onErrorContainer;
                    }}
                  >
                    Delete Report
                  </button>
                </div>
              </div>

              {state.saveError && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: tokens.spacing.sm,
                    padding: tokens.spacing.md,
                    marginBottom: tokens.spacing.md,
                    backgroundColor: tokens.colors.errorContainer,
                    color: tokens.colors.onErrorContainer,
                    borderRadius: tokens.radius.md,
                    ...tokens.typography.bodySmall,
                  }}
                >
                  <span className="material-icons" style={{ fontSize: "18px" }}>error</span>
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
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: tokens.spacing.lg,
                padding: tokens.spacing.xl,
                backgroundColor: tokens.colors.surface,
                borderRadius: tokens.radius.lg,
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
                  padding: tokens.spacing.xxl,
                  backgroundColor: tokens.colors.surfaceContainerHigh,
                  borderRadius: tokens.radius.lg,
                  textAlign: "center",
                  border: `2px dashed ${tokens.colors.outline}`,
                }}
              >
                <span className="material-icons"
                  style={{
                    color: tokens.colors.onSurfaceVariant,
                    fontSize: "48px",
                    marginBottom: tokens.spacing.md,
                  }}
                >
                  description
                </span>
                <p
                  style={{
                    ...tokens.typography.titleMedium,
                    color: tokens.colors.onSurface,
                    margin: 0,
                    marginBottom: tokens.spacing.xs,
                  }}
                >
                  No report found
                </p>
                <p
                  style={{
                    ...tokens.typography.bodySmall,
                    color: tokens.colors.onSurfaceVariant,
                    margin: 0,
                  }}
                >
                  Generate a report for this project to get started
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}