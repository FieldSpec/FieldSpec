import Image from "next/image";

interface BrandProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function Brand({
  className = "",
  size = "md",
}: BrandProps) {
  const sizes = {
    sm: 64,
    md: 80,
    lg: 120,
  };

  const currentSize = sizes[size];
  const logoSrc = "/logo.svg";

  return (
    <Image
      src={logoSrc}
      alt="FieldSpec Logo"
      width={currentSize}
      height={Math.round(currentSize * (149/734))}
      className={className ? `object-contain ${className}` : "object-contain"}
      style={{ border: "none" }}
    />
  );
}
