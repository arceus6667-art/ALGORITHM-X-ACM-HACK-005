import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Cpu, Hash, Shield, Layers } from "lucide-react";

const STACK = [
  { label: "Frontend", value: "React 19 + TypeScript + Vite 8 + Tailwind 4", status: "implemented" },
  { label: "Backend", value: "Node.js + Express 4 (TypeScript via tsx)", status: "implemented" },
  { label: "File Parsing", value: "pdfjs-dist · mammoth (DOCX) · sharp · exifr · yauzl", status: "implemented" },
  { label: "OCR", value: "Tesseract — local English text extraction", status: "optional" },
  { label: "Policy Store", value: "Offline JSON registry — 13 platforms reviewed", status: "implemented" },
  { label: "Guardrail Support", value: "NeMo Guardrails adapter (planned) — deterministic rules are final authority", status: "planned" },
  { label: "Storage", value: "Memory-only (web demo). Local-first for Individual & Enterprise deployments.", status: "partial" },
  { label: "Authentication", value: "Not yet implemented — architecture prepared for sign-in flow", status: "planned" },
];

const PIPELINE = [
  {
    step: "01",
    icon: Layers,
    title: "Validate",
    tag: "Implemented",
    text: "Extension, declared MIME, file signature, size, DOCX expanded-archive limits. Parsing runs in a sandboxed child process with a 20 s timeout and 256 MB heap cap.",
  },
  {
    step: "02",
    icon: Cpu,
    title: "Extract",
    tag: "Implemented",
    text: "PDF text layer (30 pages), DOCX paragraphs, UTF-8 text, image pixels, EXIF metadata, and local English OCR when Tesseract is installed. Matched private values never enter the report.",
  },
  {
    step: "03",
    icon: Layers,
    title: "Retrieve Policy Evidence",
    tag: "Implemented",
    text: "Deterministic field filtering over a manually reviewed JSON registry. No embeddings, no vector databases, no LangChain, no LangGraph. Source URL, date reviewed, applicability scope, and evidence ID included.",
  },
  {
    step: "04",
    icon: Cpu,
    title: "Score & Explain",
    tag: "Implemented",
    text: "Eight configurable factors (max 100 pts). Each contribution carries evidence IDs and a plain-language reason. A prototype index — not a scientifically calibrated prediction.",
  },
  {
    step: "05",
    icon: Hash,
    title: "TraceSeal Fingerprinting",
    tag: "Planned",
    text: "Cryptographic asset fingerprint computed at ingestion. Re-verification detects modifications before an AI workflow is permitted to consume the asset. Tamper-evident audit events stored per access.",
  },
  {
    step: "06",
    icon: Shield,
    title: "Runtime Policy Guard",
    tag: "Planned",
    text: "Evaluates requested purpose (Internal Analysis, Model Training, External Sharing, Enterprise Processing) against deterministic rules. Returns: ALLOW / MONITOR / APPROVAL_REQUIRED / BLOCK. LLM assistance is optional — never the sole authority.",
  },
  {
    step: "07",
    icon: Layers,
    title: "Return & Clear",
    tag: "Implemented",
    text: "API returns derived findings, policy context, limitations, and recommendations. Upload buffers are zeroed after handling. No analysis database, no raw-content log, no result-reload endpoint.",
  },
];

const TAG_COLOR: Record<string, string> = {
  implemented: "#111111",
  planned: "#8A8A8A",
  optional: "#555555",
  partial: "#555555",
};

export const TechnologyPage: React.FC = () => {
  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero */}
      <section className="py-14 sm:py-20 border-b border-[#E8E8E6] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-5">
          <div className="font-mono text-[11px] text-[#8A8A8A] uppercase tracking-wider">
            Technology · Working Pipeline
          </div>
          <h1
            className="font-[550] tracking-[-0.03em] text-[#111111] leading-[1.06]"
            style={{ fontSize: "clamp(30px, 4vw, 46px)" }}
          >
            Simple flow. Inspectable decisions.
          </h1>
          <p className="text-[16px] text-[#606060] leading-relaxed max-w-2xl">
            AgentTrap's analysis pipeline is deterministic and auditable. No
            LLM is the sole authority for risk decisions. Exposure Intelligence
            runs today; TraceSeal and Runtime Policy Guard are planned
            capabilities shown with accurate status labels.
          </p>
        </div>
      </section>

      {/* Three pillars */}
      <section className="py-12 border-b border-[#E8E8E6] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="font-mono text-[11px] text-[#8A8A8A] uppercase tracking-wider mb-6">
            Three Technology Pillars
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Cpu, title: "Exposure Intelligence", tag: "Implemented", desc: "Deterministic file analysis, signal extraction, and heuristic risk scoring with reviewed platform policy context." },
              { icon: Hash, title: "TraceSeal Hashing", tag: "Planned", desc: "Cryptographic asset fingerprinting for provenance verification. Detects whether a document has been modified before trusting it." },
              { icon: Shield, title: "Runtime Policy Guard", tag: "Planned", desc: "Purpose-aware policy evaluation returning ALLOW / MONITOR / APPROVAL_REQUIRED / BLOCK. Deterministic rules are the final authority." },
            ].map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="p-5 border border-[#E8E8E6] rounded bg-[#FAFAFA] space-y-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-[#111111]" />
                    <div>
                      <div className="font-mono text-[10px] text-[#8A8A8A] uppercase">{p.tag}</div>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-[#111111]">{p.title}</h3>
                  <p className="text-xs text-[#606060] leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section className="py-12 sm:py-16 border-b border-[#E8E8E6] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="font-mono text-[11px] text-[#8A8A8A] uppercase tracking-wider mb-6">
            Analysis Pipeline
          </div>
          <div className="space-y-px">
            {PIPELINE.map((step, i) => {
              const Icon = step.icon;
              const isLast = i === PIPELINE.length - 1;
              return (
                <div
                  key={step.step}
                  className={`flex gap-4 p-5 ${!isLast ? "border-b border-[#F0F0EE]" : ""}`}
                >
                  <div className="flex-shrink-0 w-7 h-7 rounded border border-[#E8E8E6] bg-[#FAFAFA] flex items-center justify-center">
                    <Icon className="w-3.5 h-3.5 text-[#111111]" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono text-[10px] text-[#AAAAAA]">{step.step}</span>
                      <h3 className="text-sm font-semibold text-[#111111]">{step.title}</h3>
                      <span
                        className="font-mono text-[10px] px-1.5 py-0.5 rounded border border-[#E8E8E6]"
                        style={{ color: TAG_COLOR[step.tag.toLowerCase()] }}
                      >
                        {step.tag}
                      </span>
                    </div>
                    <p className="text-sm text-[#606060] leading-relaxed">{step.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TraceSeal detail */}
      <section className="py-12 border-b border-[#E8E8E6] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="font-mono text-[11px] text-[#8A8A8A] uppercase tracking-wider">
            TraceSeal — Asset Provenance
          </div>
          <h2 className="text-lg font-[550] text-[#111111] tracking-tight">
            Fingerprint → Verify → Audit
          </h2>
          <p className="text-sm text-[#606060] leading-relaxed max-w-2xl">
            TraceSeal is designed to determine whether an asset has changed
            since its last verified state — not to automatically trust it after
            modification. An asset fingerprint is computed at ingestion. Before
            any AI workflow consumes the asset, the fingerprint is re-verified.
            Any modification triggers an integrity failure, blocking or escalating
            the request according to policy.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {["Asset Fingerprint", "Integrity Status", "Provenance Status", "Modified / Unchanged"].map((l) => (
              <div key={l} className="p-3 border border-[#E8E8E6] rounded bg-[#FAFAFA] text-xs text-[#606060] font-mono text-center">
                {l}
              </div>
            ))}
          </div>
          <p className="text-[11px] text-[#AAAAAA] font-mono">
            Status: Planned. Not implemented in current prototype.
          </p>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-12 border-b border-[#E8E8E6] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="font-mono text-[11px] text-[#8A8A8A] uppercase tracking-wider mb-4">
            Implementation Stack
          </div>
          <div className="space-y-px">
            {STACK.map((row) => (
              <div key={row.label} className="flex items-start gap-4 py-3 border-b border-[#F0F0EE] last:border-0">
                <span className="w-32 sm:w-40 text-xs font-medium text-[#111111] flex-shrink-0">{row.label}</span>
                <span className="text-xs text-[#606060] flex-1">{row.value}</span>
                <span
                  className="font-mono text-[10px] flex-shrink-0"
                  style={{ color: TAG_COLOR[row.status] }}
                >
                  {row.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-wrap gap-3">
          <Link to="/demo" className="primary-button text-sm">
            Try Demo <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/research" className="secondary-button text-sm">
            Explore Methodology
          </Link>
        </div>
      </section>
    </div>
  );
};
