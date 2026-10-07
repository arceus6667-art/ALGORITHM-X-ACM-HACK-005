import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "../brand/Logo";
import { Menu, X, ArrowRight } from "lucide-react";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: "Product", href: "/product" },
    { label: "Individuals", href: "/individuals" },
    { label: "Enterprise", href: "/enterprise" },
    { label: "Technology", href: "/technology" },
    { label: "Research", href: "/research" },
    { label: "Docs", href: "/docs" },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFFFFF]/95 backdrop-blur-sm border-b border-[#E8E8E6]">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-6 shrink-0">
          <Logo size="md" />
        </div>

        {/* Center: Dedicated Route Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[13px] font-normal text-[#606060]">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`transition-colors py-1 hover:text-[#111111] whitespace-nowrap ${
                  active ? "text-[#111111] font-medium" : ""
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/about"
            className="hidden md:inline-block text-[13px] text-[#606060] hover:text-[#111111] transition-colors px-2 py-1"
          >
            About
          </Link>

          <Link
            to="/demo"
            className="px-3.5 py-2 text-[13px] font-medium text-white bg-[#111111] rounded hover:bg-[#222222] transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap min-h-[44px]"
          >
            <span>Try Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Menu Toggle Button (44px touch target) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 text-[#606060] hover:text-[#111111] rounded flex items-center justify-center min-w-[44px] min-h-[44px]"
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation"
          className="lg:hidden border-b border-[#E8E8E6] bg-[#FFFFFF] px-4 sm:px-6 py-4 space-y-2"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center py-2.5 text-sm text-[#111111] hover:text-black font-medium min-h-[44px]"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-[#E8E8E6] flex flex-col gap-2">
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center py-2 text-sm text-[#606060] min-h-[44px]"
            >
              About
            </Link>
            <Link
              to="/demo"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center text-xs font-medium text-white bg-[#111111] rounded min-h-[44px] flex items-center justify-center"
            >
              Try Demo
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
