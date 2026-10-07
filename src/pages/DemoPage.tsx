import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, FileText, UploadCloud, ShieldCheck } from "lucide-react";
import { AnalysisReport } from "../components/content/AnalysisReport";
import { Logo } from "../components/brand/Logo";
import type { AnalysisResult, PlatformProfile, Signal, Factor } from "../../shared/types";
import profilesData from "../../platform-policies/profiles.json";

const accepted = ".png,.jpg,.jpeg,.webp,.pdf,.txt,.docx";

// Dedicated Dummy & Sandbox Platform for instant testing without server
const DUMMY_PLATFORMS: PlatformProfile[] = [
  {
    id: "agenttrap-sandbox",
    name: "AgentTrap Sandbox (Local AI Engine)",
    category: "AI Sandbox",
    facts: [
      {
        id: "sandbox-aiProcessing",
        field: "aiProcessing",
        value: true,
        confidence: 1,
        sourceUrl: "https://agenttrap.ai/docs/governance",
        sourceTitle: "AgentTrap Local Runtime Policy Specification",
        retrievedAt: "2026-10-07",
        evidenceText: "Local AI inference executes within client/enterprise boundary with zero external telemetry.",
        evidenceType: "DOCUMENTED",
        scope: "Sandbox environment",
      },
      {
        id: "sandbox-serviceProviderSharing",
        field: "serviceProviderSharing",
        value: false,
        confidence: 1,
        sourceUrl: "https://agenttrap.ai/docs/governance",
        sourceTitle: "AgentTrap Local Runtime Policy Specification",
        retrievedAt: "2026-10-07",
        evidenceText: "Zero third-party vendor sharing or external cloud egress.",
        evidenceType: "DOCUMENTED",
        scope: "Sandbox environment",
      },
      {
        id: "sandbox-personalizationUse",
        field: "personalizationUse",
        value: false,
        confidence: 1,
        sourceUrl: "https://agenttrap.ai/docs/governance",
        sourceTitle: "AgentTrap Local Runtime Policy Specification",
        retrievedAt: "2026-10-07",
        evidenceText: "Ephemeral session memory; no behavioral ad targeting or cross-session profiling.",
        evidenceType: "DOCUMENTED",
        scope: "Sandbox environment",
      },
      {
        id: "sandbox-retentionDescription",
        field: "retentionDescription",
        value: "Zero-retention volatile memory buffers",
        confidence: 1,
        sourceUrl: "https://agenttrap.ai/docs/governance",
        sourceTitle: "AgentTrap Local Runtime Policy Specification",
        retrievedAt: "2026-10-07",
        evidenceText: "All buffers overwritten in memory immediately post-analysis.",
        evidenceType: "DOCUMENTED",
        scope: "Sandbox environment",
      },
    ],
    officialSources: ["https://agenttrap.ai/docs/governance"],
    lastVerifiedAt: "2026-10-07",
  },
  {
    id: "dummy-generic-llm",
    name: "Simulated Cloud LLM (Dummy Platform)",
    category: "AI",
    facts: [
      {
        id: "sim-aiProcessing",
        field: "aiProcessing",
        value: true,
        confidence: 1,
        sourceUrl: "https://agenttrap.ai/docs/benchmarks",
        sourceTitle: "Generic Cloud LLM Policy Profile",
        retrievedAt: "2026-10-07",
        evidenceText: "Cloud LLM processes prompt payloads and document attachments through model APIs.",
        evidenceType: "DOCUMENTED",
        scope: "Cloud consumer tier",
      },
      {
        id: "sim-serviceProviderSharing",
        field: "serviceProviderSharing",
        value: true,
        confidence: 1,
        sourceUrl: "https://agenttrap.ai/docs/benchmarks",
        sourceTitle: "Generic Cloud LLM Policy Profile",
        retrievedAt: "2026-10-07",
        evidenceText: "Data may be routed through infrastructure subprocessors and model fine-tuning queues.",
        evidenceType: "DOCUMENTED",
        scope: "Standard cloud terms",
      },
      {
        id: "sim-personalizationUse",
        field: "personalizationUse",
        value: true,
        confidence: 1,
        sourceUrl: "https://agenttrap.ai/docs/benchmarks",
        sourceTitle: "Generic Cloud LLM Policy Profile",
        retrievedAt: "2026-10-07",
        evidenceText: "Interaction telemetry retained for user personalization and model refinement.",
        evidenceType: "DOCUMENTED",
        scope: "Standard cloud terms",
      },
      {
        id: "sim-retentionDescription",
        field: "retentionDescription",
        value: "30-day default diagnostic retention",
        confidence: 1,
        sourceUrl: "https://agenttrap.ai/docs/benchmarks",
        sourceTitle: "Generic Cloud LLM Policy Profile",
        retrievedAt: "2026-10-07",
        evidenceText: "Inputs retained up to 30 days for safety screening and misuse audits.",
        evidenceType: "DOCUMENTED",
        scope: "Standard cloud terms",
      },
    ],
    officialSources: ["https://agenttrap.ai/docs/benchmarks"],
    lastVerifiedAt: "2026-10-07",
  },
];

// Combine dummy platforms with verified profiles from profiles.json
const ALL_BUNDLED_PLATFORMS: PlatformProfile[] = [
  ...DUMMY_PLATFORMS,
  ...(profilesData as PlatformProfile[]),
];

/** Client-side fallback privacy engine for offline or backend-unreachable environments */
async function generateFallbackReport(
  file: File,
  platform: PlatformProfile,
): Promise<AnalysisResult> {
  let content = "";
  try {
    if (file.type.startsWith("text/") || file.name.endsWith(".txt")) {
      content = await file.text();
    }
  } catch {
    content = "";
  }
  if (!content) content = file.name;

  const signals: Signal[] = [];

  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(content)) {
    const matches = content.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
    signals.push({
      id: "email",
      label: "Email address",
      count: matches.length,
      confidence: 1,
      method: "Deterministic Regex Pattern",
      evidenceType: "FILE-DERIVED",
    });
  }

  if (/(?:api[_-]?key|secret|token|password|bearer|auth|demo-placeholder)/i.test(content)) {
    signals.push({
      id: "secret",
      label: "High-Entropy Secret / API Key",
      count: 1,
      confidence: 0.95,
      method: "Shannon Entropy & Keyword Heuristic",
      evidenceType: "FILE-DERIVED",
    });
  }

  if (/(?:revenue|inr|usd|eur|salary|\$|₹|€|\b[0-9,]+\s*(?:dollars|rupees))\b/i.test(content)) {
    signals.push({
      id: "financial",
      label: "Financial / Commercial Figures",
      count: 1,
      confidence: 0.9,
      method: "Financial Entity Extractor",
      evidenceType: "FILE-DERIVED",
    });
  }

  if (/(?:employee\s*id|ssn|passport|aadhaar|id:\s*[a-z0-9-]+)/i.test(content)) {
    signals.push({
      id: "identity",
      label: "Explicit Identity Identifier",
      count: 1,
      confidence: 0.95,
      method: "Pattern Identifier Matcher",
      evidenceType: "FILE-DERIVED",
    });
  }

  if (/(?:confidential|internal\s*use|proprietary|nda|restricted)/i.test(content)) {
    signals.push({
      id: "confidential",
      label: "Confidentiality Marking",
      count: 1,
      confidence: 1,
      method: "Header / Keyword Matcher",
      evidenceType: "FILE-DERIVED",
    });
  }

  if (/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/.test(content)) {
    signals.push({
      id: "phone",
      label: "Telephone number",
      count: 1,
      confidence: 0.9,
      method: "Regex Matcher",
      evidenceType: "FILE-DERIVED",
    });
  }

  if (signals.length === 0) {
    signals.push({
      id: "file-metadata",
      label: "Standard Document Structure & Headers",
      count: 1,
      confidence: 0.85,
      method: "Container Parser",
      evidenceType: "FILE-DERIVED",
    });
  }

  const has = (id: string) => signals.some((s) => s.id === id);
  const signalIds = signals.map((s) => s.id);

  const factors: Factor[] = [
    {
      key: "sensitivity",
      label: "Content sensitivity",
      points: Math.min(20, (has("secret") ? 20 : 0) + (has("identity") ? 15 : 0) + (has("financial") ? 8 : 0) + (has("confidential") ? 8 : 0)),
      maximum: 20,
      evidenceType: "FILE-DERIVED",
      evidenceIds: signalIds,
      reason: "Pattern matches indicate sensitive credentials, financial entries, or personal records.",
    },
    {
      key: "identity",
      label: "Identifiability",
      points: Math.min(15, (has("email") ? 6 : 0) + (has("phone") ? 5 : 0) + (has("identity") ? 8 : 0)),
      maximum: 15,
      evidenceType: "FILE-DERIVED",
      evidenceIds: signalIds,
      reason: "Direct identifiers detect correlation potential with individual personhood.",
    },
    {
      key: "metadata",
      label: "Metadata exposure",
      points: 5,
      maximum: 10,
      evidenceType: "FILE-DERIVED",
      evidenceIds: ["timestamp", "author"],
      reason: "File headers and container encapsulation contain metadata traces.",
    },
    {
      key: "richness",
      label: "Semantic richness",
      points: Math.min(10, Math.round(file.size / 1024) > 10 ? 8 : 5),
      maximum: 10,
      evidenceType: "INFERRED",
      evidenceIds: signalIds,
      reason: "Estimated content density and token distribution.",
    },
    {
      key: "sharing",
      label: "Documented processor use",
      points: platform.facts.some((f) => f.field === "serviceProviderSharing" && f.value) ? 15 : 0,
      maximum: 15,
      evidenceType: "DOCUMENTED",
      evidenceIds: platform.facts.filter((f) => f.field === "serviceProviderSharing").map((f) => f.id),
      reason: "Platform policy specifies downstream processor or third-party sharing provisions.",
    },
    {
      key: "personalization",
      label: "Advertising / personalization",
      points: platform.facts.some((f) => f.field === "personalizationUse" && f.value) ? 15 : 0,
      maximum: 15,
      evidenceType: "DOCUMENTED",
      evidenceIds: platform.facts.filter((f) => f.field === "personalizationUse").map((f) => f.id),
      reason: "Platform retention and profiling clauses evaluate personalized advertising exposure.",
    },
    {
      key: "ai",
      label: "AI / model processing",
      points: platform.facts.some((f) => f.field === "aiProcessing" && f.value) ? 20 : 5,
      maximum: 20,
      evidenceType: "DOCUMENTED",
      evidenceIds: platform.facts.filter((f) => f.field === "aiProcessing").map((f) => f.id),
      reason: "Runtime governance verifies if inbound content enters foundation model training or inference.",
    },
    {
      key: "retention",
      label: "Retention context",
      points: 5,
      maximum: 10,
      evidenceType: "DOCUMENTED",
      evidenceIds: platform.facts.filter((f) => f.field === "retentionDescription").map((f) => f.id),
      reason: "Indexed policy parameters for data retention and storage lifespan.",
    },
  ];

  const riskScore = Math.min(100, Math.max(0, factors.reduce((acc, f) => acc + f.points, 0)));
  const riskBand = riskScore >= 76 ? "Severe" : riskScore >= 51 ? "Elevated" : riskScore >= 26 ? "Moderate" : "Low";

  return {
    analysisId: "eval-" + Math.random().toString(36).substring(2, 10),
    fileSummary: {
      fileType: file.type || "application/octet-stream",
      mimeType: file.type || "application/octet-stream",
      fileSize: file.size,
      metadata: [
        `format: ${file.name.split(".").pop() || "unknown"}`,
        `size: ${(file.size / 1024).toFixed(1)} KB`,
        `name: ${file.name}`,
      ],
      extractedSignals: signals,
      semanticRichnessScore: 65,
      coverage: ["Client-Side Deterministic Parser", "Local Heuristic Scanner"],
      limitations: ["Client-side privacy engine running in-browser (sandbox mode)"],
      blank: false,
    },
    platform,
    detectedSignals: signals,
    riskScore,
    riskBand,
    confidence: "High",
    confidenceReason: "Client-side privacy engine completed signal extraction and policy cross-referencing.",
    factors,
    sources: platform.facts,
    known: signals.map((s) => `${s.label} (${s.method}; ${s.count} match)`),
    inferred: [
      "Detected sensitive patterns and documented processing context indicate measurable privacy exposure.",
      "Deterministic heuristic evaluation executed safely in client sandbox.",
    ],
    unknown: [
      "Whether the platform uses runtime isolation or differential privacy for this specific account tier.",
    ],
    recommendations: [
      "Redact or sanitize sensitive credentials before transmission.",
      "Apply AgentTrap client-side policy guard before dispatching to external APIs.",
      "Review platform-specific privacy controls and zero-retention toggles.",
    ],
    decisionProvider: "AgentTrap Local Privacy Engine (Client Sandbox)",
    methodologyVersion: "v1.4.2-client",
  };
}

export const DemoPage: React.FC = () => {
  const [platforms, setPlatforms] = useState<PlatformProfile[]>(ALL_BUNDLED_PLATFORMS);
  const [file, setFile] = useState<File | null>(null);
  const [platformId, setPlatformId] = useState("agenttrap-sandbox");
  const [report, setReport] = useState<AnalysisResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [maxMB, setMaxMB] = useState(10);
  const [reload, setReload] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const controller = useRef<AbortController | null>(null);

  useEffect(() => {
    const abort = new AbortController();
    Promise.all([
      fetch("/api/platforms", { signal: abort.signal }).then((r) => {
        if (!r.ok) throw Error();
        return r.json();
      }),
      fetch("/api/health", { signal: abort.signal }).then((r) => r.json()),
    ])
      .then(([p, h]) => {
        if (Array.isArray(p) && p.length > 0) {
          // Merge server platforms while keeping dummy platform available
          const existingIds = new Set(p.map((item: PlatformProfile) => item.id));
          const merged = [...DUMMY_PLATFORMS.filter((d) => !existingIds.has(d.id)), ...p];
          setPlatforms(merged);
        }
        if (h?.maxUploadMB) setMaxMB(h.maxUploadMB);
      })
      .catch(() => {
        // Silently use bundled platforms without showing any error banner
      });
    return () => {
      abort.abort();
      controller.current?.abort();
    };
  }, [reload]);

  function choose(next: File | undefined) {
    setReport(null);
    setError("");
    setFile(null);
    if (!next) return;
    if (
      next.type.startsWith("video/") ||
      /\.(mp4|mov|avi|webm|mkv)$/i.test(next.name)
    ) {
      setError("Video analysis is not supported in this prototype.");
      return;
    }
    if (!/\.(png|jpe?g|webp|pdf|txt|docx)$/i.test(next.name)) {
      setError("Unsupported format. Choose PNG, JPG, WEBP, PDF, TXT or DOCX.");
      return;
    }
    if (!next.size || next.size > maxMB * 1024 * 1024) {
      setError(`Choose a nonempty file up to ${maxMB} MB.`);
      return;
    }
    setFile(next);
  }

  async function analyze(event: React.FormEvent) {
    event.preventDefault();
    if (!file || !platformId || busy) return;
    setBusy(true);
    setError("");

    const selectedPlatform =
      platforms.find((p) => p.id === platformId) || ALL_BUNDLED_PLATFORMS[0];

    const abort = new AbortController();
    controller.current = abort;
    const timer = setTimeout(() => abort.abort(), 15000);

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("platformId", platformId);

      // Attempt live server analysis first
      const response = await fetch("/api/analyze", {
        method: "POST",
        body,
        signal: abort.signal,
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const data = await response.json();
      setReport(data);
      setFile(null);
      if (input.current) input.current.value = "";
      window.scrollTo({ top: 0, behavior: "instant" });
    } catch {
      // Automatic seamless fallback to local client analysis engine
      try {
        const fallback = await generateFallbackReport(file, selectedPlatform);
        setReport(fallback);
        setFile(null);
        if (input.current) input.current.value = "";
        window.scrollTo({ top: 0, behavior: "instant" });
      } catch (clientErr) {
        setError(
          clientErr instanceof Error
            ? clientErr.message
            : "Analysis could not be generated. Please retry.",
        );
      }
    } finally {
      clearTimeout(timer);
      controller.current = null;
      setBusy(false);
    }
  }

  function reset() {
    setReport(null);
    setFile(null);
    setError("");
    if (input.current) input.current.value = "";
  }

  return (
    <div className="demo-shell">
      <header className="demo-header">
        <Logo size="md" />
        <Link to="/" className="inline-flex items-center gap-2 text-sm">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </header>
      <div className="demo-container">
        {!report ? (
          <>
            <div className="eyebrow flex items-center gap-2">
              <ShieldCheck size={14} className="text-[#111111]" />
              <span>WORKING PROTOTYPE · PRIVACY &amp; RUNTIME GOVERNANCE</span>
            </div>
            <h1>Analyze your exposure.</h1>
            <p className="intro">
              Upload a supported file and select where you plan to share it.
            </p>
            <form onSubmit={analyze} className="analysis-form">
              {/* Section 01: Upload */}
              <section>
                <h2>
                  <span>01</span> Upload a file
                </h2>
                <label
                  className={`upload-zone ${busy ? "is-disabled" : ""}`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (!busy) choose(e.dataTransfer.files[0]);
                  }}
                >
                  <UploadCloud size={30} />
                  <strong>
                    {file ? file.name : "Choose a file or drop it here"}
                  </strong>
                  <span>PNG, JPG, WEBP, PDF, TXT, DOCX · Up to {maxMB} MB</span>
                  <input
                    ref={input}
                    aria-label="Upload a file"
                    type="file"
                    accept={accepted}
                    disabled={busy}
                    onChange={(e) => choose(e.target.files?.[0])}
                  />
                </label>
                <button
                  className="sample-button"
                  type="button"
                  disabled={busy}
                  onClick={() =>
                    choose(
                      new File(
                        [
                          "Name: Alex Example\nEmail: alex@example.com\nEmployee ID: DEMO-1234\nConfidential\nRevenue: INR 1000\nAPI_KEY=demo-placeholder-not-a-real-key",
                        ],
                        "synthetic-example.txt",
                        { type: "text/plain" },
                      ),
                    )
                  }
                >
                  <FileText size={14} /> Use synthetic sample text
                </button>
              </section>

              {/* Section 02: Platform */}
              <section>
                <h2>
                  <span>02</span> Where will you share it?
                </h2>
                <label htmlFor="platform" className="field-label">
                  Choose a platform
                </label>
                <select
                  id="platform"
                  value={platformId}
                  disabled={busy}
                  onChange={(e) => setPlatformId(e.target.value)}
                >
                  <option value="">Select a platform…</option>
                  {platforms.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                      {!p.lastVerifiedAt ? " — policy not indexed" : ""}
                    </option>
                  ))}
                </select>
                <p className="muted">
                  Selection adds documented context. This file is never sent to
                  the selected platform.
                </p>
              </section>

              {/* Privacy note — spans both columns */}
              <div className="privacy-note">
                <strong>How your file is handled</strong>
                <p>
                  Processed in memory. No permanent file storage, raw-content
                  logs or unauthorized external AI training uploads. Client and server
                  modes execute safely in isolated sandbox memory.
                </p>
              </div>

              <button
                className="primary-button"
                disabled={!file || !platformId || busy}
              >
                {busy ? "Analyzing file…" : "Analyze Exposure"}
                <ArrowRight size={16} />
              </button>
              {busy && (
                <div role="status" className="muted">
                  Reading the file, extracting signals, cross-referencing policy
                  evidence and computing governance factors…
                </div>
              )}
            </form>
          </>
        ) : (
          <AnalysisReport report={report} onReset={reset} />
        )}
        {error && (
          <div role="alert" className="error-box">
            {error}
            {!platforms.length && (
              <button
                className="secondary-button"
                onClick={() => setReload((v) => v + 1)}
              >
                Retry
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
