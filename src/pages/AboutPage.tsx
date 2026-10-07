import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export const AboutPage: React.FC = () => (
  <div className="w-full overflow-x-hidden">
    {/* Hero */}
    <section className="py-14 sm:py-20 border-b border-[#E8E8E6] bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-5">
        <div className="font-mono text-[11px] text-[#8A8A8A] uppercase tracking-wider">
          About AgentTrap
        </div>
        <h1
          className="font-[550] tracking-[-0.03em] text-[#111111] leading-[1.06]"
          style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
        >
          AI Privacy, Provenance &amp; Runtime Governance.
        </h1>
        <p className="text-[16px] text-[#606060] leading-relaxed max-w-2xl">
          AgentTrap makes data exposure visible, asset provenance verifiable,
          and AI interactions governable — before sensitive information crosses
          untrusted boundaries.
        </p>
        <div className="flex flex-wrap gap-3 pt-1">
          <Link
            to="/demo"
            className="px-5 py-2.5 text-sm font-medium text-white bg-[#111111] rounded hover:bg-[#222222] transition-colors inline-flex items-center gap-2 min-h-[44px]"
          >
            Try Demo <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>

    {/* Three product layers */}
    <section className="py-12 sm:py-16 border-b border-[#E8E8E6] bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="font-mono text-[11px] text-[#8A8A8A] uppercase tracking-wider">
          Three Product Layers
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            {
              tag: "WEB APP · NOW",
              title: "Exposure Intelligence",
              text: "Upload a file, select a sharing destination, and receive an explainable privacy exposure estimate. Deterministic analysis — no LLM required.",
            },
            {
              tag: "INDIVIDUAL APP · PLANNED",
              title: "Personal Privacy Guard",
              text: "An installable, local-first app that gives individuals visibility into their AI activity and data flows before files leave their device.",
            },
            {
              tag: "ENTERPRISE CRM · PLANNED",
              title: "Runtime Governance Platform",
              text: "A locally controlled deployment with TraceSeal provenance verification, deterministic policy enforcement, and tamper-evident audit logging.",
            },
          ].map((l) => (
            <div key={l.title} className="p-5 border border-[#E8E8E6] rounded bg-[#FAFAFA] space-y-2">
              <div className="font-mono text-[10px] text-[#8A8A8A] uppercase">{l.tag}</div>
              <h3 className="text-sm font-semibold text-[#111111]">{l.title}</h3>
              <p className="text-xs text-[#606060] leading-relaxed">{l.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Working scope */}
    <section className="py-12 border-b border-[#E8E8E6] bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <div className="font-mono text-[11px] text-[#8A8A8A] uppercase tracking-wider">
          Honest Scope
        </div>
        <div className="space-y-5">
          {[
            {
              title: "What is working today",
              text: "The web prototype parses supported uploads and computes reproducible exposure assessments. Every result distinguishes detected patterns, documented policy facts, inference, and unknowns. Confidence is a qualitative coverage label — not a probability.",
            },
            {
              title: "What is planned",
              text: "TraceSeal provenance, runtime policy controls, and optional bounded AI assistance (NeMo Guardrails) are planned. Implementation status is shown accurately so users can assess the product correctly.",
            },
            {
              title: "What we cannot see",
              text: "AgentTrap has no privileged visibility inside Google, Meta, OpenAI, or any other provider. It cannot confirm that an uploaded file was used in training, forwarded, or deleted by a third party. The risk score is an estimate — not proof of data transfer.",
            },
            {
              title: "Data handling — web demo",
              text: "Files uploaded via the web demo are sent to the AgentTrap server, processed in memory, and not permanently stored. No raw-content logging. No upload to the selected platform. Reports exist only in browser memory until cleared or reloaded.",
            },
          ].map((s) => (
            <section key={s.title} className="py-5 border-t border-[#E8E8E6]">
              <h2 className="text-sm font-semibold text-[#111111] mb-2">{s.title}</h2>
              <p className="text-sm text-[#606060] leading-relaxed">{s.text}</p>
            </section>
          ))}
        </div>
      </div>
    </section>

    {/* Research direction */}
    <section className="py-12 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
        <div className="font-mono text-[11px] text-[#8A8A8A] uppercase tracking-wider">
          Research Direction
        </div>
        <p className="text-sm text-[#606060] leading-relaxed max-w-2xl">
          Our research focuses on making privacy decisions inspectable and
          deterministic enforcement practical. We are exploring validated
          entity recognition, visual content classification, regional policy
          applicability, and purpose-aware runtime controls.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link to="/research" className="secondary-button text-sm">
            Methodology
          </Link>
          <Link to="/technology" className="secondary-button text-sm">
            Architecture
          </Link>
        </div>
      </div>
    </section>
  </div>
);
