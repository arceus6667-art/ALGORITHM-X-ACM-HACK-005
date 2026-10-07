# AgentTrap — working privacy exposure prototype

AgentTrap reads supported files, detects selected sensitive patterns and metadata,
retrieves reviewed official platform context, and returns a reproducible exposure
index with a contribution-by-contribution explanation.

This upgrade extends the existing React 19 / Vite 8 / TypeScript / Tailwind 4 project.
Existing branding and routes are retained. The previous filename-based simulated
risk engine has been replaced with actual backend analysis.

## Quick start

Requires Node.js **22.12+**, npm, and a supported operating system for Sharp.

```bash
npm ci
npm run dev
```

Open http://localhost:3000. No database, AI key or paid service is required.

To enable image OCR, install Tesseract and English language data:

```bash
# Ubuntu / Debian
sudo apt-get install tesseract-ocr tesseract-ocr-eng
# macOS
brew install tesseract
```

Without Tesseract, metadata and pixel analysis still run, and OCR is explicitly
marked unavailable. OCR tests require Tesseract. No private bytes are sent to an
external model or to the selected platform.

```bash
npm run build
npm start
```

The production server serves both `dist/` and `/api/*`. Vite preview or static
GitHub Pages hosting alone cannot run this backend. Deploy to a Node host with
Tesseract installed; use HTTPS and configure a reverse proxy for public access.
Production uses `tsx` to execute server TypeScript, so install dev dependencies
with `npm ci` rather than `npm ci --omit=dev` in this prototype.

## Configuration

Copy `.env.example` to `.env` if needed. Real environment files are ignored.

| Variable                 | Default     | Meaning                                            |
| ------------------------ | ----------- | -------------------------------------------------- |
| `MAX_UPLOAD_MB`          | `10`        | Upload limit; capped at 10 MB                      |
| `PORT`                   | `3000`      | Server port                                        |
| `HOST`                   | `127.0.0.1` | Bind address; set `0.0.0.0` for container hosting  |
| `POLICY_REFRESH_ENABLED` | `false`     | Reserved roadmap flag; no live scraper implemented |

No invented Jev endpoint or credential variable is required.

## Pipeline and modules

1. `/demo` posts actual file bytes and `platformId` as multipart data.
2. `FileAnalyzer` validates extension, MIME, size and basic signature.
3. A disposable child process parses bytes with a 20-second timeout and a
   256-MB JavaScript heap limit. Two simultaneous requests are admitted.
4. `PolicyRetriever` retrieves relevant reviewed facts from the cached registry.
5. `RiskEngine` sums configurable contributions; no filename affects scoring.
6. `JevDecisionProvider` returns the deterministic fallback when unconfigured or
   failing. External providers cannot become the source of risk arithmetic.
7. `AnalysisService` returns findings, score factors, source facts and limitations.

`server/services/` contains separate parsing, retrieval, scoring, provider and
report services. `shared/types.ts` defines the response contract.

No LangChain, LangGraph, embeddings or vector database are implemented. The
policy retrieval layer is deterministic field filtering, not generative RAG.
TraceSeal signatures, runtime enforcement and persistent audit events are planned.

## Formats and extraction limits

| Format                  | Implemented extraction                    | Important limit                                                                    |
| ----------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------- |
| PNG / JPG / JPEG / WEBP | Decoded pixels, EXIF, local English OCR   | 20 megapixels; OCR timeout 8 seconds                                               |
| PDF                     | Text layer; author and timestamp presence | First 30 pages; no OCR of scans                                                    |
| DOCX                    | Paragraph text                            | 32 MB expanded ZIP limit, 1000 entries; no embedded image/header/metadata analysis |
| TXT                     | UTF-8 text                                | 10 MB upload ceiling; 2 million extracted characters                               |
| Video                   | Rejected                                  | Not supported                                                                      |

Regex detects email-like and phone-like patterns, labelled names, addresses,
identity indicators, financial/health/business keywords and credential indicators.
It does not validate credentials, confirm identity or implement full NER.
Images are not classified for faces, logos, objects, institutions or badges.
A black or solid-color image has low visual richness; actual metadata can still
increase its content-derived score.

## Heuristic score

Configuration: `server/services/risk-config.ts`.

| Factor                        | Maximum |
| ----------------------------- | ------: |
| Content sensitivity           |      25 |
| Identifiability               |      15 |
| Metadata                      |      10 |
| Semantic richness             |      10 |
| Documented processor use      |      15 |
| Advertising / personalization |      10 |
| AI / model processing         |      10 |
| Retention context             |       5 |

Bands: Low 0–24, Moderate 25–49, High 50–74, Critical 75–100.

Policy factors use their maximum when a reviewed positive fact exists. This is a
coarse prototype model, not a calibrated prediction. Scope and exceptions remain
visible in each source fact. For example, Temporary Chat retention is not a claim
about all ChatGPT sessions. Unknown fields add no points; that can understate
exposure and is **not evidence of safety**.

Semantic richness combines text length, signal diversity and pixel variation.
It is not a validated measure of semantic meaning or exploitation probability.
Confidence is a separate qualitative coverage label, never a risk probability.

## Policy evidence

`platform-policies/profiles.json` is a manually reviewed, offline registry.
Each fact includes a source URL/title, review date, paraphrased evidence,
applicability scope, confidence and evidence ID. Date reviewed: 7 October 2026.
This is partial coverage rather than a complete legal or compliance assessment.

17 selectable platforms include the 16 requested platforms plus Other.
Reviewed facts are indexed for 13: Google Search, Drive, Gmail, Gemini,
ChatGPT, Claude, WhatsApp, Dropbox, LinkedIn, X, Reddit, OneDrive and Copilot.
Instagram, Facebook, TikTok and Other intentionally return unknown policy context.
Official Meta/TikTok retrieval was blocked or unavailable; no bypass was attempted.

Update the registry only after reviewing the official source and its product,
region and account scope. The demo reads cached facts without live scraping.

Evidence classes: `FILE-DERIVED`, `DOCUMENTED`, `OBSERVED`, `INFERRED`, `UNKNOWN`,
`VERIFIED`. This release does not claim integrated third-party observations or
cryptographic provenance verification. A policy's possible use does not prove
that any specific file was used that way.

## API

- `GET /api/health`: readiness and configured upload limit.
- `GET /api/platforms`: platform profiles.
- `GET /api/platforms/:id`: one profile or 404.
- `POST /api/analyze`: multipart `file` and `platformId`.

Reports contain `analysisId`, `fileSummary`, `detectedSignals`, `platform`,
`riskScore`, `riskBand`, `confidence`, `confidenceReason`, `factors`, `sources`,
`known`, `inferred`, `unknown`, `recommendations`, `decisionProvider`,
`methodologyVersion`.

400: invalid/missing fields or upload limit. 422: unsupported or unparseable file.
429: rate limit. 503: analysis capacity busy. Uploads are limited to one file,
one field and 10 requests per minute per IP. Behind a proxy, configure Express
trust-proxy for your actual deployment; the default does not trust forwarded IPs.
Rate limits are process-local, not distributed protection.

## Privacy and security

Uploads are processed in memory and not written to permanent storage. No
analysis database, result reload endpoint, raw file logs or cloud model exists.
Matched names, emails, credential strings and GPS values are omitted from reports.
The server logs only completion/failure event, duration and fallback provider.
Reports stay in React memory until cleared, navigated away from or reloaded.

Original upload buffers are cleared after request handling. Child processes exit
and release parser memory. This is best-effort data minimization, not a certified
secure-erasure guarantee. The parser process is not an OS security sandbox;
untrusted parsers still need security updates and production isolation.

Client validation is duplicated server-side. Filenames are sanitized before
parsing and never used as evidence. File signatures supplement declared MIME
checks. Private content is never rendered as HTML. API responses are no-store.
Real environment files are ignored; `.env.example` contains placeholders only.

## Validation

```bash
npm run lint
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

Service/API tests cover real TXT, DOCX, PDF and OCR extraction, uniform-color
images, GPS-rich images, repeatable scoring, MIME/signature/size/video validation,
missing policy context, private-value omission and Jev failure fallback.
Browser tests cover actual upload → select → analyze → sources → reset, mobile
navigation and validation, and 13 viewports from 320×568 to 1920×1080.
See `VALIDATION.md` for the executed results and residual limits.

## Live demonstration

1. Open `/` and click Try Demo to reach `/demo`.
2. Use the synthetic sample (actual generated TXT bytes) or upload your own file.
3. Select ChatGPT or another reviewed platform and analyze.
4. Show score contributions, methods, official source details and unknowns.
5. Select Analyze Another File and compare a uniform image with an image bearing
   actual EXIF GPS or readable English identifying text.
6. Select Other to demonstrate the file-only fallback without invented policy.

The frontend remains on `/demo` when displaying its in-memory report; refresh
clears the report. No arbitrary delays or pretend loading stages are used.
