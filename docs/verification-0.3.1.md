# AgentTrap CRM 0.3.1 verification

Verified on 2026-10-07 UTC in the development environment. Eight automated test suites pass (`npm test`), covering the desktop local HTTP service, rendered console controls, browser companion scripts and website trial API. Production Windows execution and real provider pages are separate checks.

## Fix
The TraceSeal page previously had no usable reference when the registry was empty. It now offers Register an original file, classification selection, duplicate detection and a saved fingerprint. Comparison remains disabled until a reference exists. Trial registration is checked through the same authorization path as document analysis. SHA-256 compares exact bytes, including images and PDFs; content extraction and visual similarity are not implemented.

Policy audit records now snapshot their payload when recorded. Editing or disabling a policy no longer mutates the policy object inside historical events and invalidates the chain.

## Passed automated checks

| Area | Verification |
| --- | --- |
| TraceSeal UI | Empty-state disabled comparison; original PNG byte registration; exact match; modified bytes; duplicate reference reuse; 10 MB limit; save and reload |
| Governance UI | All workspace views render; credential BLOCK; Restricted approval workflow; review decision; policy creation and disabling; settings save; evidence export; chain verification and tamper detection |
| Desktop Trial | Five analysis/registration operations and three comparisons; persisted usage across service restart; pairing and custom policy operations rejected |
| Account security | Magic-link request, PKCE verifier exchange, wrong state rejected, single-use callback, verified identity, protected workspace, revoked license, logout, secrets absent from saved account file |
| Magic-link UI | Additional interactive check: no OTP field, email-link request, polling unlocks authenticated gate |
| Browser content script | Prompt interception; BLOCK prevents submission; ALLOW resumes it; checker outage holds submission; secrets and emails redacted; file SHA-256 checked |
| Browser background script | Approved ChatGPT, Claude, Gemini, Copilot and internal HTTPS domains forwarded; unknown host/untrusted sender rejected; paused monitoring bypasses checks |
| Desktop bridge | Pairing code and single-use token; consent required; hostile origins rejected; confidential registered file identified; account company policy BLOCK and ALLOW; cloud observation submitted through mocked transport |
| Audit storage | Append-only workspace event enforcement; local activity digest-chain verification detects changed records; raw prompt excluded |
| Notifications | Authenticated ntfy request accepted in a mocked transport; generic notification body does not contain the file name |
| Web trials | Five-minute guest and thirty-minute signed durations; explicit terms; expiry denial; repeated start cannot reset expiry; hostile origin rejected |
| Build | Website Worker and portable desktop/extension assets produced; JS syntax and Git whitespace checks pass |

Tests use synthetic local files and mocked Supabase, provider-page controls and ntfy responses. They prove code behavior under those conditions, not delivery through real third-party systems.

## Not yet verified live / remaining limits

- Real ChatGPT and Claude page interactions in the user's Chrome/Edge require the companion installed, approved site permissions, enabled monitoring, active company license and the CRM running on the same laptop. Provider UI changes can affect capture and submission controls.
- Phone receipt requires the user's private ntfy server/topic/token and a subscribed phone. Desktop notifications also depend on Windows permission and notification behavior.
- Real company invitations, domain verification and team isolation were not exercised against production accounts in this test run. Their server logic remains enforced by the existing Supabase RPC/RLS implementation.
- Folder-tree watching, arbitrary OS application monitoring, historic chats, actual provider retention, downstream reuse tracing, automatic image/PDF/Office text extraction and image similarity are not implemented. File selection hashing only covers approved browser controls, up to 10 MB per file.
- A hash difference shows different bytes, not unauthorized access or AI training. An exact match does not prove ownership or permission.
- Code-signing, commercial checkout and automatic paid entitlement issuance are not implemented. Native builds remain unsigned hackathon evaluations.
- Native 0.3.1 packages are built by GitHub Actions after the test gate. A successful source/build test does not establish successful installation on every supported OS/architecture.

## Live acceptance checklist

1. Install the 0.3.1 Full executable. Sign in by magic link and open Company accounts.
2. Register a harmless original file in TraceSeal. Compare the same file (Exact Match) and an edited copy (Modified).
3. Install the browser companion; pair it with the CRM; approve only the required AI sites; enable explicit monitoring consent.
4. Enable company blocking at threshold 80. On each approved provider, test a public prompt (ALLOW) and a synthetic `password=FAKE_TEST_ONLY_123` prompt (BLOCK). Do not send real secrets.
5. Check Browser activity and company records for the event, fingerprint and decision. Select a registered Confidential file and verify the protected file control is held.
6. Pause monitoring and verify consent-controlled observation stops. Re-enable protection, close the CRM and confirm intercepted submission is held when its checker is unavailable.
7. Configure a private ntfy subscription, send the test push and check the phone. Verify a suspicious event produces a generic alert.
8. Export evidence, restart the CRM, sign in again and verify saved fingerprints and audit records remain available.
