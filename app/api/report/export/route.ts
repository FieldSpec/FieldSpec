import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const projectId = body.projectId;

    if (!projectId) {
      return NextResponse.json({ error: { message: "projectId required" } }, { status: 400 });
    }

    const report = await prisma.report.findUnique({
      where: { projectId },
      include: { project: true },
    });

    if (!report) {
      return NextResponse.json({ error: { message: "Report not found" } }, { status: 404 });
    }

    let content: any;
    try {
      content = typeof report.content === "string" ? JSON.parse(report.content) : report.content;
    } catch {
      content = null;
    }

    if (!content) {
      return NextResponse.json({ error: { message: "Report content is invalid" } }, { status: 400 });
    }

    const sections = content.sections || [];
    if (!Array.isArray(sections) || sections.length === 0) {
      return NextResponse.json({ error: { message: "No sections in report" } }, { status: 400 });
    }

    const formatCategory = (cat: string) => {
      const labels: Record<string, string> = {
        crop_health: "Crop Health",
        erosion: "Erosion",
        damage: "Damage",
        irrigation: "Irrigation",
        general: "General Observations",
      };
      return labels[cat] || cat;
    };

    const formatConfidenceColor = (score: number) => {
      if (score >= 0.8) return "#22c55e";
      if (score >= 0.6) return "#eab308";
      return "#ef4444";
    };

    const getCategoryColor = (cat: string) => {
      const colors: Record<string, string> = {
        crop_health: "#22c55e",
        erosion: "#a855f7",
        damage: "#ef4444",
        irrigation: "#3b82f6",
        general: "#6b7280",
      };
      return colors[cat] || "#6b7280";
    };

    const generateSectionHtml = (section: any) => {
      const categoryColor = getCategoryColor(section.category);
      const imagesHtml = section.images?.map((img: any) => `
        <div class="image-entry">
          <div class="image-row">
            <img src="${img.imageUrl}" alt="Report image" />
            <div class="image-info">
              <p class="caption"><span class="label">Caption:</span> ${img.caption || "N/A"}</p>
              <p class="finding"><span class="label">Finding:</span> ${img.finding || "N/A"}</p>
              <p class="recommendation"><span class="label">Recommendation:</span> ${img.recommendation || "N/A"}</p>
              <div class="confidence-row">
                <span class="label">Confidence:</span>
                <span class="confidence-badge" style="background-color: ${formatConfidenceColor(img.confidenceScore)}20; color: ${formatConfidenceColor(img.confidenceScore)};">
                  ${Math.round(img.confidenceScore * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      `).join("") || "";

      return `
        <div class="section" style="border-left: 4px solid ${categoryColor};">
          <h2 style="color: ${categoryColor}; border-bottom: 1px solid #e5e7eb; padding-bottom: 10px;">${formatCategory(section.category)}</h2>
          <div class="summary-box">
            <p><strong>Summary</strong></p>
            <p>${section.summary || "N/A"}</p>
          </div>
          <div class="recommendations-box">
            <p><strong>Recommendations</strong></p>
            <pre>${section.recommendations || "N/A"}</pre>
          </div>
          ${imagesHtml ? `<div class="images-section"><h3>Analysis Images</h3><div class="images">${imagesHtml}</div></div>` : ""}
        </div>
      `;
    };

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${content.title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Inter', Arial, sans-serif; 
      padding: 0; 
      background: #ffffff;
      color: #1f2937;
      font-size: 11px;
      line-height: 1.5;
    }
    .page { padding: 40px; }
    .header { 
      display: flex; 
      justify-content: space-between; 
      align-items: flex-start;
      margin-bottom: 30px;
      padding-bottom: 20px;
      border-bottom: 3px solid #315f9b;
    }
    .header-left h1 { 
      color: #315f9b; 
      font-size: 24px; 
      font-weight: 700;
      margin-bottom: 5px;
    }
    .header-left .subtitle { 
      color: #6b7280; 
      font-size: 12px;
    }
    .header-right { text-align: right; }
    .header-right .report-date { 
      color: #6b7280; 
      font-size: 11px;
    }
    .header-right .logo { 
      color: #315f9b; 
      font-weight: 700;
      font-size: 14px;
      margin-top: 5px;
    }
    .meta-grid { 
      display: grid; 
      grid-template-columns: repeat(4, 1fr); 
      gap: 15px; 
      margin-bottom: 30px;
      background: #f8fafc;
      padding: 20px;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }
    .meta-item { }
    .meta-item .label { 
      color: #6b7280; 
      font-size: 10px; 
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .meta-item .value { 
      color: #1f2937; 
      font-weight: 600;
      font-size: 12px;
      margin-top: 3px;
    }
    .sections-header { 
      color: #315f9b; 
      font-size: 16px; 
      font-weight: 600;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e5e7eb;
    }
    .section { 
      margin-bottom: 30px; 
      padding: 20px; 
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      page-break-inside: avoid;
    }
    .section h2 { 
      font-size: 14px; 
      font-weight: 600;
      margin-bottom: 15px;
    }
    .summary-box, .recommendations-box { 
      margin-bottom: 15px;
    }
    .summary-box p:first-child, .recommendations-box p:first-child {
      color: #6b7280;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }
    .summary-box p:last-child, .recommendations-box pre { 
      color: #374151;
      font-size: 11px;
    }
    .recommendations-box pre { 
      white-space: pre-wrap; 
      background: #f8fafc;
      padding: 12px;
      border-radius: 6px;
      border: 1px solid #e5e7eb;
      line-height: 1.6;
    }
    .images-section { margin-top: 20px; }
    .images-section h3 { 
      color: #6b7280;
      font-size: 11px;
      font-weight: 500;
      margin-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .images { display: flex; flex-direction: column; gap: 15px; }
    .image-entry { 
      padding: 15px; 
      background: #f8fafc;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      page-break-inside: avoid;
    }
    .image-row { display: flex; gap: 15px; align-items: flex-start; }
    .image-entry img { 
      width: 120px; 
      height: 90px;
      object-fit: cover; 
      border-radius: 4px; 
      border: 1px solid #e5e7eb;
    }
    .image-info { flex: 1; }
    .image-info p { margin-bottom: 6px; font-size: 10px; }
    .image-info p.caption { font-weight: 500; }
    .image-info p.finding { color: #374151; }
    .image-info p.recommendation { color: #6b7280; font-size: 10px; }
    .image-info .label { color: #9ca3af; font-weight: 500; margin-right: 5px; }
    .confidence-row { display: flex; align-items: center; gap: 8px; margin-top: 5px; }
    .confidence-badge { 
      padding: 2px 8px;
      border-radius: 10px;
      font-size: 10px;
      font-weight: 600;
    }
    .footer { 
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      color: #9ca3af;
      font-size: 10px;
    }
    .footer .powered { color: #315f9b; font-weight: 600; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="page">
    <div class="header">
      <div class="header-left">
        <h1>FieldSpec</h1>
        <p class="subtitle">${content.title}</p>
      </div>
      <div class="header-right">
        <p class="report-date">Generated: ${new Date(content.generatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
        <p class="logo">FieldSpec</p>
      </div>
    </div>
    
    <div class="meta-grid">
      <div class="meta-item">
        <p class="label">Project</p>
        <p class="value">${content.projectName}</p>
      </div>
      <div class="meta-item">
        <p class="label">Location</p>
        <p class="value">${content.projectLocation || "Not specified"}</p>
      </div>
      <div class="meta-item">
        <p class="label">Images Analyzed</p>
        <p class="value">${content.totalImages}</p>
      </div>
      <div class="meta-item">
        <p class="label">Sections</p>
        <p class="value">${sections.length}</p>
      </div>
    </div>
    
    <h2 class="sections-header">Analysis Report</h2>
    ${sections.map(generateSectionHtml).join("")}
    
    <div class="footer">
      <p>Report generated by <span class="powered">FieldSpec</span> - AI-Powered Field Analysis Platform</p>
    </div>
  </div>
</body>
</html>`;

    return NextResponse.json({
      data: {
        html,
        contentType: "text/html",
      },
    }, { status: 200 });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: { message: error instanceof Error ? error.message : "Internal error" } },
      { status: 500 }
    );
  }
}