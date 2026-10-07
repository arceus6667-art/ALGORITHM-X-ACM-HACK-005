import { fork } from "node:child_process";
import { randomUUID } from "node:crypto";
import type {
  AnalysisResult,
  FileSignals,
  PlatformProfile,
} from "../../shared/types";
import { calculateRisk } from "./RiskEngine";
import { retrievePolicyEvidence } from "./PolicyRetriever";
import { JevDecisionProvider } from "./DecisionProvider";
import { METHODOLOGY_VERSION } from "./risk-config";
export async function isolatedAnalysis(
  bytes: Buffer,
  name: string,
  mime: string,
): Promise<FileSignals> {
  return new Promise((resolve, reject) => {
    const child = fork(new URL("../worker.ts", import.meta.url), [], {
      execArgv: ["--import", "tsx", "--max-old-space-size=256"],
      serialization: "advanced",
      stdio: ["ignore", "ignore", "ignore", "ipc"],
    });
    let settled = false;
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill("SIGKILL");
      reject(
        new Error("File analysis timed out. Try a smaller or simpler file."),
      );
    }, 20000);
    const finish = () => {
      settled = true;
      clearTimeout(timer);
      child.kill();
    };
    child.once("message", (msg: any) => {
      if (settled) return;
      finish();
      msg.error ? reject(new Error(msg.error)) : resolve(msg.result);
    });
    child.once("error", () => {
      if (settled) return;
      finish();
      reject(new Error("Analysis worker unavailable."));
    });
    child.once("exit", () => {
      if (settled) return;
      finish();
      reject(new Error("Analysis worker stopped before completing the file."));
    });
    child.send({ bytes, name, mime });
  });
}
export async function buildReport(
  file: FileSignals,
  platform: PlatformProfile,
): Promise<AnalysisResult> {
  const sources = retrievePolicyEvidence(platform, file);
  const risk = calculateRisk(file, { ...platform, facts: sources });
  const decision = await new JevDecisionProvider().evaluate();
  const missing = [
    "serviceProviderSharing",
    "personalizationUse",
    "aiProcessing",
    "retentionDescription",
  ].filter((field) => !sources.some((f) => f.field === field));
  const unknown = [
    ...file.limitations,
    ...decision.limitations,
    ...missing.map(
      (f) => `${f}: not documented in the verified sources currently indexed.`,
    ),
    "Whether this exact file is used for model training, shared with another company, or retained after deletion.",
    "Actual platform settings, account tier, recipient behavior and applicable regional terms were not inspected.",
  ];
  const ids = file.extractedSignals.map((s) => s.id);
  const recommendations = [
    "Review the selected platform’s privacy controls and sharing permissions.",
    "Check findings manually before relying on this prototype.",
  ];
  if (ids.some((id) => ["gps", "device", "timestamp", "author"].includes(id)))
    recommendations.unshift("Remove unnecessary metadata before sharing.");
  if (
    ids.some((id) =>
      ["identity", "email", "phone", "name", "address"].includes(id),
    )
  )
    recommendations.unshift(
      "Redact or crop identifying information that recipients do not need.",
    );
  if (ids.includes("secret"))
    recommendations.unshift(
      "Remove credentials before sharing; rotate any credentials already exposed.",
    );
  if (ids.includes("confidential"))
    recommendations.unshift(
      "Use an approved private channel for confidential business material.",
    );
  return {
    analysisId: randomUUID(),
    fileSummary: file,
    platform,
    detectedSignals: file.extractedSignals,
    ...risk,
    confidence:
      file.mimeType.startsWith("image/") ||
      missing.length > 2 ||
      file.limitations.some((limit) => /No readable|Only the first/.test(limit))
        ? "Low"
        : "Medium",
    confidenceReason: `Confidence describes coverage, not probability. ${4 - missing.length}/4 scored policy categories have reviewed evidence. ${file.mimeType.startsWith("image/") ? "Visual identity classification is unavailable." : "Text patterns are heuristic and parsing has format-specific limits."}`,
    sources,
    known: [
      ...file.extractedSignals.map(
        (s) =>
          `${s.label} (${s.method}; ${s.count} match${s.count === 1 ? "" : "es"})`,
      ),
      ...sources.map((f) => f.evidenceText),
    ],
    inferred: [
      "Detected sensitive patterns and documented processing context may increase potential privacy exposure.",
      "The score is a configurable heuristic index, not a probability or a measurement of actual platform behavior.",
    ],
    unknown,
    recommendations,
    decisionProvider: decision.provider,
    methodologyVersion: METHODOLOGY_VERSION,
  };
}
