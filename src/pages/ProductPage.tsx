import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Layers, Shield, FileSearch } from "lucide-react";

const PRODUCT_FLOW = [
  { step: "01", label: "Open Web App", sub: "Try Demo — no login required" },
  { step: "02", label: "Upload Document", sub: "PNG, JPG, PDF, DOCX, TXT" },
  { step: "03", label: "Choose Destination", sub: "17 platforms indexed" },
  { step: "04", label: "Analyze Exposure", sub: "Deterministic pipeline" },
  { step: "05", label: "Governance Output", sub: "Score · Provenance · Policy" },
];

const LAYERS = [
  {
    icon: FileSearch,
    tag: "WEB APP · IMPLEMENTED",
    title: "Exposure Intelligence",
    bullets: [
      "Upload any supported file for a privacy exposure estimate",
      "Deterministic signal extraction — no LLM required",
      "Platform-specific risk context from reviewed policy registry",
      "Explainable score breakdown with evidence IDs",
      "No file stored, no external AI upload",
    ],
    cta: { label: "Try Demo", href: "/demo" },
  },
  {
    icon: Shield,
    tag: "INDIVIDUAL APP · PLANNED",
    title: "Personal Privacy Guard",
    bullets: [
      "Installable app — runs locally on your device",
      "Visibility into your AI activity and data flows",
      "User-level risk factors before you share",
      "Local-first: sensitive content stays on your machine",
      "No cloud dependency for core analysis",
    ],
    cta: { label: "Learn More", href: "/individuals" },
  },
  {
    icon: Layers,
    tag: "ENTERPRISE CRM · PLANNED",
    title: "Runtime Governance Platform",
    bullets: [
      "Locally controlled deployment — on-premise or private cloud",
      "Deterministic policy enforcement: ALLOW / MONITOR / APPROVAL_REQUIRED / BLOCK",
      "TraceSeal asset fingerprinting and provenance verification",
      "Audit trail with tamper-evident event records",
      "Organisation-level controls and role-based access",
    ],
    cta: { label: "Learn More", href: "/enterprise" },
  },
];

export const ProductPage: React.FC = () => {
  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero */}
      <section className="py-14 sm:py-20 border-b border-[#E8E8E6] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-5">
          <div className="font-mono text-[11px] text-[#8A8A8A] uppercase tracking-wider">
            PRODUCT · IMPLEMENTED / PLANNED
          </div>
          <h1
            className="font-[550] tracking-[-0.03em] text-[#111111] leading-[1.06]"
            style={{ fontSize: "clamp(32px, 4vw, 48px)" }}
          >
            AI Privacy, Provenance &amp; Runtime Governance.
          </h1>
          <p className="text-[16px] text-[#606060] leading-relaxed max-w-2xl">
            AgentTrap gives individuals and enterprises the tools to understand
            data exposure before sharing, verify asset integrity, and enforce
            enforceable AI usage policies — with the same document potentially
            producing different policy decisions depending on intended purpose.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              to="/demo"
              className="px-5 py-2.5 text-sm font-medium text-white bg-[#111111] rounded hover:bg-[#222222] transition-colors inline-flex items-center gap-2 min-h-[44px]"
            >
              Try Demo <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/technology"
              className="px-5 py-2.5 text-sm font-medium text-[#111111] border border-[#E8E8E6] rounded hover:bg-[#FAFAFA] transition-colors inline-flex items-center gap-1.5 min-h-[44px]"
            >
              View Architecture <ChevronRight className="w-4 h-4 text-[#8A8A8A]" />
            </Link>
          </div>
        </div>
      </section>

      {/* Product Flow */}
      <section className="py-12 sm:py-16 border-b border-[#E8E8E6] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="font-mono text-[11px] text-[#8A8A8A] uppercase tracking-wider mb-6">
            How It Works
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-0 overflow-x-auto pb-2">
            {PRODUCT_FLOW.map((item, i) => (
              <React.Fragment key={item.step}>
                <div className="flex-shrink-0 text-center sm:text-left px-0 sm:px-2 py-2">
                  <div className="font-mono text-[10px] text-[#8A8A8A] mb-0.5">{item.step}</div>
                  <div className="text-sm font-medium text-[#111111] whitespace-nowrap">{item.label}</div>
                  <div className="text-[11px] text-[#8A8A8A] whitespace-nowrap">{item.sub}</div>
                </div>
                {i < PRODUCT_FLOW.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-[#CCCCCC] flex-shrink-0 hidden sm:block mx-1" />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-4 p-4 bg-[#FAFAFA] border border-[#E8E8E6] rounded text-xs text-[#606060] leading-relaxed">
            <strong className="text-[#111111]">Purpose matters: </strong>
            The same document may receive different policy decisions depending on
            intended use — Internal Analysis, Model Training, External Sharing,
            or Enterprise Processing each carry different exposure characteristics.
            AgentTrap does not classify a document as universally "safe" or "unsafe".
          </div>
        </div>
      </section>

      {/* Three Product Layers */}
      <section className="py-14 sm:py-20 border-b border-[#E8E8E6] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="font-mono text-[11px] text-[#8A8A8A] uppercase tracking-wider mb-2">
            Three Product Layers
          </div>
          <h2 className="text-2xl sm:text-3xl font-[550] tracking-tight text-[#111111] mb-10">
            One platform. Three deployment modes.
          </h2>
          <div className="space-y-8">
            {LAYERS.map((layer) => {
              const Icon = layer.icon;
              return (
                <div
                  key={layer.title}
                  className="p-6 sm:p-8 border border-[#E8E8E6] rounded-md bg-[#FAFAFA] space-y-4"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded border border-[#E8E8E6] bg-white flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-[#111111]" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-mono text-[10px] text-[#8A8A8A] uppercase tracking-wider mb-1">
                        {layer.tag}
                      </div>
                      <h3 className="text-lg font-[550] text-[#111111] tracking-tight">
                        {layer.title}
                      </h3>
                    </div>
                  </div>
                  <ul className="space-y-1.5 pl-1">
                    {layer.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-[#606060]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#111111] mt-1.5 flex-shrink-0" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={layer.cta.href}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#111111] hover:underline min-h-[44px]"
                  >
                    {layer.cta.label} <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Evidence Stance */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="font-mono text-[11px] text-[#8A8A8A] uppercase tracking-wider">
            Evidence over speculation
          </div>
          <p className="text-sm text-[#606060] leading-relaxed max-w-2xl">
            File-derived patterns, documented policy facts, inferred risk, and
            unknown behavior are shown separately. Unknown policy fields
            contribute zero points and reduce confidence. A low score does not
            establish safety — it may simply mean there was insufficient evidence
            to score.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/research" className="secondary-button text-sm">
              Explore Methodology
            </Link>
            <Link to="/demo" className="primary-button text-sm">
              Try Demo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
