"use client";

import { useEffect, useState, useCallback } from "react";

interface ProgressBarProps {
  progress?: number;
  indeterminate?: boolean;
  size?: "small" | "medium" | "large";
  showPercentage?: boolean;
  message?: string;
  onComplete?: () => void;
}

export function ProgressBar({
  progress = 0,
  indeterminate = false,
  size = "medium",
  showPercentage = false,
  message,
  onComplete,
}: ProgressBarProps) {
  const [currentProgress, setCurrentProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!indeterminate && progress > 0) {
      const targetProgress = Math.min(100, Math.max(0, progress));
      if (targetProgress > currentProgress) {
        const timer = setTimeout(() => {
          setCurrentProgress(targetProgress);
          if (targetProgress >= 100 && onComplete) {
            setIsComplete(true);
            onComplete();
          }
        }, 100);
        return () => clearTimeout(timer);
      }
    }
  }, [indeterminate, progress, currentProgress, onComplete]);

  const heights = {
    small: "4px",
    medium: "6px",
    large: "8px",
  };

  const widths = {
    small: "16px",
    medium: "20px",
    large: "24px",
  };

  return (
    <div style={{ width: "100%" }}>
      {message && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              color: "var(--sys-on-surface-variant)",
              fontWeight: 500,
            }}
          >
            {message}
          </span>
          {showPercentage && !indeterminate && (
            <span
              style={{
                fontSize: "14px",
                color: "var(--sys-on-surface-variant)",
                fontWeight: 600,
              }}
            >
              {Math.round(currentProgress)}%
            </span>
          )}
        </div>
      )}
      <div
        style={{
          width: "100%",
          height: heights[size],
          backgroundColor: "var(--sys-surface-container-highest)",
          borderRadius: "9999px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {indeterminate ? (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              borderRadius: "9999px",
              background: `linear-gradient(90deg, transparent, var(--sys-primary), transparent)`,
              animation: "indeterminate-bar 1.5s ease-in-out infinite",
              width: widths[size],
            }}
          />
        ) : (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: isComplete ? "100%" : `${currentProgress}%`,
              background: `linear-gradient(90deg, var(--sys-primary), var(--sys-tertiary))`,
              borderRadius: "9999px",
              transition: isComplete ? "width 0.5s ease-out" : "width 0.3s ease-out",
              boxShadow: isComplete ? "0 0 8px var(--sys-primary)" : "none",
            }}
          />
        )}
      </div>
      <style>{`
        @keyframes indeterminate-bar {
          0% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(200%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
}

interface LoadingScreenProps {
  message?: string;
  minDuration?: number;
}

export function LoadingScreen({ message = "Loading...", minDuration = 800 }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    let startTime = Date.now();
    const elapsed = Date.now() - startTime;
    const remainingTime = Math.max(0, minDuration - elapsed);

    const interval = setInterval(() => {
      const timeSinceStart = Date.now() - startTime;
      const newProgress = Math.min(95, (timeSinceStart / minDuration) * 100);
      setProgress(newProgress);

      if (newProgress >= 95) {
        clearInterval(interval);
      }
    }, 50);

    setTimeout(() => {
      setProgress(100);
      setComplete(true);
    }, minDuration);

    return () => clearInterval(interval);
  }, [minDuration]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "200px",
        width: "100%",
        gap: "24px",
        padding: "32px",
      }}
    >
      <ProgressBar progress={progress} showPercentage size="large" />
      <span
        style={{
          fontSize: "16px",
          color: complete ? "var(--sys-primary)" : "var(--sys-on-surface-variant)",
          fontWeight: complete ? 600 : 500,
          transition: "color 0.3s ease",
        }}
      >
        {complete ? "Ready!" : message}
      </span>
    </div>
  );
}

interface LoadingCardProps {
  message?: string;
}

export function LoadingCard({ message }: LoadingCardProps) {
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    const minDuration = 800;

    const interval = setInterval(() => {
      const newProgress = Math.min(90, ((Date.now() - startTime) / minDuration) * 100);
      setProgress(newProgress);

      if (newProgress >= 90) {
        clearInterval(interval);
      }
    }, 30);

    setTimeout(() => {
      setProgress(100);
      setComplete(true);
    }, minDuration);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px",
        backgroundColor: "var(--sys-surface-container)",
        borderRadius: "12px",
        gap: "16px",
        width: "100%",
      }}
    >
      <ProgressBar progress={progress} showPercentage size="medium" />
      {message && (
        <span
          style={{
            fontSize: "14px",
            color: complete ? "var(--sys-primary)" : "var(--sys-on-surface-variant)",
            fontWeight: complete ? 600 : 500,
            transition: "color 0.3s ease",
          }}
        >
          {complete ? "Ready!" : message}
        </span>
      )}
    </div>
  );
}

interface LoadingOverlayProps {
  message?: string;
}

export function LoadingOverlay({ message }: LoadingOverlayProps) {
  const [progress, setProgress] = useState(0);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const startTime = Date.now();

    const interval = setInterval(() => {
      const newProgress = Math.min(95, ((Date.now() - startTime) / 1000) * 100);
      setProgress(newProgress);

      if (newProgress >= 95) {
        clearInterval(interval);
      }
    }, 50);

    setTimeout(() => {
      setProgress(100);
      setComplete(true);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px",
          backgroundColor: "var(--sys-surface)",
          borderRadius: "16px",
          gap: "24px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.24)",
        }}
      >
        <ProgressBar progress={progress} showPercentage size="large" message={message} />
      </div>
    </div>
  );
}

export function InlineLoading({
  size = "small",
}: {
  size?: "small" | "medium" | "large";
}) {
  const spinnerSizes = {
    small: "16px",
    medium: "24px",
    large: "32px",
  };

  return (
    <div
      style={{
        width: spinnerSizes[size],
        height: spinnerSizes[size],
        border: `3px solid var(--sys-surface-container-highest)`,
        borderTopColor: "var(--sys-primary)",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }}
    >
      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

export function LoadingButton({
  loading,
  children,
  size = "medium",
}: {
  loading: boolean;
  children: React.ReactNode;
  size?: "small" | "medium" | "large";
}) {
  const heights = {
    small: "32px",
    medium: "40px",
    large: "48px",
  };

  const fontSizes = {
    small: "13px",
    medium: "14px",
    large: "16px",
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        height: heights[size],
      }}
    >
      {loading && <InlineLoading size={size === "small" ? "small" : "medium"} />}
      <span style={{ fontSize: fontSizes[size] }}>{children}</span>
    </div>
  );
}