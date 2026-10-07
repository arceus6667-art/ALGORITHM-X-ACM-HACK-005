import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Monitor, Lock, FileSearch, Shield } from "lucide-react";

export const IndividualsPage: React.FC = () => {
  return (
    <div className="w-full overflow-x-hidden">
      {/* Hero */}
      <section className="py-14 sm:py-20 border-b border-[#E8E8E6] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-5">
          <div className="font-mono text-[11px] text-[#8A8A8A] uppercase tracking-wider">
            For Individuals · Personal Privacy Intelligence
          </div>
          <h1
            className="font-[550] tracking-[-0.03em] text-[#111111] leading-[1.06]"
            style={{ fontSize: "clamp(30px, 4vw, 46px)" }}
          >
            Understand what your data reveals before you share it.
          </h1>
          <p className="text-[16px] text-[#606060] leading-relaxed max-w-2xl">
            When you upload a photo or document to a web service, you often
            share far more than the visible subject — EXIF GPS coordinates,
            author identity, revision history, and sensitive text patterns.
            AgentTrap makes these signals visible <em>before</em> you hit send.
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            <Link
              to="/demo"
              className="px-5 py-2.5 text-sm font-medium text-white bg-[#111111] rounded hover:bg-[#222222] transition-colors inline-flex items-center gap-2 min-h-[44px]"
            >
              Try the Web Demo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Two tiers: web vs app */}
      <section className="py-12 sm:py-16 border-b border-[#E8E8E6] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="font-mono text-[11px] text-[#8A8A8A] uppercase tracking-wider mb-6">
            Two Ways to Use AgentTrap
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Web Demo */}
            <div className="p-6 border border-[#E8E8E6] rounded-md bg-[#FAFAFA] space-y-3">
              <div className="flex items-center gap-3">
                <FileSearch className="w-5 h-5 text-[#111111]" />
                <div>
                  <div className="font-mono text-[10px] text-[#8A8A8A] uppercase">Web App · Implemented</div>
                  <h3 className="text-base font-[550] text-[#111111]">Hosted Demo</h3>
                </div>
              </div>
              <ul className="space-y-1.5 text-sm text-[#606060]">
                <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#111111] mt-1.5 flex-shrink-0" /><span>No installation required — runs in your browser</span></li>
                <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#111111] mt-1.5 flex-shrink-0" /><span>Upload a file and see an exposure assessment instantly</span></li>
                <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#111111] mt-1.5 flex-shrink-0" /><span>File processed in server memory — not permanently stored</span></li>
                <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#111111] mt-1.5 flex-shrink-0" /><span>No external AI upload — local OCR only when available</span></li>
              </ul>
              <p className="text-[11px] text-[#8A8A8A] font-mono leading-relaxed">
                Note: this demo sends your file to the AgentTrap server for
                processing. Results are not stored. Sensitive content is never
                re-transmitted to the selected platform.
              </p>
            </div>

            {/* Individual App */}
            <div className="p-6 border border-[#E8E8E6] rounded-md bg-[#FAFAFA] space-y-3">
              <div className="flex items-center gap-3">
                <Monitor className="w-5 h-5 text-[#111111]" />
                <div>
                  <div className="font-mono text-[10px] text-[#8A8A8A] uppercase">Individual App · Planned</div>
                  <h3 className="text-base font-[550] text-[#111111]">Local-First App</h3>
                </div>
              </div>
              <ul className="space-y-1.5 text-sm text-[#606060]">
                <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#111111] mt-1.5 flex-shrink-0" /><span>Runs entirely on your device — analysis stays local</span></li>
                <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#111111] mt-1.5 flex-shrink-0" /><span>Visibility into your AI app activity and data flows</span></li>
                <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#111111] mt-1.5 flex-shrink-0" /><span>User-level risk factors flagged before you share</span></li>
                <li className="flex gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#111111] mt-1.5 flex-shrink-0" /><span>No cloud dependency for core file analysis</span></li>
              </ul>
              <p className="text-[11px] text-[#8A8A8A] font-mono">
                Status: Planned. Architecture designed for local-first
                operation. Not yet released.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What we detect */}
      <section className="py-12 sm:py-16 border-b border-[#E8E8E6] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          <div>
            <div className="font-mono text-[11px] text-[#8A8A8A] uppercase tracking-wider mb-4">
              What AgentTrap Detects Today
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              {
                title: "File Content Signals",
                items: [
                  "Email-like and phone-like patterns",
                  "Named identities and labelled addresses",
                  "Financial, health and business keywords",
                  "Credential indicators (API keys, tokens)",
                  "Identity indicators in text",
                ],
              },
              {
                title: "Metadata",
                items: [
                  "EXIF GPS coordinates and timestamps",
                  "Camera model and serial metadata",
                  "Document author and creation date",
                  "Revision history indicators",
                  "Image pixel variation and richness",
                ],
              },
              {
                title: "Platform Context",
                items: [
                  "Reviewed policy facts for 13 platforms",
                  "Documented data retention practices",
                  "AI / model training use disclosure",
                  "Advertising and personalization use",
                  "Service provider data sharing",
                ],
              },
              {
                title: "What We Cannot See",
                items: [
                  "Faces, logos, or objects in images",
                  "What happens inside third-party servers",
                  "Whether a file was used for AI training",
                  "Full NER — pattern detection only",
                  "Scanned PDF text (no OCR of scans)",
                ],
              },
            ].map((group) => (
              <div key={group.title} className="space-y-2">
                <h3 className="text-sm font-semibold text-[#111111]">{group.title}</h3>
                <ul className="space-y-1.5">
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-[#606060]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#CCCCCC] mt-1.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Purpose-based */}
      <section className="py-12 sm:py-16 border-b border-[#E8E8E6] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="font-mono text-[11px] text-[#8A8A8A] uppercase tracking-wider">
            Risk Depends on Purpose
          </div>
          <h2 className="text-xl font-[550] text-[#111111] tracking-tight">
            The same document. Different decisions.
          </h2>
          <p className="text-sm text-[#606060] leading-relaxed max-w-2xl">
            Risk and permission depend on intended purpose and policy — not just
            file content. Sharing an image to an end-to-end encrypted message
            carries very different exposure characteristics than uploading it to
            an AI training endpoint or advertising-supported social feed.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            {["Internal Analysis", "Model Training", "External Sharing", "Enterprise Processing"].map((p) => (
              <div key={p} className="p-3 border border-[#E8E8E6] rounded text-xs text-[#606060] text-center font-mono">
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Practical Tips */}
      <section className="py-12 sm:py-16 border-b border-[#E8E8E6] bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="font-mono text-[11px] text-[#8A8A8A] uppercase tracking-wider">
            Safe Sharing Suggestions
          </div>
          <ul className="space-y-2.5">
            {[
              "Strip EXIF location metadata before uploading images to public forums.",
              "Mask badges, credentials, and financial metrics in screenshots.",
              "Opt out of model training data collection where platform settings permit.",
              "Review what file metadata your documents carry before sending externally.",
              "Prefer end-to-end encrypted channels for documents with personal identifiers.",
            ].map((tip) => (
              <li key={tip} className="flex gap-3 text-sm text-[#606060]">
                <Shield className="w-4 h-4 text-[#111111] flex-shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-semibold text-[#111111]">
              Test your files in the sandbox.
            </h3>
            <p className="text-xs text-[#8A8A8A] mt-1">
              No login required. Server-side parsing without external AI upload.
            </p>
          </div>
          <Link
            to="/demo"
            className="px-5 py-2.5 bg-[#111111] text-white rounded text-xs font-medium hover:bg-[#222222] transition-colors inline-flex items-center gap-1.5 min-h-[44px] whitespace-nowrap"
          >
            Open Demo <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
};
