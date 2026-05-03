"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

interface BrandProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "dash";
}

export default function Brand({
  className = "",
  size = "md",
}: BrandProps) {
  const sizes = {
    sm: 80,
    md: 100,
    lg: 150,
    dash: 112,
  };

  const [isLight, setIsLight] = useState(true);

  useEffect(() => {
    const checkTheme = () => {
      setIsLight(document.documentElement.classList.contains("light"));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, []);

  const currentSize = sizes[size];
  const logoSrc = isLight ? "/logo%20bluee.svg" : "/logo%20whitee.svg";

  return (
    <Image
      src={logoSrc}
      alt="FieldSpec Logo"
      width={currentSize}
      height={Math.round(currentSize * (149 / 734))}
      className={className ? `object-contain ${className}` : "object-contain"}
      style={{ border: "none" }}
    />
  );
}
