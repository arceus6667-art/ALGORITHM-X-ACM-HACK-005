import React from "react";
import { EditorialPage } from "../components/content/EditorialPage";
export const ResearchPage: React.FC = () => (
  <EditorialPage
    {...{
      label: "RESEARCH · METHODOLOGY v1.0",
      title: "Explain the score. Preserve uncertainty.",
      intro:
        "A transparent heuristic for potential exposure, with separate analysis coverage and documented platform context.",
      sections: [
        {
          title: "Risk model",
          text: "Content sensitivity: 0–25. Identifiability: 0–15. Metadata: 0–10. Semantic richness: 0–10. Documented processor use: 0–15. Advertising / personalization: 0–10. AI / model processing: 0–10. Retention context: 0–5. Bands: Low 0–24; Moderate 25–49; High 50–74; Critical 75–100.",
        },
        {
          title: "Evidence vocabulary",
          text: "FILE-DERIVED: extracted from file bytes. DOCUMENTED: stated in official policy. OBSERVED: measured in an integrated environment. INFERRED: analytical interpretation. VERIFIED: directly or cryptographically verified. UNKNOWN: insufficient evidence. This release reports file-derived, documented, inferred and unknown evidence; it does not claim integrated observation or cryptographic verification.",
        },
        {
          title: "Semantic richness",
          text: "The score combines text length, detected signal classes and pixel variation. A uniform image normally has low content-derived risk; metadata can still add risk. Pixel complexity does not prove faces, meaningful objects or context.",
        },
        {
          title: "Risk versus confidence",
          text: "Risk is a heuristic index. Confidence is a qualitative coverage label, not a statistically calibrated percentage. Missing policy fields, OCR failures and unassessed visual content reduce confidence. A low score can coexist with low confidence.",
        },
        {
          title: "Policy applicability",
          text: "Policy statements describe potential processing. Account tier, settings, region, recipients and service-specific exceptions matter. A retention statement for Temporary Chat does not apply to every ChatGPT session. No selected platform receives the uploaded file.",
        },
        {
          title: "Validation roadmap",
          text: "Evaluate labelled documents and images, false-positive rates, OCR coverage, regional policy applicability and sensitivity to weights. Add full entity recognition and validated visual classifiers before claiming broad identity detection. User studies and independent evaluation are not complete.",
        },
      ],
    }}
  />
);
