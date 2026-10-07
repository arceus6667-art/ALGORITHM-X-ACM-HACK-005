import React from "react";
import { EditorialPage } from "../components/content/EditorialPage";
export const TechnologyPage: React.FC = () => (
  <EditorialPage
    {...{
      label: "TECHNOLOGY · WORKING PIPELINE",
      title: "Simple flow. Inspectable decisions.",
      intro:
        "No LLM is the sole authority for risk decisions. The demo uses local parsing and ordinary service functions.",
      sections: [
        {
          title: "01 — Validate",
          text: "The API validates size, extension, declared MIME and basic file signatures. DOCX archives have expanded-size and entry limits. Parsing runs in a child process with a timeout and bounded JavaScript heap.",
        },
        {
          title: "02 — Extract",
          text: "PDF text layers, DOCX paragraphs and UTF-8 text are parsed. Images are decoded for pixel variation, supported EXIF tags and local English OCR when Tesseract is installed. Matched private values never enter the report.",
        },
        {
          title: "03 — Retrieve policy evidence",
          text: "A cached JSON registry stores manually reviewed facts from official sources, dates and applicability scope. Relevant fields are retrieved deterministically. This release does not use embeddings, vector databases, LangChain or LangGraph.",
        },
        {
          title: "04 — Score and explain",
          text: "Eight configurable factors sum to a score from 0 to 100. Each contribution carries evidence identifiers and a reason. The score is a prototype index; it is not scientifically calibrated.",
        },
        {
          title: "05 — Optional decision provider",
          text: "The Jev adapter accepts a future verified provider. Today the deterministic fallback runs. No API endpoint, credential schema or AI-generated evidence is invented.",
        },
        {
          title: "06 — Return and clear",
          text: "The API returns only derived findings, reviewed policy context, limitations and recommendations. Original upload buffers are cleared after handling; no analysis database or result-reload endpoint is used.",
        },
      ],
    }}
  />
);
