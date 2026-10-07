import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Hash, Shield } from "lucide-react";
import type { AnalysisResult } from "../../../shared/types";

/** Derive a simple SHA-like fingerprint representation from the analysisId */
function formatFingerprint(analysisId: string): string {
  return `AT-${analysisId.slice(0, 8).toUpperCase()}-${analysisId.slice(8, 16).toUpperCase()}`;
}

export const AnalysisReport: React.FC<{
  report: AnalysisResult;
  onReset: () => void;
}> = ({ report, onReset }) => (
  <>
    {/* Header */}
    <div className="eyebrow">EXPOSURE ASSESSMENT · {report.methodologyVersion}</div>
    <div className="result-heading">
      <div>
        <h1>Understand before you share.</h1>
        <p className="intro">
          {report.platform.name} · {report.fileSummary.fileType.toUpperCase()} ·{" "}
          {(report.fileSummary.fileSize / 1024).toFixed(1)} KB
        </p>
      </div>
      <button className="secondary-button" onClick={onReset}>
        Analyze Another File
      </button>
    </div>

    {/* ── EXPOSURE ────────────────────────────────────────────── */}
    <section className="score-strip">
      <div>
        <div className="eyebrow">EXPOSURE RISK</div>
        <div className="score">
          {report.riskScore}
          <span>/ 100</span>
        </div>
      </div>
      <div>
        <strong>{report.riskBand}</strong>
        <p>Prototype heuristic band</p>
      </div>
      <div>
        <strong>Confidence: {report.confidence}</strong>
        <p>{report.confidenceReason}</p>
      </div>
    </section>

    <p className="assessment-note">
      This score is an explainable heuristic index — not a probability of
      exploitation, proof of data transfer, or measurement of platform
      behavior. Unknown or unassessed features add no points; a low score does
      not establish safety.
    </p>

    {/* Detected Signals */}
    <section className="report-section">
      <h2>Detected Signals</h2>
      {report.detectedSignals.length ? (
        <div className="signal-grid">
          {report.detectedSignals.map((s) => (
            <article key={s.id}>
              <div className="eyebrow">{s.evidenceType}</div>
              <h3>{s.label}</h3>
              <p>
                {s.count} match{s.count === 1 ? "" : "es"} · {s.method}
              </p>
              <p>Detector confidence: {Math.round(s.confidence * 100)}% (heuristic)</p>
            </article>
          ))}
        </div>
      ) : (
        <p>No supported sensitive patterns were detected. Check the coverage and limitations below.</p>
      )}
    </section>

    {/* Score Factors */}
    <section className="report-section">
      <h2>Why This Score?</h2>
      <div className="factor-list">
        {report.factors.map((f) => (
          <article key={f.key}>
            <div>
              <strong>{f.label}</strong>
              <p>
                {f.evidenceType} · Maximum {f.maximum}
              </p>
              <p>{f.reason}</p>
              <p>
                Evidence:{" "}
                {f.evidenceIds.length ? f.evidenceIds.join(", ") : "None in indexed analysis"}
              </p>
            </div>
            <strong>+{f.points}</strong>
          </article>
        ))}
      </div>
    </section>

    {/* ── PROVENANCE (TraceSeal) ───────────────────────────────── */}
    <section className="report-section">
      <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Hash size={16} />
        Provenance &amp; Integrity
      </h2>
      <p className="muted" style={{ marginTop: 0, marginBottom: 16 }}>
        TraceSeal asset fingerprinting is a planned feature. The analysis ID
        below serves as a session-scoped reference for this report only — it is
        not a cryptographic chain-of-custody record.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 8,
        }}
      >
        {[
          {
            label: "Asset Fingerprint",
            value: formatFingerprint(report.analysisId),
            sub: "Session reference only — not a cryptographic hash",
          },
          {
            label: "Integrity Status",
            value: "UNVERIFIED",
            sub: "TraceSeal verification not yet implemented",
          },
          {
            label: "Provenance Status",
            value: "UNKNOWN",
            sub: "Chain-of-custody tracking is a planned feature",
          },
          {
            label: "Modification Check",
            value: "NOT PERFORMED",
            sub: "Requires TraceSeal baseline fingerprint",
          },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              padding: "14px 16px",
              background: "#FAFAFA",
              border: "1px solid #E8E8E6",
              borderRadius: 4,
            }}
          >
            <div
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: 10,
                color: "#8A8A8A",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 4,
              }}
            >
              {item.label}
            </div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "#111111" }}>
              {item.value}
            </div>
            <div style={{ fontSize: 11, color: "#8A8A8A", marginTop: 2 }}>
              {item.sub}
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* ── RUNTIME POLICY GUARD ───────────────────────────────── */}
    <section className="report-section">
      <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Shield size={16} />
        Runtime Policy Guard
      </h2>
      <p className="muted" style={{ marginTop: 0, marginBottom: 16 }}>
        The Runtime Policy Guard evaluates the requested purpose against
        deterministic policy rules and returns a binding decision. This feature
        is planned — the current demo shows the exposure score only.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
          marginBottom: 12,
        }}
      >
        {[
          { verdict: "ALLOW", desc: "Policy satisfied" },
          { verdict: "MONITOR", desc: "Allowed with audit log" },
          { verdict: "APPROVAL_REQUIRED", desc: "Human review gate" },
          { verdict: "BLOCK", desc: "Policy violated" },
        ].map((d) => (
          <div
            key={d.verdict}
            style={{
              padding: "10px 14px",
              background: "#FAFAFA",
              border: "1px solid #E8E8E6",
              borderRadius: 4,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span
              style={{
                fontFamily: "ui-monospace, monospace",
                fontSize: 10,
                fontWeight: 600,
                color: "#111111",
                whiteSpace: "nowrap",
              }}
            >
              {d.verdict}
            </span>
            <span style={{ fontSize: 12, color: "#606060" }}>{d.desc}</span>
          </div>
        ))}
      </div>
      <p
        style={{
          fontFamily: "ui-monospace, monospace",
          fontSize: 10,
          color: "#AAAAAA",
          marginTop: 8,
        }}
      >
        Status: Planned · Deterministic rules will be the final enforcement
        layer. An LLM may assist with interpretation but will not be the sole
        security authority.
      </p>
    </section>

    {/* Knowledge Grid */}
    <div className="knowledge-grid">
      {[
        ["What We Know", report.known],
        ["What We Infer", report.inferred],
        ["What We Cannot Verify", report.unknown],
      ].map(([title, items]) => (
        <section className="report-section" key={title as string}>
          <h2>{title as string}</h2>
          <ul>
            {(items as string[]).map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>

    {/* Official Sources */}
    <section className="report-section">
      <h2>Potential Processing Context &amp; Official Sources</h2>
      <p className="muted">
        Policies describe possible processing. They do not show what happened to
        this exact file.
      </p>
      {report.sources.length ? (
        report.sources.map((s) => (
          <details key={s.id}>
            <summary>{s.field} · DOCUMENTED</summary>
            <p>{s.evidenceText}</p>
            <p>Scope: {s.scope}</p>
            <p>
              Reviewed {s.retrievedAt} · Documentation confidence{" "}
              {Math.round(s.confidence * 100)}%
            </p>
            <p>Evidence ID: {s.id}</p>
            <a href={s.sourceUrl} target="_blank" rel="noopener noreferrer">
              {s.sourceTitle} ↗
            </a>
          </details>
        ))
      ) : (
        <p>
          Not enough verified information. This report uses file-derived signals
          only.
        </p>
      )}
    </section>

    {/* Coverage */}
    <section className="report-section">
      <h2>Analysis Coverage</h2>
      <ul>
        {report.fileSummary.coverage.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p>
        Semantic richness: {report.fileSummary.semanticRichnessScore}/100 ·{" "}
        {report.fileSummary.blank
          ? "Approximately uniform pixels detected"
          : "Information-content proxy"}
      </p>
      <p>Decision support: {report.decisionProvider}</p>
    </section>

    {/* Recommendations */}
    <section className="report-section">
      <h2>Recommendations</h2>
      <ul>
        {report.recommendations.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>

    <div className="result-actions">
      <button className="primary-button" onClick={onReset}>
        Analyze Another File <ArrowRight size={16} />
      </button>
      <Link className="secondary-button" to="/research">
        Explore Methodology
      </Link>
    </div>
  </>
);
