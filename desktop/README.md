# AgentTrap CRM — Hackathon evaluation

Two downloadable editions: Desktop Trial (5 analyses, 3 integrity checks, 2 fixed policies; no pairing or alerts) and Full Hackathon (all implemented CRM functions, browser pairing and notification settings). Full is an evaluation build, not a paid commercial license. No payment is collected.

## Windows installer

Download the .exe for your edition and processor (x64 or ARM64). Double-click it, choose your installation folder, then launch AgentTrap CRM from the desktop or Start menu. No Node.js installation or ZIP extraction is needed. Installers run per-user without administrator access and preserve local CRM records during uninstall. Trial and Full have separate installation identities and shortcuts. Close one before launching the other. Installers are unsigned hackathon evaluation builds.

## Portable launch

Install Node.js 24 or newer. Extract the ZIP. Windows 10/11 x64 or ARM64: double-click Start-Windows.cmd. macOS Intel/Apple Silicon: open Terminal here and run `sh Start-macOS.sh`. Linux x64/ARM64: run `sh Start-Linux.sh`. The locally installed CRM opens in your normal browser. Keep the launcher running. It binds only to 127.0.0.1:43127. No administrator permission is required. Select the Node runtime matching your architecture.

Native Electron Windows .exe installers and macOS ZIP / Linux TAR packages are built by GitHub Actions separately for each OS/architecture. Only release assets that have actually completed are offered as native downloads. They are unsigned hackathon builds; OS prompts can appear. A signing certificate and macOS notarization are needed for production distribution. Native binaries are not included inside the small portable ZIP.

## Local CRM

Analysis, metadata registry, configurable policies, approval review, integrity checks, hash-chained audit and evidence export use the same console as the web demo. Records persist in a local workspace.json under your OS user-data directory (portable: ~/.agenttrap-crm/trial or full). Document bytes and prompt content are not persisted. The local profile is not a cloud login and does not sync Supabase records. Close all instances before changing editions or copying databases. Preserve/export evidence before uninstalling. Trial counters persist on this device; this hackathon build is not a tamper-resistant licensing system.

## Browser pairing (Full only)

1. Open chrome://extensions or edge://extensions, enable Developer mode, and Load unpacked → browser-companion folder.
2. In CRM → AI pairing & alerts → Create pairing code.
3. Enter the code in the extension popup. Codes last five minutes and allow five attempts.
4. Select ChatGPT, Claude, Gemini or Microsoft Copilot; optionally add an explicit internal HTTPS domain. Approve browser site permissions and consent.
5. Read and accept CRM monitoring consent, then Enable monitoring.
6. Open/reload your approved AI site and use it normally. Review Browser activity in CRM.

Only approved browser pages are observed, while the CRM is running. Prompt submission intent and pasted-text events store only SHA-256, character count and limited risk signals. File selection stores name, size and an exact-byte hash (up to 10 MB). Network events store destination metadata, not request bodies. These observations are not proof of successful upload or provider-side use. Generic page selectors may require provider-specific updates. No cookies, passwords, chat history, other applications or mobile sessions are imported. A private/incognito browser is not monitored unless the user separately permits extension access. Pause revokes site access. Unpair revokes the local extension token. Restarting the CRM requires pairing again.

Hash matching identifies byte-identical assets only. Resized, recompressed or otherwise transformed photos require a separately validated watermark/perceptual technique. Hashes do not reveal where a provider sends data internally. Audit chaining detects changed records relative to an exported trusted copy; it is not a signed independent attestation.

## Alerts

Credential patterns, prompt manipulation signals, or a selected file matching a Confidential/Restricted registered asset trigger a local dashboard alert and native notification where the OS supports it. macOS native notifications require app signing. Phone alerts use an authenticated ntfy server/topic: install ntfy on your phone, configure a private topic with suitable access control, then enter its server, topic and access token in CRM and Send test notification. Provider acceptance does not prove phone receipt. Tokens remain in memory and require reconnecting after restart. Phone messages contain a generic alert, not raw prompts or file names. There is no SMS integration. Alerts stop when the CRM is closed.
