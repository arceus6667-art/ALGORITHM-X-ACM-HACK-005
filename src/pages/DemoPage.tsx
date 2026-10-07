import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, FileText, UploadCloud } from "lucide-react";
import { AnalysisReport } from "../components/content/AnalysisReport";
import { Logo } from "../components/brand/Logo";
import type { AnalysisResult, PlatformProfile } from "../../shared/types";
const accepted = ".png,.jpg,.jpeg,.webp,.pdf,.txt,.docx";
export const DemoPage: React.FC = () => {
  const [platforms, setPlatforms] = useState<PlatformProfile[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [platformId, setPlatformId] = useState("");
  const [search, setSearch] = useState("");
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
        setPlatforms(p);
        setMaxMB(h.maxUploadMB);
        setError("");
      })
      .catch(() => {
        if (!abort.signal.aborted)
          setError("Platform list unavailable. Check the backend and retry.");
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
    const abort = new AbortController();
    controller.current = abort;
    const timer = setTimeout(() => abort.abort(), 30000);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("platformId", platformId);
      const response = await fetch("/api/analyze", {
        method: "POST",
        body,
        signal: abort.signal,
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.error || "Analysis unavailable.");
      setReport(data);
      setFile(null);
      if (input.current) input.current.value = "";
      window.scrollTo({ top: 0, behavior: "instant" });
    } catch (e) {
      setError(
        e instanceof Error && e.name === "AbortError"
          ? "Analysis timed out. Please retry with a smaller file."
          : e instanceof Error
            ? e.message
            : "Network failure. Please retry.",
      );
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
  const filtered = platforms.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.id === platformId,
  );
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
            <div className="eyebrow">
              WORKING PROTOTYPE · PRIVACY INTELLIGENCE
            </div>
            <h1>Analyze your exposure.</h1>
            <p className="intro">
              Upload a supported file and select where you plan to share it.
            </p>
            <form onSubmit={analyze} className="analysis-form">
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
              <section>
                <h2>
                  <span>02</span> Where will you share it?
                </h2>
                <label htmlFor="platform-search" className="field-label">
                  Search platforms
                </label>
                <input
                  id="platform-search"
                  placeholder="Search by name…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  disabled={busy}
                />
                <label htmlFor="platform" className="field-label">
                  Selected platform
                </label>
                <select
                  id="platform"
                  value={platformId}
                  disabled={busy}
                  onChange={(e) => setPlatformId(e.target.value)}
                >
                  <option value="">Choose a platform</option>
                  {filtered.map((p) => (
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
              <div className="privacy-note">
                <strong>How your file is handled</strong>
                <p>
                  Processed on this server in memory. No permanent file storage,
                  raw-content logs or external AI uploads. Images use local
                  English OCR when available. Results stay in this page until
                  cleared or reloaded.
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
                  Reading the file, extracting signals, retrieving cached policy
                  evidence and calculating the report. Image OCR may take a few
                  seconds.
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
