import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { AnalysisResult } from "../../../shared/types";
export const AnalysisReport: React.FC<{
  report: AnalysisResult;
  onReset: () => void;
}> = ({ report, onReset }) => (
  <>
    <div className="eyebrow">
      EXPOSURE ASSESSMENT · {report.methodologyVersion}
    </div>
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
      This score is an explainable heuristic index. It is not the probability of
      exploitation, proof of data transfer or a measurement of platform
      behavior. Unknown or unassessed features add no points; a low score does
      not establish safety.
    </p>
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
              <p>
                Detector confidence: {Math.round(s.confidence * 100)}%
                (heuristic)
              </p>
            </article>
          ))}
        </div>
      ) : (
        <p>
          No supported sensitive patterns were detected. Check the coverage and
          limitations below.
        </p>
      )}
    </section>
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
                {f.evidenceIds.length
                  ? f.evidenceIds.join(", ")
                  : "None in indexed analysis"}
              </p>
            </div>
            <strong>+{f.points}</strong>
          </article>
        ))}
      </div>
    </section>
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
    <section className="report-section">
      <h2>Potential Processing Context & Official Sources</h2>
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
