import type { FileSignals, PlatformProfile, Factor } from "../../shared/types";
import { RISK_WEIGHTS as w } from "./risk-config";
export function calculateRisk(file: FileSignals, platform: PlatformProfile) {
  const has = (id: string) => file.extractedSignals.some((s) => s.id === id);
  const signalIds = file.extractedSignals.map((s) => s.id);
  const policy = (field: string) =>
    platform.facts.filter((f) => f.field === field);
  const factors: Factor[] = [];
  function add(
    key: keyof typeof w,
    label: string,
    points: number,
    evidenceIds: string[],
    reason: string,
    type: Factor["evidenceType"] = "FILE-DERIVED",
  ) {
    factors.push({
      key,
      label,
      points: Math.min(w[key], Math.max(0, Math.round(points))),
      maximum: w[key],
      evidenceType: type,
      evidenceIds,
      reason,
    });
  }
  add(
    "sensitivity",
    "Content sensitivity",
    (has("secret") ? 20 : 0) +
      (has("identity") ? 15 : 0) +
      (has("financial") ? 8 : 0) +
      (has("confidential") ? 8 : 0) +
      (has("health") ? 8 : 0),
    signalIds.filter((id) =>
      ["secret", "identity", "financial", "confidential", "health"].includes(
        id,
      ),
    ),
    "Pattern matches indicate potentially sensitive content; they do not establish validity or ownership.",
  );
  add(
    "identity",
    "Identifiability",
    (has("email") ? 6 : 0) +
      (has("phone") ? 5 : 0) +
      (has("name") ? 4 : 0) +
      (has("address") ? 4 : 0) +
      (has("identity") ? 8 : 0),
    signalIds.filter((id) =>
      ["email", "phone", "name", "address", "identity"].includes(id),
    ),
    "Contact and labelled identity patterns can connect content to a person.",
  );
  add(
    "metadata",
    "Metadata exposure",
    (has("gps") ? 8 : 0) +
      (has("device") ? 2 : 0) +
      (has("timestamp") ? 2 : 0) +
      (has("author") ? 3 : 0),
    signalIds.filter((id) =>
      ["gps", "device", "timestamp", "author"].includes(id),
    ),
    "Detected metadata may reveal location, device or authorship. Values are withheld from the report.",
  );
  add(
    "richness",
    "Semantic richness",
    file.semanticRichnessScore / 10,
    signalIds,
    "A prototype proxy based on extracted text, signal diversity and pixel variation; visual complexity does not establish meaning.",
    "INFERRED",
  );
  for (const [key, field, label] of [
    ["sharing", "serviceProviderSharing", "Documented processor use"],
    ["personalization", "personalizationUse", "Advertising / personalization"],
    ["ai", "aiProcessing", "AI / model processing"],
    ["retention", "retentionDescription", "Retention context"],
  ] as const) {
    const facts =
      field === "personalizationUse"
        ? [...policy(field), ...policy("advertisingUse")]
        : policy(field);
    const positive = facts.some((f) => f.value !== false);
    add(
      key,
      label,
      positive ? w[key] : 0,
      facts.map((f) => f.id),
      positive
        ? "Published policy documents this potential processing context. Applicability depends on service, settings and region; it does not prove this file was processed."
        : facts.length
          ? "The indexed policy documents an exception within its stated scope. Broader processing outside that scope remains unknown."
          : "Not documented in the indexed evidence. Zero contribution means unknown, not absence of exposure.",
      facts.length ? "DOCUMENTED" : "UNKNOWN",
    );
  }
  const riskScore = factors.reduce((n, f) => n + f.points, 0);
  return {
    riskScore,
    riskBand:
      riskScore < 25
        ? "LOW"
        : riskScore < 50
          ? "MODERATE"
          : riskScore < 75
            ? "HIGH"
            : "CRITICAL",
    factors,
  };
}
