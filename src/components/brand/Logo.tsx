import React from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
  linkToHome?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  size = "md",
  showWordmark = true,
  linkToHome = true,
}) => {
  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const textSizes = {
    sm: "text-[13px]",
    md: "text-[15px]",
    lg: "text-[17px]",
  };

  const symbol = (
    <div
      className={`inline-flex items-center gap-2.5 select-none ${className}`}
    >
      {/* TRACE + TARGET + PATH Minimalist Geometric Symbol */}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconSizes[size]} text-[#111111] shrink-0`}
        aria-hidden="true"
      >
        {/* Outer Incomplete Tracing Arc */}
        <path
          d="M12 3.5C6.7533 3.5 2.5 7.7533 2.5 13C2.5 18.2467 6.7533 22.5 12 22.5C16.1421 22.5 19.6644 19.8456 20.95 16.0"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        {/* Inbound Converging Signal Path Segment (forming subtle abstract A apex) */}
        <path
          d="M6.5 7.5L12 12.5L17.5 7.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Central Observation / Trace Node */}
        <circle cx="12" cy="12.5" r="1.75" fill="currentColor" />
        {/* Tracked Exit Vector Line */}
        <path
          d="M12 14.5V19.5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      </svg>

      {showWordmark && (
        <span
          className={`font-[580] tracking-[-0.02em] text-[#111111] ${textSizes[size]} whitespace-nowrap`}
          style={{ letterSpacing: "-0.025em" }}
        >
          AgentTrap
        </span>
      )}
    </div>
  );

  if (linkToHome) {
    return (
      <Link
        to="/"
        className="focus:outline-none focus-visible:ring-1 focus-visible:ring-[#111111] rounded"
        aria-label="AgentTrap Home"
      >
        {symbol}
      </Link>
    );
  }

  return symbol;
};
