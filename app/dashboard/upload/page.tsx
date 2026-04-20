"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { tokens } from "@/lib/design-tokens";

/* ─── Types ─── */
interface Project { id: string; name: string; }
interface ImageType {
  id: string; url: string; thumbnailUrl: string;
  category: string; notes: string | null; createdAt: string;
}

/* ─── Constants ─── */
const CATEGORIES = [
  { value: "all",        label: "All" },
  { value: "crop_health",label: "Crop Health" },
  { value: "erosion",    label: "Erosion" },
  { value: "damage",     label: "Damage" },
  { value: "irrigation", label: "Irrigation" },
  { value: "general",    label: "General" },
  { value: "untagged",   label: "Untagged" },
];
const CATEGORY_OPTIONS = CATEGORIES.filter(c => c.value !== "all" && c.value !== "untagged");

/* ─── Helpers ─── */
function formatDate(s: string) {
  return new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function getCategoryLabel(cat: string | null) {
  if (!cat || cat === "general") return "Untagged";
  return CATEGORY_OPTIONS.find(c => c.value === cat)?.label ?? cat;
}
const CAT_EMOJIS: Record<string, string> = {
  crop_health: "🌿", erosion: "🏔️", damage: "⚠️",
  irrigation: "💧", general: "📁", untagged: "🏷️",
};

/* ══════════════════════════════════════════════════════════
    COMPONENT
══════════════════════════════════════════════════════════ */
export default function UploadPage() {
  const [projects,          setProjects]          = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [images,            setImages]            = useState<ImageType[]>([]);
  const [loading,           setLoading]           = useState(true);
  const [uploading,         setUploading]         = useState(false);
  const [uploadProgress,    setUploadProgress]    = useState(0);
  const [error,             setError]             = useState("");
  const [filter,            setFilter]            = useState("all");
  const [editingImage,      setEditingImage]      = useState<ImageType | null>(null);
  const [saving,            setSaving]            = useState(false);
  const [saveSuccess,       setSaveSuccess]       = useState(false);
  const [deletingId,        setDeletingId]        = useState<string | null>(null);
  const [isDragging,        setIsDragging]        = useState(false);
  const [selectedRows,      setSelectedRows]      = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchProjects(); }, []);
  useEffect(() => { if (selectedProjectId) fetchImages(); }, [selectedProjectId]);

  async function fetchProjects() {
    try {
      const res  = await fetch("/api/projects");
      const data = await res.json();
      if (res.ok && data.data) {
        setProjects(data.data);
        if (data.data.length > 0) setSelectedProjectId(data.data[0].id);
      }
    } catch { /* silent */ } finally { setLoading(false); }
  }

  async function fetchImages() {
    if (!selectedProjectId) return;
    try {
      const res  = await fetch(`/api/images?projectId=${selectedProjectId}`);
      const data = await res.json();
      if (res.ok && data.data) setImages(data.data);
    } catch { /* silent */ }
  }

  async function processUpload(file: File) {
    setUploading(true); setError(""); setUploadProgress(0);
    const timer = setInterval(() => setUploadProgress(p => Math.min(p + 7, 84)), 200);
    try {
      const signedRes  = await fetch("/api/upload/signed-url", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, fileType: file.type }),
      });
      const signedData = await signedRes.json();
      clearInterval(timer);
      if (!signedRes.ok || !signedData.data) { setError(signedData.error?.message || "Failed to get upload config"); return; }

      const { cloudName, uploadPreset, folder } = signedData.data;
      const fd = new FormData();
      fd.append("file", file); fd.append("upload_preset", uploadPreset);
      if (folder) fd.append("folder", folder);

      const cRes  = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: fd });
      const cData = await cRes.json();
      if (!cRes.ok || cData.error) { setError(cData.error?.message || "Upload failed"); return; }

      setUploadProgress(92);
      const saveRes  = await fetch("/api/images", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: selectedProjectId, imageUrl: cData.secure_url, thumbnailUrl: cData.eager?.[0]?.secure_url || cData.secure_url }),
      });
      const saveData = await saveRes.json();
      if (!saveRes.ok || !saveData.data) { setError(saveData.error?.message || "Failed to save image"); return; }

      setUploadProgress(100);
      setTimeout(() => { setImages(prev => [saveData.data, ...prev]); setUploadProgress(0); setUploading(false); }, 400);
    } catch { setError("Upload failed. Please try again."); setUploading(false); setUploadProgress(0); clearInterval(timer);
    } finally { if (fileInputRef.current) fileInputRef.current.value = ""; }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (f) processUpload(f);
  };
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f?.type.startsWith("image/")) processUpload(f);
    else if (f) setError("Only image files are supported.");
  }, [selectedProjectId, images]);

  async function handleCategoryChange(id: string, cat: string) {
    try {
      const res  = await fetch(`/api/images/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ category: cat }) });
      const data = await res.json();
      if (res.ok) setImages(imgs => imgs.map(i => i.id === id ? data.data : i));
      else setError("Failed to update category");
    } catch { setError("Failed to update category"); }
  }

  async function handleSaveNotes() {
    if (!editingImage) return;
    setSaving(true); setError("");
    try {
      const res  = await fetch(`/api/images/${editingImage.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ notes: editingImage.notes || "" }) });
      const data = await res.json();
      if (!res.ok) { setError("Failed to save notes"); return; }
      setImages(imgs => imgs.map(i => i.id === editingImage.id ? data.data : i));
      setSaveSuccess(true);
      setTimeout(() => { setEditingImage(null); setSaveSuccess(false); }, 900);
    } catch { setError("Failed to save notes"); } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this record?")) return;
    setDeletingId(id); setError("");
    try {
      const res = await fetch(`/api/images/${id}`, { method: "DELETE" });
      if (res.ok) { setImages(imgs => imgs.filter(i => i.id !== id)); setSelectedRows(prev => { const n = new Set(prev); n.delete(id); return n; }); }
      else { const d = await res.json(); setError(d.error?.message || "Failed to delete"); }
    } catch { setError("Failed to delete. Please try again."); } finally { setDeletingId(null); }
  }

  const toggleRow = (id: string) => setSelectedRows(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleAll = () => setSelectedRows(prev => prev.size === filteredImages.length ? new Set() : new Set(filteredImages.map(i => i.id)));

  const filteredImages = images.filter(img => {
    if (filter === "all")      return true;
    if (filter === "untagged") return !img.category || img.category === "general";
    return img.category === filter;
  });

  /* ══════════ RENDER ══════════ */
  return (
    <div className="up-page">
      <style>{CSS}</style>

      {/* ─── 1. PAGE HEADER ─── */}
      <div className="up-header">
        <div className="up-header-left">
          <h1 className="up-title">Upload Data</h1>
          <p className="up-subtitle">
            Securely upload and organise high-resolution orthomosaics, field captures,
            and drone telemetry for AI-driven analysis.
          </p>
        </div>

        {/* Project selector — always shown; disabled while loading */}
        <div className="up-project-wrap">
          <span className="up-project-label">Target Project</span>
          <div className="up-select-shell">
            <svg className="up-select-lead" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>
            </svg>
            <select
              id="project-select"
              className="up-select"
              value={selectedProjectId}
              onChange={e => setSelectedProjectId(e.target.value)}
              disabled={loading || projects.length === 0}
            >
              {projects.length === 0
                ? <option value="">No projects yet</option>
                : projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)
              }
            </select>
            <svg className="up-select-chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </div>
          {projects.length === 0 && !loading && (
            <p className="up-no-project-hint">
              <a href="/dashboard/projects" className="up-link">Create a project</a> to start uploading.
            </p>
          )}
        </div>
      </div>

      {/* ─── 2. UPLOAD ZONE ─── */}
      <input ref={fileInputRef} type="file" id="file-upload" accept="image/*,.tif,.tiff,.las,.laz"
        onChange={handleFileSelect} disabled={uploading} style={{ display: "none" }} />

      <div
        id="upload-drop-zone"
        className={`up-zone${isDragging ? " up-zone--drag" : ""}${uploading ? " up-zone--busy" : ""}${projects.length === 0 && !loading ? " up-zone--disabled" : ""}`}
        onDrop={handleDrop}
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onClick={() => { if (!uploading && projects.length > 0) fileInputRef.current?.click(); }}
        role="button" tabIndex={0} aria-disabled={projects.length === 0}
        onKeyDown={e => { if ((e.key === "Enter" || e.key === " ") && projects.length > 0) fileInputRef.current?.click(); }}
      >
        {uploading ? (
          <div className="up-zone-inner">
            <div className="up-progress-ring">
              <svg width="56" height="56" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="23" fill="none" stroke="var(--sys-surface-roles-surface-container)" strokeWidth="4"/>
                <circle cx="28" cy="28" r="23" fill="none" stroke="var(--sys-primary)" strokeWidth="4"
                  strokeLinecap="round" strokeDasharray={`${uploadProgress * 1.445} 144.5`} transform="rotate(-90 28 28)"
                  style={{ transition: "stroke-dasharray .3s ease" }}/>
              </svg>
              <span className="up-pct">{uploadProgress}%</span>
            </div>
            <p className="up-zone-primary">Uploading…</p>
            <p className="up-zone-hint">Please don&apos;t close this tab</p>
          </div>
        ) : (
          <div className="up-zone-inner">
            <div className="up-zone-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
              </svg>
            </div>
            <p className="up-zone-primary">{isDragging ? "Drop your file here" : "Drag & drop files here"}</p>
            <p className="up-zone-or">or</p>
            <button
              id="browse-files-btn"
              type="button"
              className="up-btn-primary"
              disabled={projects.length === 0}
              onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/>
                <path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/>
              </svg>
              Browse Files
            </button>
            <p className="up-zone-formats">JPG · PNG · TIFF · GeoTIFF · LAS · LAZ &nbsp;·&nbsp; Max 500 MB</p>
          </div>
        )}
      </div>

      {/* Error banner */}
      {error && (
        <div className="up-error" role="alert" id="upload-error">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span>{error}</span>
          <button className="up-error-x" onClick={() => setError("")} aria-label="Dismiss">×</button>
        </div>
      )}

      {/* ─── RECENT RECORDS TABLE ─── */}
      <div className="up-records-card">
        {/* Table header */}
        <div className="up-records-hd">
          <div>
            <h2 className="up-records-title">Recent Drone Records</h2>
            <p className="up-records-count">{filteredImages.length} of {images.length} records</p>
          </div>
          <div className="up-records-actions">
            {selectedRows.size > 0 && (
              <span className="up-sel-badge">{selectedRows.size} selected</span>
            )}
          </div>
        </div>

        {/* Filter chips */}
        <div className="up-chips" role="tablist">
          {CATEGORIES.map(cat => (
            <button
              key={cat.value}
              id={`filter-${cat.value}`}
              role="tab"
              aria-selected={filter === cat.value}
              className={`up-chip${filter === cat.value ? " up-chip--active" : ""}`}
              onClick={() => setFilter(cat.value)}
            >
              {cat.value !== "all" && <span className="up-chip-emoji">{CAT_EMOJIS[cat.value]}</span>}
              {cat.label}
              {cat.value !== "all" && (
                <span className="up-chip-count">
                  {cat.value === "untagged"
                    ? images.filter(i => !i.category || i.category === "general").length
                    : images.filter(i => i.category === cat.value).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="up-table-wrap">
          <table className="up-table">
            <thead>
              <tr>
                <th className="up-th up-th-chk">
                  <input type="checkbox" className="up-chk" id="select-all-checkbox"
                    checked={filteredImages.length > 0 && selectedRows.size === filteredImages.length}
                    onChange={toggleAll} aria-label="Select all"/>
                </th>
                <th className="up-th">File Name</th>
                <th className="up-th">Type</th>
                <th className="up-th">Date Uploaded</th>
                <th className="up-th">Status</th>
                <th className="up-th">Size</th>
                <th className="up-th up-th-act"/>
              </tr>
            </thead>
            <tbody>
              {filteredImages.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <div className="up-table-empty">
                      <div className="up-table-empty-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                          <polyline points="14 2 14 8 20 8"/>
                          <line x1="16" y1="13" x2="8" y2="13"/>
                          <line x1="16" y1="17" x2="8" y2="17"/>
                        </svg>
                      </div>
                      <p className="up-table-empty-title">No records found</p>
                      <p className="up-table-empty-sub">
                        {filter === "all"
                          ? "Upload your first drone capture to see records here."
                          : `No records match the "${CATEGORIES.find(c => c.value === filter)?.label}" filter.`}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredImages.map((img, idx) => (
                  <tr
                    key={img.id}
                    id={`record-row-${idx}`}
                    className={`up-tr${selectedRows.has(img.id) ? " up-tr--sel" : ""}`}
                  >
                    <td className="up-td up-td-chk">
                      <input type="checkbox" className="up-chk"
                        checked={selectedRows.has(img.id)} onChange={() => toggleRow(img.id)}
                        aria-label={`Select row ${idx + 1}`}/>
                    </td>
                    <td className="up-td">
                      <div className="up-file-info">
                        <div className="up-thumb">
                          <img src={img.thumbnailUrl} alt="" className="up-thumb-img"/>
                        </div>
                        <span className="up-file-name">
                          {img.url.split("/").pop()?.split("?")[0] || `capture-${idx + 1}`}
                        </span>
                      </div>
                    </td>
                    <td className="up-td">
                      <select
                        className="up-cat-select"
                        value={img.category || "general"}
                        onChange={e => handleCategoryChange(img.id, e.target.value)}
                        aria-label="Category"
                      >
                        {CATEGORY_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </td>
                    <td className="up-td up-td-date">{formatDate(img.createdAt)}</td>
                    <td className="up-td">
                      <span className="up-badge up-badge--ok">
                        <span className="up-badge-dot"/>Processed
                      </span>
                    </td>
                    <td className="up-td up-td-size">—</td>
                    <td className="up-td up-td-act">
                      <div className="up-row-acts">
                        <button className="up-act-btn" title="Edit note" aria-label="Edit note"
                          onClick={() => setEditingImage(img)}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button className="up-act-btn up-act-btn--del" title="Delete" aria-label="Delete"
                          disabled={deletingId === img.id} onClick={() => handleDelete(img.id)}>
                          {deletingId === img.id ? (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="up-spin">
                              <path d="M12 2a10 10 0 010 20"/>
                            </svg>
                          ) : (
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                              <path d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                            </svg>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer / pagination */}
        <div className="up-table-foot">
          <span className="up-foot-count">1 – {filteredImages.length} of {filteredImages.length}</span>
          <div className="up-foot-nav">
            <button className="up-nav-btn" disabled aria-label="Previous page">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <button className="up-nav-btn" disabled aria-label="Next page">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* ─── 6. NOTES MODAL ─── */}
      {editingImage && (
        <div className="up-modal-bg" id="notes-modal" role="dialog" aria-modal="true"
          aria-labelledby="modal-title" onClick={() => setEditingImage(null)}>
          <div className="up-modal" onClick={e => e.stopPropagation()}>
            <div className="up-modal-hd">
              <h3 id="modal-title" className="up-modal-title">
                {editingImage.notes ? "Edit Note" : "Add Note"}
              </h3>
              <button className="up-modal-close" aria-label="Close"
                onClick={() => setEditingImage(null)}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            {editingImage.thumbnailUrl && (
              <div className="up-modal-thumb-wrap">
                <img src={editingImage.thumbnailUrl} alt="" className="up-modal-thumb"/>
                <span className="up-modal-cat-badge">
                  {CAT_EMOJIS[editingImage.category] || "📁"} {getCategoryLabel(editingImage.category)}
                </span>
              </div>
            )}
            <div className="up-modal-body">
              <label className="up-modal-lbl" htmlFor="note-textarea">Field Note</label>
              <textarea
                id="note-textarea"
                className="up-modal-ta"
                value={editingImage.notes || ""}
                onChange={e => setEditingImage({ ...editingImage, notes: e.target.value })}
                placeholder="Add observations about this capture…"
                maxLength={500}
              />
              <span className={`up-modal-chars${(editingImage.notes || "").length > 450 ? " up-modal-chars--warn" : ""}`}>
                {(editingImage.notes || "").length}/500
              </span>
              {error && (
                <div className="up-modal-err">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  {error}
                </div>
              )}
            </div>
            <div className="up-modal-ft">
              <button className="up-btn-ghost" id="modal-cancel-btn" onClick={() => setEditingImage(null)}>Cancel</button>
              <button
                id="modal-save-btn"
                className={`up-btn-primary${saveSuccess ? " up-btn-primary--ok" : ""}`}
                onClick={handleSaveNotes} disabled={saving}
              >
                {saving ? "Saving…" : saveSuccess ? "✓ Saved!" : "Save Note"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SCOPED CSS  —  uses only design-token vars for colour
══════════════════════════════════════════════════════════ */
const CSS = `
/* shared font */
.up-page { font-family: var(--sys-typescale-body-large-fontfamily,"IBM Plex Sans",sans-serif); max-width:1200px; padding-bottom:56px; }

/* ── Header ── */
.up-header { display:flex; align-items:flex-start; justify-content:space-between; gap:24px; flex-wrap:wrap; margin-bottom:24px; }
.up-title  { font-size:26px; font-weight:600; letter-spacing:-.3px; color:var(--sys-surface-roles-on-surface); margin:0 0 6px; }
.up-subtitle { font-size:14px; line-height:1.6; color:var(--sys-surface-roles-on-surface-variant); margin:0; max-width:480px; }
.up-project-wrap { display:flex; flex-direction:column; gap:5px; min-width:210px; }
.up-project-label { font-size:11px; font-weight:600; letter-spacing:.07em; text-transform:uppercase; color:var(--sys-surface-roles-on-surface-variant); }
.up-select-shell { position:relative; display:flex; align-items:center; }
.up-select-lead, .up-select-chevron { position:absolute; pointer-events:none; color:var(--sys-surface-roles-on-surface-variant); }
.up-select-lead { left:11px; }
.up-select-chevron { right:11px; }
.up-select { width:100%; padding:9px 34px 9px 34px; border:1px solid var(--sys-outline-roles-outline-variant); border-radius:var(--sys-radius-md); background:var(--sys-surface-roles-surface-container-low); color:var(--sys-surface-roles-on-surface); font-size:13.5px; font-family:inherit; appearance:none; cursor:pointer; outline:none; transition:border-color .15s,box-shadow .15s; }
.up-select:hover { border-color:var(--sys-outline-roles-outline); }
.up-select:focus { border-color:var(--sys-primary); box-shadow:0 0 0 3px color-mix(in srgb,var(--sys-primary) 14%,transparent); }
.up-select:disabled { opacity:.55; cursor:not-allowed; }
.up-no-project-hint { font-size:12px; color:var(--sys-surface-roles-on-surface-variant); margin:2px 0 0; }
.up-link { color:var(--sys-primary); text-decoration:none; font-weight:500; }
.up-link:hover { text-decoration:underline; }

/* ── Upload Zone ── */
.up-zone { border:2px dashed var(--sys-outline-roles-outline-variant); border-radius:var(--sys-radius-xl); background:var(--sys-surface-roles-surface-container-low); padding:40px 32px; text-align:center; cursor:pointer; transition:border-color .2s,background .2s,transform .15s; margin-bottom:24px; outline:none; position:relative; overflow:hidden; }
.up-zone::before { content:''; position:absolute; inset:0; background:radial-gradient(ellipse at center,color-mix(in srgb,var(--sys-primary) 5%,transparent),transparent 68%); opacity:0; transition:opacity .25s; pointer-events:none; }
.up-zone:hover, .up-zone:focus { border-color:var(--sys-primary); background:color-mix(in srgb,var(--sys-primary) 3%,var(--sys-surface-roles-surface-container-low)); }
.up-zone:hover::before, .up-zone:focus::before { opacity:1; }
.up-zone--drag { border-color:var(--sys-primary)!important; transform:scale(1.006); background:color-mix(in srgb,var(--sys-primary) 6%,var(--sys-surface-roles-surface-container-low))!important; }
.up-zone--drag::before { opacity:1!important; }
.up-zone--busy, .up-zone--disabled { cursor:not-allowed; }
.up-zone-inner { display:flex; flex-direction:column; align-items:center; gap:10px; position:relative; z-index:1; }
.up-zone-icon { width:60px; height:60px; border-radius:50%; background:color-mix(in srgb,var(--sys-primary) 11%,transparent); display:flex; align-items:center; justify-content:center; color:var(--sys-primary); transition:background .2s,transform .2s; }
.up-zone:hover .up-zone-icon { background:color-mix(in srgb,var(--sys-primary) 17%,transparent); transform:translateY(-2px); }
.up-zone-primary { font-size:15px; font-weight:500; color:var(--sys-surface-roles-on-surface); margin:0; }
.up-zone-or      { font-size:13px; color:var(--sys-surface-roles-on-surface-variant); margin:0; }
.up-zone-formats { font-size:11.5px; color:var(--sys-surface-roles-on-surface-variant); margin:0; opacity:.75; }
/* progress ring */
.up-progress-ring { position:relative; width:56px; height:56px; display:flex; align-items:center; justify-content:center; }
.up-progress-ring svg { position:absolute; inset:0; width:100%; height:100%; }
.up-pct { font-size:12px; font-weight:600; color:var(--sys-primary); position:relative; z-index:1; }
.up-zone-hint { font-size:12px; color:var(--sys-surface-roles-on-surface-variant); margin:0; }

/* ── Error ── */
.up-error { display:flex; align-items:center; gap:9px; padding:11px 14px; border-radius:var(--sys-radius-md); background:var(--sys-error-container); color:var(--sys-on-error-container); font-size:13.5px; margin-bottom:20px; animation:upSlideDown .2s ease; }
.up-error-x { margin-left:auto; background:none; border:none; color:inherit; font-size:18px; cursor:pointer; opacity:.7; line-height:1; padding:0 2px; }
.up-error-x:hover { opacity:1; }

/* ── Stats Grid ── */
.up-stats-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:28px; }
.up-stat-card { 
  background:color-mix(in srgb,var(--sys-primary-container) 35%,var(--sys-surface-roles-surface-container-low)); 
  border:1px solid var(--sys-outline-roles-outline-variant); 
  border-radius:var(--sys-radius-lg); 
  padding:20px; 
  display:flex; 
  flex-direction:column; 
  gap:5px; 
  transition:box-shadow .25s ease,transform .2s ease,border-color .25s ease,background .25s ease; 
  position:relative;
  overflow:hidden;
}
.up-stat-card::before {
  content:'';
  position:absolute;
  inset:0;
  background:radial-gradient(ellipse at top left,color-mix(in srgb,var(--sys-primary) 8%,transparent),transparent 60%);
  opacity:0;
  transition:opacity .25s ease;
  pointer-events:none;
}
.up-stat-card:hover { 
  box-shadow:0 4px 16px color-mix(in srgb,var(--sys-primary) 18%,transparent),var(--sys-elevation-6dp-penumbra); 
  transform:translateY(-2px);
  border-color:color-mix(in srgb,var(--sys-primary) 40%,var(--sys-outline-roles-outline-variant));
  background:color-mix(in srgb,var(--sys-primary-container) 45%,var(--sys-surface-roles-surface-container-low));
}
.up-stat-card:hover::before { opacity:1; }
.up-stat-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:6px; position:relative; z-index:1; }
.up-stat-icon { width:36px; height:36px; border-radius:var(--sys-radius-md); display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:box-shadow .25s ease,transform .2s ease; }
.up-stat-icon--primary   { background:var(--sys-primary-container);   color:var(--sys-on-primary-container); }
.up-stat-icon--secondary { background:var(--sys-secondary-container); color:var(--sys-on-secondary-container); }
.up-stat-icon--tertiary  { background:var(--sys-tertiary-container);  color:var(--sys-on-tertiary-container); }
.up-stat-icon--error     { background:var(--sys-error-container);     color:var(--sys-on-error-container); }
.up-stat-card:hover .up-stat-icon--primary   { box-shadow:0 2px 10px color-mix(in srgb,var(--sys-primary) 30%,transparent); transform:scale(1.05); }
.up-stat-card:hover .up-stat-icon--secondary { box-shadow:0 2px 10px color-mix(in srgb,var(--sys-secondary) 30%,transparent); transform:scale(1.05); }
.up-stat-card:hover .up-stat-icon--tertiary  { box-shadow:0 2px 10px color-mix(in srgb,var(--sys-tertiary) 30%,transparent); transform:scale(1.05); }
.up-stat-card:hover .up-stat-icon--error     { box-shadow:0 2px 10px color-mix(in srgb,var(--sys-error) 30%,transparent); transform:scale(1.05); }
.up-stat-trend { font-size:11px; font-weight:600; padding:3px 8px; border-radius:999px; }
.up-stat-trend--up { background:color-mix(in srgb,#45ba4b 14%,transparent); color:#37953c; }
.up-stat-trend--dn { background:color-mix(in srgb,var(--sys-error) 12%,transparent); color:var(--sys-error); }
.up-stat-value { font-size:28px; font-weight:600; letter-spacing:-1px; color:var(--sys-surface-roles-on-surface); line-height:1.1; }
.up-stat-label { font-size:13px; font-weight:500; color:var(--sys-surface-roles-on-surface); }
.up-stat-sub   { font-size:12px; color:var(--sys-surface-roles-on-surface-variant); }

/* ── Section heading ── */
.up-section-head { margin-bottom:16px; }
.up-section-title { font-size:16px; font-weight:600; color:var(--sys-surface-roles-on-surface); margin:0 0 3px; }
.up-section-sub   { font-size:13px; color:var(--sys-surface-roles-on-surface-variant); margin:0; }

/* ── Data-type Cards ── */
.up-dtype-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; margin-bottom:28px; }
.up-dtype-card { 
  background:var(--sys-surface-roles-surface-container-low); 
  border:1px solid var(--sys-outline-roles-outline-variant); 
  border-radius:var(--sys-radius-lg); 
  padding:18px; 
  display:flex; 
  flex-direction:column; 
  gap:12px; 
  transition:box-shadow .25s ease,transform .2s ease,border-color .25s ease,background .25s ease; 
  position:relative; 
  overflow:hidden; 
}
.up-dtype-card::before { 
  content:''; 
  position:absolute; 
  top:0; 
  left:0; 
  right:0; 
  height:3px; 
  opacity:.7; 
  border-radius:var(--sys-radius-lg) var(--sys-radius-lg) 0 0; 
  transition:opacity .25s ease;
}
.up-dtype-card--primary::before   { background:var(--sys-primary); }
.up-dtype-card--secondary::before { background:var(--sys-secondary); }
.up-dtype-card--tertiary::before  { background:var(--sys-tertiary); }
.up-dtype-card--error::before     { background:var(--sys-error); }
.up-dtype-card:hover { 
  box-shadow:0 6px 20px color-mix(in srgb,var(--sys-primary) 15%,transparent),var(--sys-elevation-6dp-penumbra); 
  transform:translateY(-2px); 
  border-color:color-mix(in srgb,var(--sys-primary) 35%,var(--sys-outline-roles-outline-variant));
}
.up-dtype-card:hover::before { opacity:1; }
.up-dtype-card:hover .up-dtype-icon { transform:scale(1.05); }
.up-dtype-card:hover .up-dtype-icon--primary   { box-shadow:0 2px 12px color-mix(in srgb,var(--sys-primary) 35%,transparent); }
.up-dtype-card:hover .up-dtype-icon--secondary { box-shadow:0 2px 12px color-mix(in srgb,var(--sys-secondary) 35%,transparent); }
.up-dtype-card:hover .up-dtype-icon--tertiary  { box-shadow:0 2px 12px color-mix(in srgb,var(--sys-tertiary) 35%,transparent); }
.up-dtype-card:hover .up-dtype-icon--error     { box-shadow:0 2px 12px color-mix(in srgb,var(--sys-error) 35%,transparent); }

.up-dtype-card--primary:hover { 
  border-color:color-mix(in srgb,var(--sys-primary) 45%,var(--sys-outline-roles-outline-variant));
  box-shadow:0 6px 20px color-mix(in srgb,var(--sys-primary) 18%,transparent),var(--sys-elevation-6dp-penumbra);
}
.up-dtype-card--secondary:hover { 
  border-color:color-mix(in srgb,var(--sys-secondary) 45%,var(--sys-outline-roles-outline-variant));
  box-shadow:0 6px 20px color-mix(in srgb,var(--sys-secondary) 18%,transparent),var(--sys-elevation-6dp-penumbra);
}
.up-dtype-card--tertiary:hover { 
  border-color:color-mix(in srgb,var(--sys-tertiary) 45%,var(--sys-outline-roles-outline-variant));
  box-shadow:0 6px 20px color-mix(in srgb,var(--sys-tertiary) 18%,transparent),var(--sys-elevation-6dp-penumbra);
}
.up-dtype-card--error:hover { 
  border-color:color-mix(in srgb,var(--sys-error) 45%,var(--sys-outline-roles-outline-variant));
  box-shadow:0 6px 20px color-mix(in srgb,var(--sys-error) 18%,transparent),var(--sys-elevation-6dp-penumbra);
}
.up-dtype-icon { width:42px; height:42px; border-radius:var(--sys-radius-md); display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:box-shadow .25s ease,transform .2s ease; }
.up-dtype-icon--primary   { background:var(--sys-primary-container);   color:var(--sys-on-primary-container); }
.up-dtype-icon--secondary { background:var(--sys-secondary-container); color:var(--sys-on-secondary-container); }
.up-dtype-icon--tertiary  { background:var(--sys-tertiary-container);  color:var(--sys-on-tertiary-container); }
.up-dtype-icon--error     { background:var(--sys-error-container);     color:var(--sys-on-error-container); }
.up-dtype-body { flex:1; }
.up-dtype-title { font-size:14px; font-weight:600; color:var(--sys-surface-roles-on-surface); margin:0 0 4px; }
.up-dtype-desc  { font-size:12.5px; color:var(--sys-surface-roles-on-surface-variant); margin:0 0 6px; line-height:1.5; }
.up-dtype-meta  { font-size:11px; font-weight:500; color:var(--sys-surface-roles-on-surface-variant); background:var(--sys-surface-roles-surface-container); padding:3px 8px; border-radius:999px; display:inline-block; }
.up-dtype-upload { display:inline-flex; align-items:center; gap:5px; padding:7px 14px; border-radius:var(--sys-radius-sm); background:var(--sys-surface-roles-surface-container); color:var(--sys-surface-roles-on-surface); font-size:12.5px; font-weight:500; font-family:inherit; border:1px solid var(--sys-outline-roles-outline-variant); cursor:pointer; transition:background .15s,border-color .15s; align-self:flex-start; }
.up-dtype-upload:hover:not(:disabled) { background:var(--sys-surface-roles-surface-container-high); border-color:var(--sys-outline-roles-outline); }
.up-dtype-upload:disabled { opacity:.45; cursor:not-allowed; }

/* ── Records Card ── */
.up-records-card { background:var(--sys-surface-roles-surface-container-low); border:1px solid var(--sys-outline-roles-outline-variant); border-radius:var(--sys-radius-lg); overflow:hidden; }
.up-records-hd   { display:flex; align-items:center; justify-content:space-between; padding:20px 24px 0; flex-wrap:wrap; gap:12px; }
.up-records-title { font-size:15px; font-weight:600; color:var(--sys-surface-roles-on-surface); margin:0 0 2px; }
.up-records-count { font-size:12px; color:var(--sys-surface-roles-on-surface-variant); margin:0; }
.up-records-actions { display:flex; align-items:center; gap:10px; }
.up-sel-badge { font-size:12px; font-weight:500; padding:4px 10px; border-radius:999px; background:var(--sys-primary-container); color:var(--sys-on-primary-container); }

/* ── Filter chips ── */
.up-chips { display:flex; gap:6px; padding:14px 24px; flex-wrap:wrap; border-bottom:1px solid var(--sys-outline-roles-outline-variant); }
.up-chip  { display:inline-flex; align-items:center; gap:5px; padding:5px 12px; border-radius:999px; font-size:12.5px; font-weight:500; font-family:inherit; border:1px solid var(--sys-outline-roles-outline-variant); background:transparent; color:var(--sys-surface-roles-on-surface-variant); cursor:pointer; transition:background .15s,color .15s,border-color .15s; line-height:1; }
.up-chip:hover { background:var(--sys-surface-roles-surface-container); color:var(--sys-surface-roles-on-surface); border-color:var(--sys-outline-roles-outline); }
.up-chip--active { background:var(--sys-primary); color:var(--sys-on-primary); border-color:var(--sys-primary); }
.up-chip--active:hover { background:var(--sys-primary); color:var(--sys-on-primary); }
.up-chip-emoji { font-size:11px; }
.up-chip-count { font-size:10.5px; opacity:.7; }

/* ── Table ── */
.up-table-wrap { overflow-x:auto; }
.up-table { width:100%; border-collapse:collapse; font-size:13.5px; }
.up-table thead tr { border-bottom:1px solid var(--sys-outline-roles-outline-variant); }
.up-th { padding:10px 16px; text-align:left; font-size:10.5px; font-weight:600; letter-spacing:.07em; text-transform:uppercase; color:var(--sys-surface-roles-on-surface-variant); white-space:nowrap; background:var(--sys-surface-roles-surface-container); }
.up-th-chk { width:44px; padding-left:24px; }
.up-th-act { width:80px; }
.up-tr { border-bottom:1px solid var(--sys-outline-roles-outline-variant); transition:background .1s; }
.up-tr:last-child { border-bottom:none; }
.up-tr:hover { background:var(--sys-surface-roles-surface-container); }
.up-tr--sel { background:color-mix(in srgb,var(--sys-primary) 6%,transparent); }
.up-tr--sel:hover { background:color-mix(in srgb,var(--sys-primary) 9%,transparent); }
.up-td { padding:11px 16px; color:var(--sys-surface-roles-on-surface); vertical-align:middle; }
.up-td-chk { padding-left:24px; }
.up-td-date, .up-td-size { color:var(--sys-surface-roles-on-surface-variant); white-space:nowrap; font-size:13px; }
.up-chk { width:15px; height:15px; border-radius:4px; accent-color:var(--sys-primary); cursor:pointer; }
.up-file-info { display:flex; align-items:center; gap:10px; }
.up-thumb { width:34px; height:34px; border-radius:var(--sys-radius-sm); overflow:hidden; background:var(--sys-surface-roles-surface-container); flex-shrink:0; }
.up-thumb-img { width:100%; height:100%; object-fit:cover; display:block; }
.up-file-name { font-size:13px; font-weight:500; max-width:180px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; display:block; }
.up-cat-select { padding:4px 26px 4px 9px; border:1px solid var(--sys-outline-roles-outline-variant); border-radius:var(--sys-radius-sm); background:var(--sys-surface-roles-surface-container-low); color:var(--sys-surface-roles-on-surface); font-size:12.5px; font-family:inherit; appearance:none; cursor:pointer; background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%239096a2' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E"); background-repeat:no-repeat; background-position:right 7px center; outline:none; transition:border-color .15s; }
.up-cat-select:focus { border-color:var(--sys-primary); box-shadow:0 0 0 3px color-mix(in srgb,var(--sys-primary) 14%,transparent); }
.up-badge { display:inline-flex; align-items:center; gap:5px; padding:3px 9px; border-radius:999px; font-size:12px; font-weight:500; white-space:nowrap; }
.up-badge--ok { background:color-mix(in srgb,#45ba4b 13%,transparent); color:#29702d; }
.up-badge-dot { width:6px; height:6px; border-radius:50%; background:currentColor; flex-shrink:0; }
.up-row-acts { display:flex; align-items:center; gap:4px; opacity:0; transition:opacity .15s; }
.up-tr:hover .up-row-acts { opacity:1; }
.up-act-btn { width:28px; height:28px; display:flex; align-items:center; justify-content:center; border:none; border-radius:var(--sys-radius-sm); background:transparent; color:var(--sys-surface-roles-on-surface-variant); cursor:pointer; transition:background .15s,color .15s; }
.up-act-btn:hover { background:var(--sys-surface-roles-surface-container-high); color:var(--sys-surface-roles-on-surface); }
.up-act-btn--del:hover { background:var(--sys-error-container); color:var(--sys-on-error-container); }
.up-act-btn:disabled { opacity:.45; cursor:not-allowed; }

/* ── Table empty state ── */
.up-table-empty { display:flex; flex-direction:column; align-items:center; gap:8px; padding:56px 24px; text-align:center; }
.up-table-empty-icon { width:52px; height:52px; border-radius:50%; background:var(--sys-surface-roles-surface-container); display:flex; align-items:center; justify-content:center; color:var(--sys-surface-roles-on-surface-variant); }
.up-table-empty-title { font-size:14.5px; font-weight:500; color:var(--sys-surface-roles-on-surface); margin:0; }
.up-table-empty-sub   { font-size:13px; color:var(--sys-surface-roles-on-surface-variant); margin:0; max-width:340px; }

/* ── Table footer ── */
.up-table-foot { display:flex; align-items:center; justify-content:space-between; padding:11px 24px; border-top:1px solid var(--sys-outline-roles-outline-variant); }
.up-foot-count { font-size:13px; color:var(--sys-surface-roles-on-surface-variant); }
.up-foot-nav   { display:flex; gap:4px; }
.up-nav-btn { width:28px; height:28px; display:flex; align-items:center; justify-content:center; border:1px solid var(--sys-outline-roles-outline-variant); border-radius:var(--sys-radius-sm); background:transparent; color:var(--sys-surface-roles-on-surface-variant); cursor:pointer; transition:background .15s; }
.up-nav-btn:hover:not(:disabled) { background:var(--sys-surface-roles-surface-container); }
.up-nav-btn:disabled { opacity:.4; cursor:not-allowed; }

/* ── Shared buttons ── */
.up-btn-primary { display:inline-flex; align-items:center; gap:7px; padding:9px 18px; border-radius:var(--sys-radius-md); background:var(--sys-primary); color:var(--sys-on-primary); font-size:13.5px; font-weight:500; font-family:inherit; border:none; cursor:pointer; transition:opacity .15s,transform .12s,box-shadow .15s; white-space:nowrap; }
.up-btn-primary:hover { opacity:.9; transform:translateY(-1px); box-shadow:0 4px 12px color-mix(in srgb,var(--sys-primary) 28%,transparent); }
.up-btn-primary:active { transform:translateY(0); }
.up-btn-primary:disabled { opacity:.45; cursor:not-allowed; transform:none; box-shadow:none; }
.up-btn-primary--ok { background:#37953c!important; color:#fff!important; }
.up-btn-ghost { display:inline-flex; align-items:center; gap:7px; padding:9px 18px; border-radius:var(--sys-radius-md); background:transparent; color:var(--sys-surface-roles-on-surface); font-size:13.5px; font-weight:500; font-family:inherit; border:1px solid var(--sys-outline-roles-outline-variant); cursor:pointer; transition:background .15s; }
.up-btn-ghost:hover { background:var(--sys-surface-roles-surface-container); }

/* ── Modal ── */
.up-modal-bg { position:fixed; inset:0; background:rgba(0,0,0,.52); display:flex; align-items:center; justify-content:center; z-index:1000; padding:16px; backdrop-filter:blur(4px); animation:upFadeIn .15s ease; }
.up-modal { background:var(--sys-surface-roles-surface-container-low); border:1px solid var(--sys-outline-roles-outline-variant); border-radius:var(--sys-radius-xl); width:100%; max-width:440px; overflow:hidden; box-shadow:var(--sys-elevation-12dp-penumbra); animation:upSlideUp .2s ease; }
.up-modal-hd { display:flex; align-items:center; justify-content:space-between; padding:18px 22px 14px; border-bottom:1px solid var(--sys-outline-roles-outline-variant); }
.up-modal-title { font-size:15.5px; font-weight:600; color:var(--sys-surface-roles-on-surface); margin:0; }
.up-modal-close { width:30px; height:30px; display:flex; align-items:center; justify-content:center; border:none; border-radius:var(--sys-radius-sm); background:transparent; color:var(--sys-surface-roles-on-surface-variant); cursor:pointer; transition:background .15s; }
.up-modal-close:hover { background:var(--sys-surface-roles-surface-container); }
.up-modal-thumb-wrap { position:relative; height:130px; overflow:hidden; }
.up-modal-thumb { width:100%; height:100%; object-fit:cover; filter:brightness(.78); }
.up-modal-cat-badge { position:absolute; bottom:10px; left:16px; display:inline-flex; align-items:center; gap:5px; padding:3px 10px; border-radius:999px; background:rgba(0,0,0,.52); color:#fff; font-size:12px; font-weight:500; backdrop-filter:blur(4px); }
.up-modal-body { padding:18px 22px 4px; display:flex; flex-direction:column; gap:6px; }
.up-modal-lbl  { font-size:11px; font-weight:600; letter-spacing:.06em; text-transform:uppercase; color:var(--sys-surface-roles-on-surface-variant); }
.up-modal-ta   { width:100%; height:108px; padding:11px; border:1px solid var(--sys-outline-roles-outline-variant); border-radius:var(--sys-radius-md); background:var(--sys-surface-roles-surface-container); color:var(--sys-surface-roles-on-surface); font-size:13.5px; font-family:inherit; line-height:1.5; resize:vertical; box-sizing:border-box; outline:none; transition:border-color .15s,box-shadow .15s; }
.up-modal-ta:focus { border-color:var(--sys-primary); box-shadow:0 0 0 3px color-mix(in srgb,var(--sys-primary) 14%,transparent); }
.up-modal-chars { font-size:11px; color:var(--sys-surface-roles-on-surface-variant); text-align:right; }
.up-modal-chars--warn { color:var(--sys-error); }
.up-modal-err { display:flex; align-items:center; gap:8px; padding:9px 11px; border-radius:var(--sys-radius-sm); background:var(--sys-error-container); color:var(--sys-on-error-container); font-size:13px; }
.up-modal-ft { display:flex; gap:10px; justify-content:flex-end; padding:14px 22px 18px; border-top:1px solid var(--sys-outline-roles-outline-variant); margin-top:14px; }

/* ── Animations ── */
@keyframes upFadeIn  { from{opacity:0} to{opacity:1} }
@keyframes upSlideUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
@keyframes upSlideDown { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
@keyframes upSpin { to{transform:rotate(360deg)} }
.up-spin { animation:upSpin .75s linear infinite; }

/* ── Responsive ── */
@media (max-width:1100px) {
  .up-stats-grid  { grid-template-columns:repeat(2,1fr); }
  .up-dtype-grid  { grid-template-columns:repeat(2,1fr); }
}
@media (max-width:700px) {
  .up-header       { flex-direction:column; }
  .up-stats-grid   { grid-template-columns:1fr 1fr; }
  .up-dtype-grid   { grid-template-columns:1fr 1fr; }
  .up-zone         { padding:30px 20px; }
  .up-records-hd   { flex-direction:column; align-items:flex-start; }
}
@media (max-width:480px) {
  .up-stats-grid  { grid-template-columns:1fr; }
  .up-dtype-grid  { grid-template-columns:1fr; }
}
`;