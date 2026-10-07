import React from "react";
import { ArrowDown, FileText } from "lucide-react";
export const TraceVisualization: React.FC = () => (
  <div className="w-full max-w-[440px] rounded-md border border-[#E8E8E6] p-5 sm:p-6 bg-[#FAFAFA]">
    <div className="flex justify-between gap-3 border-b border-[#ddd] pb-4 text-[10px] font-mono">
      <span>EXPOSURE ANALYSIS</span>
      <span className="text-[#666]">PIPELINE SCHEMATIC</span>
    </div>
    <div className="py-4 flex items-center gap-3">
      <FileText size={20} />
      <div>
        <div className="text-sm font-medium">Your file. Your context.</div>
        <div className="text-xs text-[#666] mt-1">
          No external AI upload required
        </div>
      </div>
    </div>
    {[
      "FILE · validated bytes",
      "SIGNALS · parsing & local OCR",
      "PLATFORM POLICY · reviewed evidence",
      "RISK ENGINE · deterministic weights",
      "EXPLAINABLE RESULT · reasons & limits",
    ].map((label, i) => (
      <React.Fragment key={label}>
        {i > 0 && <ArrowDown size={14} className="mx-auto my-2 text-[#999]" />}
        <div className="border border-[#ddd] bg-white px-4 py-3 font-mono text-[11px]">
          {label}
        </div>
      </React.Fragment>
    ))}
    <div className="border-t border-[#ddd] mt-4 pt-3 text-[11px] text-[#666]">
      Source-backed where reviewed · Unknowns stay visible
    </div>
  </div>
);
