import React from "react";
import { EditorialPage } from "../components/content/EditorialPage";
export const DocsPage: React.FC = () => (
  <EditorialPage
    {...{
      label: "DOCUMENTATION · PROTOTYPE",
      title: "Run, inspect and demonstrate.",
      intro:
        "A single Node server serves the existing Vite / React UI and the analysis API.",
      sections: [
        {
          title: "Setup",
          text: "Use Node.js 22.12+ and npm. Run npm ci, then npm run dev. Open http://localhost:3000. For production, run npm run build then npm start. Install Tesseract OCR with English language data to enable local image text extraction.",
        },
        {
          title: "Configuration",
          text: "Copy .env.example to .env if needed. MAX_UPLOAD_MB defaults to 10 and cannot exceed the safety ceiling of 10. PORT defaults to 3000; HOST defaults to 127.0.0.1. POLICY_REFRESH_ENABLED is a reserved roadmap flag, not a live scraper.",
        },
        {
          title: "API",
          text: "GET /api/platforms returns the registry. GET /api/platforms/:id returns a profile. POST /api/analyze takes multipart fields file and platformId. GET /api/health reports server readiness. Responses include signals, factors, sources, recommendations and limits.",
        },
        {
          title: "Privacy handling",
          text: "Files are uploaded to this server, processed in memory and not permanently stored. No raw-content logging, external AI upload or selected-platform upload occurs. Reports live only in browser component state. Parser processes exit after completion; memory clearing is best effort, not secure-erasure certification.",
        },
        {
          title: "Limits",
          text: "Video is unsupported. TXT must be UTF-8. PDF processing is limited to 30 pages and the text layer; scanned PDFs are not OCR processed. DOCX embedded images, headers and metadata are not assessed. Images are limited to 20 megapixels; OCR is English only and may fail.",
        },
        {
          title: "Policy coverage",
          text: "17 selectable platforms are listed. Reviewed facts are currently indexed for Google Search, Drive, Gmail, Gemini, ChatGPT, Claude, WhatsApp, Dropbox, LinkedIn, X, Reddit, OneDrive and Copilot. Coverage is partial. Instagram, Facebook, TikTok and Other produce file-only assessments with unknown platform context.",
        },
        {
          title: "Demo steps",
          text: "Open Try Demo, upload a supported file or use the synthetic text sample, select a platform and analyze. Read the score breakdown, expand official sources and inspect unknowns. Choose Analyze Another File to clear the result.",
        },
        {
          title: "Tests",
          text: "npm test runs service and API integration tests. npm run test:e2e runs browser flows and responsive checks; install Chromium with npx playwright install chromium first. No database, API key or paid AI service is required.",
        },
      ],
    }}
  />
);
