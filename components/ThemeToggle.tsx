"use client";

import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(true); // default: light (white navbar)

  useEffect(() => {
    // Persist preference in localStorage
    const saved = localStorage.getItem("fieldspec-theme");
    const prefersLight = saved ? saved === "light" : true;
    setIsLight(prefersLight);
    if (prefersLight) {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
  }, []);

  const toggleTheme = () => {
    const next = !isLight;
    setIsLight(next);
    if (next) {
      document.documentElement.classList.add("light");
      localStorage.setItem("fieldspec-theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      localStorage.setItem("fieldspec-theme", "dark");
    }
  };

  return (
    <>
      <style>{`
        .theme-toggle-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid var(--sys-outline-roles-outline-variant, #E2E8F0);
          background: transparent;
          cursor: pointer;
          color: var(--sys-surface-roles-on-surface-variant, #475569);
          transition: all 0.2s ease;
          margin-left: 12px;
        }
        .theme-toggle-btn:hover {
          background: var(--sys-surface-roles-surface-container, #F1F5F9);
          color: var(--sys-primary, #31579b);
          border-color: var(--sys-primary, #31579b);
          transform: translateY(-1px);
        }
        .theme-toggle-icon {
          font-size: 20px;
          line-height: 1;
        }
      `}</style>
      <button
        onClick={toggleTheme}
        className="theme-toggle-btn"
        aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
        title={isLight ? "Switch to dark mode" : "Switch to light mode"}
      >
        <span className="material-symbols-outlined theme-toggle-icon">
          {isLight ? "dark_mode" : "light_mode"}
        </span>
      </button>
    </>
  );
}
