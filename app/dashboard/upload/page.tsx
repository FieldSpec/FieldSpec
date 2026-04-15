"use client";

import { useState, useEffect, useRef } from "react";
import { tokens } from "@/lib/design-tokens";

interface Project {
  id: string;
  name: string;
}

interface UploadedImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  category: string;
  createdAt: string;
}

export default function UploadPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchImages();
    }
  }, [selectedProjectId]);

  async function fetchProjects() {
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (res.ok && data.data) {
        setProjects(data.data);
        if (data.data.length > 0) {
          setSelectedProjectId(data.data[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchImages() {
    if (!selectedProjectId) return;
    try {
      const res = await fetch(`/api/images?projectId=${selectedProjectId}`);
      const data = await res.json();
      if (res.ok && data.data) {
        setImages(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch images:", err);
    }
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError("");

    try {
      const file = files[0];
      const fileType = file.type;

      const signedRes = await fetch("/api/upload/signed-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, fileType }),
      });

      const signedData = await signedRes.json();

      if (!signedRes.ok || !signedData.data) {
        setError(signedData.error?.message || "Failed to get upload URL");
        setUploading(false);
        return;
      }

      const { signature, timestamp, cloudName, apiKey, folder } = signedData.data;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("api_key", apiKey);
      formData.append("timestamp", timestamp.toString());
      formData.append("signature", signature);
      formData.append("folder", folder);

      const cloudinaryRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const cloudinaryData = await cloudinaryRes.json();

      if (!cloudinaryRes.ok || cloudinaryData.error) {
        setError(cloudinaryData.error?.message || "Upload failed");
        setUploading(false);
        return;
      }

      const imageUrl = cloudinaryData.secure_url;
      const thumbnailUrl = cloudinaryData.eager?.[0]?.secure_url || imageUrl;

      const saveRes = await fetch("/api/images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId: selectedProjectId,
          imageUrl,
          thumbnailUrl,
        }),
      });

      const saveData = await saveRes.json();

      if (!saveRes.ok || !saveData.data) {
        setError(saveData.error?.message || "Failed to save image");
        setUploading(false);
        return;
      }

      setImages([saveData.data, ...images]);
    } catch (err) {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  if (loading) {
    return (
      <div
        style={{
          padding: tokens.spacing.lg,
          maxWidth: "1200px",
        }}
      >
        <div
          style={{
            padding: tokens.spacing.xl,
            textAlign: "center",
            ...tokens.typography.bodyLarge,
            color: tokens.colors.onSurfaceVariant,
          }}
        >
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: tokens.spacing.lg,
        maxWidth: "1200px",
      }}
    >
      <div
        style={{
          marginBottom: tokens.spacing.xl,
        }}
      >
        <h2
          style={{
            ...tokens.typography.headlineMedium,
            color: tokens.colors.onSurface,
          }}
        >
          Upload
        </h2>
        <p
          style={{
            ...tokens.typography.bodyMedium,
            color: tokens.colors.onSurfaceVariant,
            marginTop: tokens.spacing.xs,
          }}
        >
          Upload field inspection images
        </p>
      </div>

      {projects.length === 0 ? (
        <div
          style={{
            padding: tokens.spacing.xl,
            backgroundColor: tokens.colors.surface,
            borderRadius: tokens.radius.lg,
            boxShadow: tokens.elevation.level1,
            textAlign: "center",
          }}
        >
          <p
            style={{
              ...tokens.typography.bodyLarge,
              color: tokens.colors.onSurfaceVariant,
            }}
          >
            No projects. Create a project first to upload images.
          </p>
        </div>
      ) : (
        <>
          <div
            style={{
              marginBottom: tokens.spacing.lg,
              display: "flex",
              alignItems: "center",
              gap: tokens.spacing.md,
            }}
          >
            <label
              style={{
                ...tokens.typography.labelLarge,
                color: tokens.colors.onSurface,
              }}
            >
              Project:
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              style={{
                padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
                border: `1px solid ${tokens.colors.outline}`,
                borderRadius: tokens.radius.md,
                backgroundColor: tokens.colors.surface,
                color: tokens.colors.onSurface,
                ...tokens.typography.bodyLarge,
                minWidth: "200px",
                boxSizing: "border-box",
              }}
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            style={{ display: "none" }}
            id="file-upload"
          />

          <label
            htmlFor="file-upload"
            style={{
              display: "block",
              padding: tokens.spacing.xl,
              backgroundColor: tokens.colors.surface,
              borderRadius: tokens.radius.lg,
              boxShadow: tokens.elevation.level1,
              textAlign: "center",
              cursor: uploading ? "not-allowed" : "pointer",
              opacity: uploading ? 0.7 : 1,
              border: `2px dashed ${tokens.colors.outline}`,
              marginBottom: tokens.spacing.lg,
            }}
          >
            <p
              style={{
                ...tokens.typography.bodyLarge,
                color: tokens.colors.onSurfaceVariant,
              }}
            >
              {uploading
                ? "Uploading..."
                : "Click to select images or drag and drop"}
            </p>
          </label>

          {error && (
            <div
              style={{
                padding: tokens.spacing.md,
                marginBottom: tokens.spacing.md,
                backgroundColor: tokens.colors.errorContainer,
                color: tokens.colors.onErrorContainer,
                borderRadius: tokens.radius.md,
                ...tokens.typography.bodySmall,
              }}
            >
              {error}
            </div>
          )}

          {images.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: tokens.spacing.md,
              }}
            >
              {images.map((image) => (
                <div
                  key={image.id}
                  style={{
                    borderRadius: tokens.radius.lg,
                    overflow: "hidden",
                    boxShadow: tokens.elevation.level1,
                  }}
                >
                  <img
                    src={image.thumbnailUrl}
                    alt="Uploaded"
                    style={{
                      width: "100%",
                      height: "150px",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <div
                    style={{
                      padding: tokens.spacing.sm,
                      backgroundColor: tokens.colors.surface,
                    }}
                  >
                    <p
                      style={{
                        ...tokens.typography.labelSmall,
                        color: tokens.colors.onSurfaceVariant,
                        textTransform: "capitalize",
                      }}
                    >
                      {image.category}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}