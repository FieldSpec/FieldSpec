"use client";

import { useState, useEffect } from "react";

interface ThemeToggleProps {
  size?: "default" | "sm";
}

export default function ThemeToggle({ size = "default" }: ThemeToggleProps) {
  const [isLight, setIsLight] = useState(true); // default: light (white navbar)

  useEffect(() => {
    // Persist preference in localStorage
    const saved = localStorage.getItem("fieldscope-theme");
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
      localStorage.setItem("fieldscope-theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      localStorage.setItem("fieldscope-theme", "dark");
    }
  };

  return (
    <>
      <style>{`
        .theme-toggle-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 13px;
          border-radius: 16px;
          border: 1.5px solid #E2E8F0;
          background: #F8FAFC;
          cursor: pointer;
          font-size: 16px;
          color: #475569;
          font-family: inherit;
          transition: all 0.2s ease;
        }
        .theme-toggle-btn.reduced {
          padding: 9.75px;
          border-radius: 12px;
          font-size: 12px;
        }
        .theme-toggle-btn:hover {
          border-color: #31579b;
          background: #EEF4FB;
          color: #31579b;
        }
      `}</style>
      <button
        onClick={toggleTheme}
        className={`theme-toggle-btn ${size === "sm" ? "reduced" : ""}`}
        aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
        title={isLight ? "Switch to dark mode" : "Switch to light mode"}
      >
        <span className="material-symbols-outlined" style={size === "sm" ? { fontSize: "18px" } : {}}>
          {isLight ? "dark_mode" : "light_mode"}
        </span>
      </button>
    </>
  );
}
