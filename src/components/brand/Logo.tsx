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
    sm: "w-9 h-9",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const textSizes = {
    sm: "text-[17px]",
    md: "text-[21px]",
    lg: "text-[26px]",
  };

  const symbol = (
    <div
      className={`inline-flex items-center gap-2.5 select-none ${className}`}
    >
      {/* AgentTrap Shield + Network Node Logo */}
      <svg
        viewBox="0 0 100 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${iconSizes[size]} shrink-0`}
        aria-hidden="true"
      >
        {/* Shield outer shape */}
        <path
          d="M50 4 L88 18 L88 28 L80 28 L80 36 L88 36 L88 62 C88 82 50 98 50 98 C50 98 12 82 12 62 L12 36 L20 36 L20 28 L12 28 L12 18 Z"
          fill="currentColor"
        />
        {/* Shield inner cutout (creates the frame look) */}
        <path
          d="M50 12 L82 24 L82 30 L74 30 L74 42 L82 42 L82 62 C82 78 50 92 50 92 C50 92 18 78 18 62 L18 42 L26 42 L26 30 L18 30 L18 24 Z"
          fill="white"
        />
        {/* Inner shield fill */}
        <path
          d="M50 20 L76 30 L76 36 L68 36 L68 48 L76 48 L76 62 C76 74 50 86 50 86 C50 86 24 74 24 62 L24 48 L32 48 L32 36 L24 36 L24 30 Z"
          fill="currentColor"
        />

        {/* Signal arcs (wifi-like) - white on black shield */}
        {/* Outer arc */}
        <path
          d="M30 42 Q50 34 70 42"
          stroke="white"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />
        {/* Middle arc */}
        <path
          d="M36 50 Q50 44 64 50"
          stroke="white"
          strokeWidth="4.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Central node */}
        <circle cx="50" cy="58" r="6" fill="white" />

        {/* Left node */}
        <circle cx="30" cy="54" r="5.5" fill="white" />

        {/* Right node */}
        <circle cx="70" cy="54" r="5.5" fill="white" />

        {/* Bottom node */}
        <circle cx="50" cy="76" r="5.5" fill="white" />

        {/* Connector: center to left */}
        <line x1="44" y1="56" x2="35" y2="54" stroke="white" strokeWidth="4" strokeLinecap="round" />

        {/* Connector: center to right */}
        <line x1="56" y1="56" x2="65" y2="54" stroke="white" strokeWidth="4" strokeLinecap="round" />

        {/* Connector: center to bottom */}
        <line x1="50" y1="64" x2="50" y2="71" stroke="white" strokeWidth="4" strokeLinecap="round" />
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
