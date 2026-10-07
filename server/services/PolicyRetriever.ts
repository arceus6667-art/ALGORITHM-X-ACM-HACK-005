import profiles from "../../platform-policies/profiles.json";
import type { PlatformProfile, FileSignals } from "../../shared/types";
export const platforms: PlatformProfile[] = profiles as PlatformProfile[];
// Deterministic retrieval over reviewed policy facts. No vector embeddings or generative RAG claims.
export function retrievePolicyEvidence(
  platform: PlatformProfile,
  file: FileSignals,
) {
  const fields = new Set([
    "serviceProviderSharing",
    "personalizationUse",
    "advertisingUse",
    "aiProcessing",
    "retentionDescription",
    "userControls",
    "encryption",
  ]);
  if (file.fileSize) fields.add("collectsContent");
  return platform.facts.filter((f) => fields.has(f.field));
}
