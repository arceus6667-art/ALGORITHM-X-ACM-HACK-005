export type EvidenceType =
  | "FILE-DERIVED"
  | "DOCUMENTED"
  | "OBSERVED"
  | "INFERRED"
  | "UNKNOWN"
  | "VERIFIED";
export interface Signal {
  id: string;
  label: string;
  count: number;
  confidence: number;
  method: string;
  evidenceType: EvidenceType;
}
export interface FileSignals {
  fileType: string;
  mimeType: string;
  fileSize: number;
  metadata: string[];
  extractedSignals: Signal[];
  semanticRichnessScore: number;
  coverage: string[];
  limitations: string[];
  blank: boolean;
}
export interface PolicyFact {
  id: string;
  field: string;
  value: boolean | string;
  confidence: number;
  sourceUrl: string;
  sourceTitle: string;
  retrievedAt: string;
  evidenceText: string;
  evidenceType: "DOCUMENTED";
  scope: string;
}
export interface PlatformProfile {
  id: string;
  name: string;
  category: string;
  facts: PolicyFact[];
  officialSources: string[];
  lastVerifiedAt: string | null;
}
export interface Factor {
  key: string;
  label: string;
  points: number;
  maximum: number;
  evidenceType: EvidenceType;
  evidenceIds: string[];
  reason: string;
}
export interface AnalysisResult {
  analysisId: string;
  fileSummary: FileSignals;
  platform: PlatformProfile;
  detectedSignals: Signal[];
  riskScore: number;
  riskBand: string;
  confidence: "Low" | "Medium" | "High";
  confidenceReason: string;
  factors: Factor[];
  sources: PolicyFact[];
  known: string[];
  inferred: string[];
  unknown: string[];
  recommendations: string[];
  decisionProvider: string;
  methodologyVersion: string;
}
