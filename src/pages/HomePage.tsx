import React from "react";
import { Link } from "react-router-dom";
import { TraceVisualization } from "../components/hero/TraceVisualization";
import { ArrowRight, ChevronRight, Check } from "lucide-react";

export const HomePage: React.FC = () => {
  return (
    <div className="w-full overflow-x-hidden">
      {/* 1. HERO SECTION (Laptop-First 2-Column Composition) */}
      <section className="relative pt-8 sm:pt-12 lg:pt-14 pb-10 sm:pb-14 lg:pb-16 border-b border-[#E8E8E6] bg-white">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-14 items-center">
            {/* Left Column: Narrative & Action (7 cols / ~55% on desktop) */}
            <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-left">
              {/* Eyebrow */}
              <div className="font-mono text-[11px] text-[#8A8A8A] tracking-[0.08em] uppercase">
                Privacy Intelligence · Traceability · AI Governance
              </div>

              {/* Responsive Clamp Headline (1-2 lines on laptop) */}
              <h1
                className="font-[550] tracking-[-0.03em] text-[#111111] leading-[1.04] text-balance max-w-[640px]"
                style={{ fontSize: "clamp(36px, 4vw, 56px)" }}
              >
                Make data exposure visible.
              </h1>

              {/* Subheadline Description */}
              <p className="text-[15px] sm:text-[17px] text-[#606060] leading-relaxed max-w-[560px]">
                AgentTrap analyzes what information exists in your files,
                evaluates documented platform practices, and generates an
                explainable privacy exposure assessment.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-md sm:max-w-none">
                <Link
                  to="/demo"
                  className="px-6 py-3 text-sm font-medium text-white bg-[#111111] rounded hover:bg-[#222222] transition-colors inline-flex items-center justify-center gap-2 shadow-xs whitespace-nowrap min-h-[44px]"
                >
                  <span>Try Demo</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/technology"
                  className="px-5 py-3 text-sm font-medium text-[#111111] bg-white border border-[#E8E8E6] rounded hover:bg-[#FAFAFA] hover:border-[#D6D6D3] transition-colors inline-flex items-center justify-center gap-1.5 whitespace-nowrap min-h-[44px]"
                >
                  <span>Explore Technology</span>
                  <ChevronRight className="w-4 h-4 text-[#8A8A8A]" />
                </Link>
              </div>

              {/* Technical Trust Line */}
              <div className="pt-1 flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-[#8A8A8A] font-mono">
                <span>No privileged access</span>
                <span aria-hidden="true">·</span>
                <span>Explainable risk</span>
                <span aria-hidden="true">·</span>
                <span>Traceable evidence</span>
              </div>
            </div>

            {/* Right Column: Technical Trace Visualization (5 cols / ~45% on desktop) */}
            <div className="lg:col-span-5 w-full flex justify-center lg:justify-end pt-2 lg:pt-0">
              <TraceVisualization />
            </div>
          </div>
        </div>
      </section>

      {/* 2. THREE CORE CAPABILITIES */}
      <section className="py-14 sm:py-20 border-b border-[#E8E8E6] bg-white">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 sm:mb-12">
            <div className="font-mono text-[11px] text-[#8A8A8A] uppercase tracking-wider mb-2">
              Platform Capabilities
            </div>
            <h2 className="text-2xl sm:text-3xl font-[550] tracking-tight text-[#111111]">
              Three layers of data observation.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {/* 01 */}
            <div className="space-y-3">
              <span className="font-mono text-sm text-[#8A8A8A] block">01</span>
              <h3 className="text-base font-semibold tracking-tight text-[#111111]">
                Exposure Intelligence
              </h3>
              <p className="text-sm text-[#606060] leading-relaxed">
                Understand what information a file contains and estimate
                potential privacy exposure based on downstream vendor
                processing.
              </p>
              <Link
                to="/product"
                className="inline-flex items-center gap-1 text-xs font-medium text-[#111111] hover:underline pt-1"
              >
                <span>Learn about exposure</span>
                <ChevronRight className="w-3 h-3 text-[#8A8A8A]" />
              </Link>
            </div>

            {/* 02 */}
            <div className="space-y-3">
              <span className="font-mono text-sm text-[#8A8A8A] block">02</span>
              <h3 className="text-base font-semibold tracking-tight text-[#111111]">
                TraceSeal
              </h3>
              <p className="text-sm text-[#606060] leading-relaxed">
                Planned: cryptographic provenance identities for enterprise
                assets and traceable lineage across integrated workflows.
              </p>
              <Link
                to="/technology"
                className="inline-flex items-center gap-1 text-xs font-medium text-[#111111] hover:underline pt-1"
              >
                <span>Learn about TraceSeal</span>
                <ChevronRight className="w-3 h-3 text-[#8A8A8A]" />
              </Link>
            </div>

            {/* 03 */}
            <div className="space-y-3">
              <span className="font-mono text-sm text-[#8A8A8A] block">03</span>
              <h3 className="text-base font-semibold tracking-tight text-[#111111]">
                Runtime Governance
              </h3>
              <p className="text-sm text-[#606060] leading-relaxed">
                Planned: apply deterministic policy controls before sensitive AI
                interactions execute across integrated endpoints.
              </p>
              <Link
                to="/enterprise"
                className="inline-flex items-center gap-1 text-xs font-medium text-[#111111] hover:underline pt-1"
              >
                <span>Learn about governance</span>
                <ChevronRight className="w-3 h-3 text-[#8A8A8A]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INDIVIDUAL / ENTERPRISE PREVIEW */}
      <section className="py-14 sm:py-20 border-b border-[#E8E8E6] bg-white">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14">
            {/* For Individuals */}
            <div className="p-6 sm:p-8 bg-[#FAFAFA] border border-[#E8E8E6] rounded-md space-y-4">
              <div className="font-mono text-[11px] text-[#8A8A8A] uppercase tracking-wider">
                For Individuals
              </div>
              <h3 className="text-2xl font-[550] tracking-tight text-[#111111]">
                Understand before you share.
              </h3>
              <p className="text-sm text-[#606060] leading-relaxed">
                Analyze files and understand their potential exposure before
                uploading them to social media, messaging platforms, or public
                AI tools.
              </p>
              <div className="pt-2">
                <Link
                  to="/individuals"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#111111] hover:underline min-h-[44px]"
                >
                  <span>Explore Personal Protection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* For Enterprises */}
            <div className="p-6 sm:p-8 bg-[#FAFAFA] border border-[#E8E8E6] rounded-md space-y-4">
              <div className="font-mono text-[11px] text-[#8A8A8A] uppercase tracking-wider">
                For Enterprises
              </div>
              <h3 className="text-2xl font-[550] tracking-tight text-[#111111]">
                Trace before you trust.
              </h3>
              <p className="text-sm text-[#606060] leading-relaxed">
                Protect proprietary assets, monitor employee AI interactions,
                enforce deterministic runtime guardrails, and maintain auditable
                provenance.
              </p>
              <div className="pt-2">
                <Link
                  to="/enterprise"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#111111] hover:underline min-h-[44px]"
                >
                  <span>Explore Enterprise</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SHORT TECHNOLOGY STRIP */}
      <section className="py-12 sm:py-16 border-b border-[#E8E8E6] bg-white">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8 bg-[#FAFAFA] border border-[#E8E8E6] rounded-md flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <div className="font-mono text-[11px] text-[#8A8A8A] uppercase tracking-wider">
                Architecture
              </div>
              <h3 className="text-base font-semibold text-[#111111]">
                Designed for explainable, deterministic decisions.
              </h3>
              <p className="text-xs text-[#606060] leading-relaxed">
                Implemented: deterministic file analysis and exposure scoring.
                Jev AI is an optional planned adapter; no LLM is required for
                the demo.
              </p>
            </div>
            <div>
              <Link
                to="/technology"
                className="px-4 py-2.5 text-xs font-medium text-[#111111] bg-white border border-[#D6D6D3] rounded hover:bg-[#F0F0EE] transition-colors inline-flex items-center gap-1 whitespace-nowrap min-h-[44px]"
              >
                <span>View System Architecture</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#8A8A8A]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FINAL CTA */}
      <section className="py-16 sm:py-24 bg-white text-center">
        <div className="w-full max-w-[700px] mx-auto px-4 sm:px-6 space-y-5">
          <h2 className="text-3xl sm:text-4xl font-[550] tracking-tight text-[#111111]">
            Know the risk before you share.
          </h2>
          <p className="text-sm text-[#606060] max-w-md mx-auto leading-relaxed">
            Analyze your content and understand its potential privacy exposure
            across the modern web.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/demo"
              className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-white bg-[#111111] rounded hover:bg-[#222222] transition-colors inline-flex items-center justify-center gap-2 min-h-[44px]"
            >
              <span>Try Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/enterprise"
              className="w-full sm:w-auto px-5 py-3 text-sm font-medium text-[#111111] bg-white border border-[#E8E8E6] rounded hover:bg-[#FAFAFA] transition-colors inline-flex items-center justify-center min-h-[44px]"
            >
              Explore Enterprise
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
