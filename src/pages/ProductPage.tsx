import React from "react";
import { EditorialPage } from "../components/content/EditorialPage";
export const ProductPage: React.FC = () => (
  <EditorialPage
    {...{
      label: "PRODUCT · IMPLEMENTED / PLANNED",
      title: "Privacy intelligence, with evidence.",
      intro:
        "A working file exposure prototype with a clearly separated enterprise roadmap.",
      sections: [
        {
          title: "Exposure intelligence · Implemented",
          text: "Upload PNG, JPG, WEBP, PDF, TXT or DOCX. The backend extracts supported signals, retrieves reviewed platform context and calculates an explainable heuristic score.",
        },
        {
          title: "TraceSeal · Planned",
          text: "Cryptographic provenance and signed audit events are future capabilities. This release does not establish chain of custody, embed watermarks or trace files inside other companies.",
        },
        {
          title: "Runtime governance · Planned",
          text: "Allow, Redact, Review and Block controls require an integrated runtime or proxy. This consumer demo assesses a file; it does not intercept network traffic or enforce third-party behavior.",
        },
        {
          title: "Evidence over speculation",
          text: "File-derived patterns, documented policy facts, inferred risk and unknown behavior are shown separately. Unknown policy fields contribute zero points and reduce confidence.",
        },
      ],
    }}
  />
);
