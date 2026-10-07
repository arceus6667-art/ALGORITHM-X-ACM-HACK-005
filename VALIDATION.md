# AgentTrap validation — 7 October 2026

Base repository: `arceus6667-art/REPO-1-DEHERADUN`, commit `2908cdf`.

## Audit findings and changes

- React 19, Vite 8, TypeScript, Tailwind 4 and React Router already existed.
- No functioning analysis backend, database or Jev integration was found.
- The original demo retained filename/size/type descriptors, used sample labels
  or filename substrings to select fabricated results, and delayed results with
  a timer. That implementation was replaced with real multipart analysis.
- The existing route structure and monochrome identity were retained.
- Unsupported face, logo, biometric, provenance and sub-12-ms claims were removed
  or replaced with clear planned status. The contact form no longer pretends to
  send messages or promise a response.
- Initial npm installation failed because esbuild 0.25 conflicted with Vite 8's
  peer range. The dependency was aligned and a reproducible npm lockfile added.
  The original Bun lockfile was removed to avoid inconsistent package resolution.
- The frontend now loads smaller bundles after removing unused model/animation
  dependencies. Server-only parsers are not included in the browser bundle.

## Executed checks

| Check                                | Result              |
| ------------------------------------ | ------------------- |
| TypeScript `npm run lint`            | Passed              |
| Service/API `npm test`               | 13 passed, 0 failed |
| Browser `npm run test:e2e`           | 16 passed, 0 failed |
| Production `npm run build`           | Passed              |
| Production route and API smoke check | Passed              |
| Git whitespace/error check           | Passed              |

Browser validation covered 13 sizes: 1366×768, 1440×900, 1536×864, 1600×900,
1920×1080, 1280×720, 1024×768, 768×1024, 430×932, 390×844, 375×812,
360×800 and 320×568. Nine primary routes were checked for visible headings and
horizontal overflow. Desktop CTA and schematic visibility were checked above
1024px. Screenshots were visually reviewed for the 1366px homepage and 390px demo.

The real upload → platform → analyze → report → official source → reset flow
passed at 1366×768 and 390×844 without page JavaScript errors. Mobile navigation,
video rejection and unknown-policy fallback passed.

Actual TXT, DOCX, PDF and English OCR extraction passed. Tests showed different
scores for different bytes despite misleading filenames, low content-derived
risk for black and solid-red images, higher scores for actual EXIF GPS/device
tags, deterministic arithmetic, private-value omission, safe validation errors,
missing-evidence behavior, documented advertising exceptions and Jev fallback.

Production testing confirmed `/demo` served built assets rather than Vite source,
and the production API processed actual multipart text uploads successfully.

## Remaining limitations

- Policy coverage is partial. Instagram, Facebook, TikTok and Other have no
  reviewed facts; their platform context is explicitly unknown.
- Jev's API contract and credentials were not supplied. The adapter and failure
  fallback exist; real Jev service integration does not.
- Face, object, logo and scene recognition, full NER, scanned PDF OCR, DOCX
  embedded images/headers/metadata and video analysis are not implemented.
- Risk and detector confidence are prototype heuristics, not validated
  probabilities. Unknowns can understate scores; low scores do not prove safety.
- TraceSeal, runtime enforcement, persistent audit trails, authentication and
  distributed rate limits are planned. The parser child process is a reliability
  boundary, not an OS sandbox or production security certification.
- The live demo is offline with respect to AI and policy services, but local
  Tesseract is needed for image OCR. Tests were executed on Node 24/Linux with
  English Tesseract installed; Windows/macOS were not separately tested.

No remote deployment or GitHub push was performed. The source package contains
all application source, npm lockfile, tests and documentation; install dependencies
with `npm ci`. Uploaded private files and runtime analysis reports are excluded.
