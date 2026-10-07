import React from "react";
import { Link } from "react-router-dom";
import { Logo } from "../brand/Logo";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#FFFFFF] border-t border-[#E8E8E6] py-12 sm:py-16 text-xs text-[#606060]">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-10 sm:pb-12 border-b border-[#E8E8E6]">
          {/* Brand Col */}
          <div className="col-span-2 space-y-3">
            <Logo size="sm" />
            <p className="text-[#8A8A8A] max-w-sm leading-relaxed text-[12px] pt-1">
              Privacy intelligence and traceable AI governance. Making data
              exposure visible before files cross untrusted boundaries.
            </p>
          </div>

          {/* Product Links */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#111111] font-semibold">
              Product
            </div>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/product"
                  className="hover:text-[#111111] transition-colors"
                >
                  Overview
                </Link>
              </li>
              <li>
                <Link
                  to="/individuals"
                  className="hover:text-[#111111] transition-colors"
                >
                  Individuals
                </Link>
              </li>
              <li>
                <Link
                  to="/enterprise"
                  className="hover:text-[#111111] transition-colors"
                >
                  Enterprise
                </Link>
              </li>
              <li>
                <Link
                  to="/technology"
                  className="hover:text-[#111111] transition-colors"
                >
                  Technology
                </Link>
              </li>
              <li>
                <Link
                  to="/demo"
                  className="text-[#111111] font-medium hover:underline"
                >
                  Try Demo
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#111111] font-semibold">
              Resources
            </div>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/research"
                  className="hover:text-[#111111] transition-colors"
                >
                  Research
                </Link>
              </li>
              <li>
                <Link
                  to="/docs"
                  className="hover:text-[#111111] transition-colors"
                >
                  Docs
                </Link>
              </li>
              <li>
                <Link
                  to="/technology"
                  className="hover:text-[#111111] transition-colors"
                >
                  Architecture
                </Link>
              </li>
              <li>
                <Link
                  to="/research"
                  className="hover:text-[#111111] transition-colors"
                >
                  Methodology
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Legal */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#111111] font-semibold">
              Company
            </div>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="hover:text-[#111111] transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-[#111111] transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/docs"
                  className="hover:text-[#111111] transition-colors"
                >
                  Privacy & Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Prototype Legal Note */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[11px] text-[#8A8A8A]">
          <p className="max-w-2xl leading-relaxed">
            AgentTrap currently provides prototype heuristic exposure
            assessment. Estimates do not represent privileged access to
            third-party infrastructure.
          </p>
          <div className="font-mono text-[10px] shrink-0">
            &copy; {new Date().getFullYear()} AgentTrap Research
          </div>
        </div>
      </div>
    </footer>
  );
};
