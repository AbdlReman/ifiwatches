"use client";

import Image from "next/image";
import { useState } from "react";
import { siteConfig } from "@/lib/siteConfig";

type LogoSize = "sm" | "md" | "lg";

const sizeClass: Record<LogoSize, string> = {
  sm: "h-8 w-8 text-sm",
  md: "h-9 w-9 text-sm",
  lg: "h-16 w-16 text-2xl",
};

export default function BrandLogoMark({
  size = "md",
  className = "",
  fallbackText = siteConfig.brandInitials,
}: {
  size?: LogoSize;
  className?: string;
  fallbackText?: string;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = Boolean(siteConfig.logo.src && !imageFailed);

  return (
    <div
      className={`${sizeClass[size]} relative flex shrink-0 items-center justify-center overflow-hidden rounded-sm bg-white ${className}`}
      style={showImage ? undefined : { background: siteConfig.brandGradient }}
    >
      {showImage ? (
        <Image
          src={siteConfig.logo.src}
          alt={siteConfig.logo.alt}
          fill
          sizes={size === "lg" ? "64px" : "36px"}
          className="object-contain p-1"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <span className="font-black text-slate-950">{fallbackText}</span>
      )}
    </div>
  );
}
