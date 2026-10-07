import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Server, Lock, GitBranch, ShieldCheck } from "lucide-react";

const POLICY_DECISIONS = [
  { verdict: "ALLOW", color: "#111111", desc: "Policy satisfied — access permitted." },
  { verdict: "MONITOR", color: "#555555", desc: "Allowed with audit event logged." },
  { verdict: "APPROVAL_REQUIRED", color: "#666666", desc: "Human review gate triggered." },
  { verdict: "BLOCK", color: "#111111", bg: "#F5F5F5", desc: "Policy violated — action blocked." },
];

const CAPABILITIES = [
  {
    icon: Server,
    tag: "DEPLOYMENT",
    title: "Locally Controlled",
    text:
      "Enterprise deployment is designed for on-premise or private cloud operation. Sensitive documents never traverse external infrastructure for core analysis. Policy rules execute locally before any AI call is made.",
    status: "planned",
  },
  {
    icon: ShieldCheck,
    tag: "POLICY ENFORCEMENT",
    title: "Runtime Policy Guard",
    text:
      "Deterministic policy rules are the final authority — not an LLM. The system evaluates the requested purpose (Internal Analysis, Model Training, External Sharing, Enterprise Processing) and returns a binding decision: ALLOW, MONITOR, APPROVAL_REQUIRED, or BLOCK.",
    status: "planned",
  },
  {
    icon: GitBranch,
    tag: "PROVENANCE",
    title: "TraceSeal Asset Fingerprinting",
    text:
      "Enterprise assets receive a cryptographic fingerprint at ingestion. Subsequent access checks verify integrity — detecting whether a document has been modified before an AI workflow is permitted to use it. Chain-of-custody events are stored in a tamper-evident audit log.",
    status: "planned",
  },
  {
    icon: Lock,
    tag: "GOVERNANCE",
    title: "Audit & Compliance",
    text:
      "Every policy evaluation, override request, and approval event is recorded with a timestamp, actor identity, and decision reason. Audit logs are designed for export to compliance tooling. Role-based access controls limit who may approve or override decisions.",
    status: "planned",
  },
];

export const EnterprisePage: React.FC = () => {
  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero */}
      <section className="py-14 sm:py-20 border-b border-[#E8E8E6] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-5">
          <div className="font-mono text-[11px] text-[#8A8A8A] uppercase tracking-wider">
            Enterprise · AI Governance Platform
          </div>
          <h1
            className="font-[550] tracking-[-0.03em] text-[#111111] leading-[1.06]"
            style={{ fontSize: "clamp(30px, 4vw, 46px)" }}
          >
            Governed AI workflows. Locally controlled.
          </h1>
          <p className="text-[16px] text-[#606060] leading-relaxed max-w-2xl">
            The Enterprise layer extends AgentTrap's exposure intelligence into
            a full runtime governance platform — with deterministic policy
            enforcement, TraceSeal provenance verification, and a tamper-evident
            audit trail, all designed to run within your infrastructure.
          </p>
          <div className="p-3 border border-[#E8E8E6] rounded bg-[#FAFAFA] text-[11px] text-[#8A8A8A] font-mono max-w-xl">
            Status: Enterprise CRM is planned. The exposure intelligence
            prototype runs today — enterprise enforcement capabilities are
            roadmap work.
          </div>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              to="/demo"
              className="px-5 py-2.5 text-sm font-medium text-white bg-[#111111] rounded hover:bg-[#222222] transition-colors inline-flex items-center gap-2 min-h-[44px]"
            >
              Try Current Demo <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/technology"
              className="px-5 py-2.5 text-sm font-medium text-[#111111] border border-[#E8E8E6] rounded hover:bg-[#FAFAFA] transition-colors inline-flex items-center gap-1.5 min-h-[44px]"
            >
              Architecture
            </Link>
          </div>
        </div>
      </section>

      {/* Policy Decisions */}
      <section className="py-12 sm:py-16 border-b border-[#E8E8E6] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="font-mono text-[11px] text-[#8A8A8A] uppercase tracking-wider mb-2">
            Runtime Policy Decisions
          </div>
          <h2 className="text-xl font-[550] text-[#111111] tracking-tight mb-6">
            Four deterministic outcomes. No LLM as the final authority.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {POLICY_DECISIONS.map((d) => (
              <div
                key={d.verdict}
                className="p-4 border border-[#E8E8E6] rounded bg-[#FAFAFA] flex items-start gap-4"
              >
                <span
                  className="font-mono text-xs font-semibold px-2 py-1 rounded border border-[#E8E8E6] bg-white whitespace-nowrap flex-shrink-0"
                  style={{ color: d.color }}
                >
                  {d.verdict}
                </span>
                <p className="text-sm text-[#606060]">{d.desc}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-[#8A8A8A] leading-relaxed max-w-2xl">
            Policy decisions are generated by deterministic rule evaluation.
            An LLM or guardrail system may assist with interpretation, but
            generated text never becomes the sole security authority.
          </p>
        </div>
      </section>

      {/* Purpose-based */}
      <section className="py-12 border-b border-[#E8E8E6] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="font-mono text-[11px] text-[#8A8A8A] uppercase tracking-wider">
            Purpose-Based Decisions
          </div>
          <h2 className="text-lg font-[550] text-[#111111] tracking-tight">
            The same document. Different policy outcomes.
          </h2>
          <p className="text-sm text-[#606060] leading-relaxed max-w-2xl">
            AgentTrap does not classify documents as universally safe or unsafe.
            The policy evaluation considers both document content and intended
            purpose before returning a decision.
          </p>
          <div className="overflow-x-auto">
            <table className="text-xs w-full border-collapse min-w-[480px]">
              <thead>
                <tr className="border-b border-[#E8E8E6]">
                  <th className="text-left py-2 pr-6 font-mono text-[#8A8A8A] font-normal">Purpose</th>
                  <th className="text-left py-2 pr-6 font-mono text-[#8A8A8A] font-normal">Example Decision</th>
                  <th className="text-left py-2 font-mono text-[#8A8A8A] font-normal">Reason</th>
                </tr>
              </thead>
              <tbody className="text-[#606060]">
                <tr className="border-b border-[#F0F0EE]">
                  <td className="py-2.5 pr-6 font-medium text-[#111111]">Internal Analysis</td>
                  <td className="py-2.5 pr-6 font-mono">ALLOW</td>
                  <td className="py-2.5">Within policy boundary</td>
                </tr>
                <tr className="border-b border-[#F0F0EE]">
                  <td className="py-2.5 pr-6 font-medium text-[#111111]">Model Training</td>
                  <td className="py-2.5 pr-6 font-mono">APPROVAL_REQUIRED</td>
                  <td className="py-2.5">PII detected — review required</td>
                </tr>
                <tr className="border-b border-[#F0F0EE]">
                  <td className="py-2.5 pr-6 font-medium text-[#111111]">External Sharing</td>
                  <td className="py-2.5 pr-6 font-mono">BLOCK</td>
                  <td className="py-2.5">Confidential classification</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-6 font-medium text-[#111111]">Enterprise Processing</td>
                  <td className="py-2.5 pr-6 font-mono">MONITOR</td>
                  <td className="py-2.5">Logged for audit trail</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-12 sm:py-16 border-b border-[#E8E8E6] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="font-mono text-[11px] text-[#8A8A8A] uppercase tracking-wider mb-6">
            Enterprise Capabilities
          </div>
          <div className="space-y-6">
            {CAPABILITIES.map((cap) => {
              const Icon = cap.icon;
              return (
                <div key={cap.title} className="p-5 border border-[#E8E8E6] rounded bg-[#FAFAFA] space-y-2">
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[#111111] flex-shrink-0" />
                    <div>
                      <span className="font-mono text-[10px] text-[#8A8A8A] uppercase">{cap.tag}</span>
                      <span className="ml-2 font-mono text-[10px] text-[#AAAAAA] uppercase">· {cap.status}</span>
                    </div>
                  </div>
                  <h3 className="text-sm font-semibold text-[#111111]">{cap.title}</h3>
                  <p className="text-sm text-[#606060] leading-relaxed">{cap.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Deployment note */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-3">
          <div className="font-mono text-[11px] text-[#8A8A8A] uppercase tracking-wider">
            Deployment Boundary
          </div>
          <p className="text-sm text-[#606060] leading-relaxed max-w-2xl">
            The current prototype is not a production DLP platform.
            Authentication, organisation roles, persistent audit storage,
            security evaluation, and integration-specific enforcement are
            roadmap work. NeMo Guardrails may support policy interpretation,
            but deterministic rules remain the final enforcement layer.
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
};
