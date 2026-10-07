# AgentTrap — Sites edition

This edition preserves the AgentTrap pages and evidence-backed assessment flow.
Supported files are parsed in browser memory, never uploaded. English OCR runs
on-device using self-hosted Tesseract assets. Original Node backend source is
retained for the downloadable/server variant, but is not used by this deployment.

Run `npm ci` and `npm run build` to build `dist/`. Sites serves the static build.

Face, logo, object classifiers, full NER, Jev service integration, and unreviewed
platform facts remain explicitly unavailable. See the Research page for scoring
and limitations.
