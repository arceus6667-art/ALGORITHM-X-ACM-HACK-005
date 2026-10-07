import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Logo } from "../brand/Logo";
import { Menu, X, ArrowRight } from "lucide-react";

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Product", href: "/product" },
    { label: "Individuals", href: "/individuals" },
    { label: "Enterprise", href: "/enterprise" },
    { label: "Technology", href: "/technology" },
    { label: "Research", href: "/research" },
    { label: "Docs", href: "/docs" },
    { label: "About", href: "/about" },
  ];

  const isActive = (href: string) =>
    href === "/" ? location.pathname === "/" : location.pathname === href;

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FFFFFF]/95 backdrop-blur-sm border-b border-[#E8E8E6]">
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center shrink-0">
          <Logo size="md" />
        </div>

        {/* Center: Nav Links */}
        <nav
          className="hidden lg:flex items-center gap-5 xl:gap-6 text-[13px] font-normal text-[#606060] flex-1 justify-center"
          aria-label="Main navigation"
        >
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

        {/* Right: CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/demo"
            className="px-3.5 py-2 text-[13px] font-medium text-white bg-[#111111] rounded hover:bg-[#222222] transition-colors flex items-center gap-1.5 shadow-xs whitespace-nowrap min-h-[40px]"
          >
            <span>Try Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Menu Toggle */}
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
          className="lg:hidden border-b border-[#E8E8E6] bg-[#FFFFFF] px-4 sm:px-6 py-4 space-y-1"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center py-2.5 text-sm hover:text-black min-h-[44px] ${
                isActive(link.href)
                  ? "text-[#111111] font-medium"
                  : "text-[#606060]"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-[#E8E8E6]">
            <Link
              to="/demo"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 text-center text-sm font-medium text-white bg-[#111111] rounded min-h-[44px] flex items-center justify-center gap-2"
            >
              Try Demo
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
