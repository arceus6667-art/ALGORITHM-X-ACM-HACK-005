# AgentTrap AI — administrator and employee operating guide

Version 0.3.2. This guide covers the web console, downloadable desktop CRM, browser companion, company administration and isolated exposure simulations.

## 1. Choose the right workspace

1. Open the product website and select Try demo for a five-minute guest session. Signing in enables the thirty-minute web demo; this does not install the desktop application.
2. Use Downloads for the native desktop installer. Choose the correct operating system, processor architecture and edition. On Windows choose the .exe installer; do not try to load an installer as a browser extension.
3. The Desktop Trial supports five analysis/registration operations and three integrity comparisons, with fixed policies. Browser pairing and phone alerts require Full.
4. Full requires a verified company account and an active company evaluation or operator-verified license. A newly created company receives a seven-day evaluation. The proposed ₹90,000 commercial offering is not an automated checkout.
5. The web simulation and desktop simulation are exercises. They do not grant a license or extend trial duration.

## 2. Install and open the desktop CRM

1. Download the relevant installer from the project's Downloads page. Check that the filename and version are the intended edition.
2. Run the installer, choose its installation directory when prompted and open AgentTrap CRM from the installed shortcut.
3. Builds are unsigned hackathon evaluation packages. Trusted code signing and notarization are not configured; confirm provenance before installing and use your organization's installation procedure.
4. Keep the CRM running on the same laptop as the browser companion. The local companion service listens on loopback; it is not a remote agent installed on every employee's laptop.
5. Updating the website or extension does not update an already-installed CRM. Install the new desktop version to obtain its new screens.

## 3. Register and sign in using a real email

1. At Register or sign in, select Register, enter your full name and company email, then select Send magic link.
2. Open the email on the same laptop while the CRM remains open. Select its sign-in link; there is no numeric OTP to enter.
3. Return to the CRM after the browser confirms success. The application completes sign-in when the callback reaches its local service.
4. If delivery fails, check spam, the sender configuration and the allowed callback URLs. Do not repeatedly request links; the UI applies a resend cooldown.
5. Desktop sessions remain in memory. Sign in again after restarting. Never paste a mailbox password or an AI account password into the browser companion.

## 4. Create or join your company

1. Open Company accounts. Complete your identity profile if requested.
2. To create a workspace, enter the company name. The verified business email domain identifies the company domain. Existing company domains require an invitation.
3. To join, ask your administrator for the invitation code, verify the exact invited email and select Accept invitation.
4. The owner can verify company-domain control by adding the displayed DNS TXT record and selecting Verify DNS domain control. Copy the exact name and value from the CRM; mailbox verification alone does not prove domain ownership.
5. Read the evaluation or license expiry and your assigned role before enabling Full features.

## 5. Add employees and assign company access

1. An owner or administrator opens Company accounts and selects Add company accounts.
2. Enter the employee's exact company email and choose Member. Owners can also grant Admin where the existing permissions allow it.
3. Select Create invitation. Share the displayed one-time code securely; this version does not send invitation emails automatically.
4. The employee signs in with that email and accepts the invitation on their own device.
5. Each employee installs the companion, approves the required websites and enables monitoring consent separately. Adding a member does not silently enable monitoring.
6. Members see the records permitted by their role. Owners/admins can see the permitted company-wide member and observation view. Revoke access using the existing member control; an owner cannot be removed with that control.

## 6. Install the browser companion

1. Download AgentTrap-browser-companion.zip from Downloads and extract it.
2. In Chrome enter chrome://extensions; in Edge enter edge://extensions.
3. Enable Developer mode and select Load unpacked. Choose the extracted folder containing manifest.json, popup.html, background.js and content.js.
4. Confirm AgentTrap Browser Companion appears and is enabled. Pin it through the puzzle-piece Extensions menu for easy access.
5. Open its toolbar popup. An ordinary web tab does not install an extension, and opening popup.html from disk does not give it extension APIs.
6. To update, replace the extracted files with the new package and press Reload on its extension card. Version 0.2.0 adds visible pairing and enabling success feedback.

## 7. Pair the companion with the Full CRM

1. Sign in to the running Full CRM and confirm your company evaluation/license is active.
2. Open AI pairing & alerts and select Create pairing code. Codes last five minutes and permit a limited number of attempts.
3. Open the companion, paste the code into CRM pairing code and select Pair with Full CRM.
4. A green SUCCESS message and CRM paired successfully indicator confirm that the local pairing request succeeded.
5. Select only the websites you intend to monitor: ChatGPT, Claude, Gemini or Microsoft Copilot. Use Internal AI HTTPS origin only for a specific internal domain you are authorized to observe.
6. Tick the companion's monitoring consent, select Grant access & enable and approve the browser permission dialog.
7. A second SUCCESS message confirms extension website access. This is separate from CRM monitoring consent.
8. Back in the CRM, tick monitoring consent and select Enable monitoring. The optional redacted-preview consent is separate.
9. Reload your approved AI page. Keep the CRM open. Restarting, signing out or changing company can invalidate pairing; generate a fresh code and pair again.

## 8. Verify live observations safely

1. Open an approved AI website and submit harmless synthetic text. Avoid using real confidential information while testing.
2. Open Browser activity in the CRM and select Refresh activity. Look for the provider, event kind, time, fingerprint and risk/decision fields.
3. Select a harmless file smaller than 10 MB to test file-selection metadata and exact-byte fingerprint capture.
4. Network observations record destination metadata for observed requests, not their bodies. A file-selected or submit-intent record does not prove successful upload or provider-side use.
5. Real page layouts can change. If an expected event is missing, reload the provider page, check permissions and monitoring, and investigate the current page selectors.
6. Your confirmed live logs demonstrate capture on your tested laptop. Test blocking separately; seeing a log alone does not prove prevention.

## 9. Register an original file in TraceSeal

1. Open TraceSeal provenance and choose original file registration.
2. Select a harmless original file within the size limit. Supply its name, classification, source and version metadata.
3. Register the original. The file bytes are hashed locally with SHA-256; its metadata is retained in the workspace.
4. Select the registered asset and compare an identical copy. Expect Exact Match.
5. Compare a modified copy. Expect Modified because byte-identical matching is required.
6. Cropping, resizing, recompression and format conversion change a file hash. SHA-256 does not prove ownership or find visually similar images across the internet.

## 10. Analyze data and inspect the decision

1. Open Document analysis. Select a supported text file or paste a readable extract and supply classification, AI platform, purpose, role and provenance.
2. Select Analyze & evaluate. Inspect detected patterns, risk, confidence, provenance and the final deterministic policy outcome.
3. Credential patterns trigger credential protection. Other rules compare explicit classification, purpose, destination and role conditions.
4. Risk uses normalized sensitivity, destination, action, policy and provenance factors. Confidence is a prototype evidence estimate, not a calibrated breach probability.
5. ALLOW permits the evaluated use; MONITOR retains evidence; APPROVAL REQUIRED asks for review; BLOCK records a restrictive decision.
6. A console decision is analysis output. It does not by itself stop every application or connect to the provider's internal infrastructure.

## 11. Configure actual company browser protection

1. An authorized administrator opens Company accounts → Risk threshold & browser protection.
2. Choose a company threshold between 25 and 100 and enable the control to hold observed submissions at that boundary.
3. Save the company boundary. This setting is separate from the analytical console's Workspace settings and the simulator's exercise threshold.
4. Test with a synthetic credential-shaped string on an approved page. Verify both the visible hold and its audit event before relying on that page's control.
5. Protection applies to supported intercepted prompt/file submission controls while monitoring is enabled. When the checker is unavailable, protected intercepted actions are held.
6. This is not a system-wide kill switch. Background requests, unobserved controls, other apps/devices and provider-internal onward transfers are outside its enforcement scope.
7. Stopping a future action does not recall data already sent. Escalate confirmed incidents through company procedures and provider support where appropriate.

## 12. Run the admin exposure simulation

1. Open Exposure simulation. The page is explicitly labelled SIMULATION — NO LIVE ACTIONS.
2. Choose a sandbox employee, scenario, AI system and exercise threshold. The prefilled employees are fictional; adding a sandbox employee creates no real account.
3. Leave Simulate automatic protection enabled to model a hold, or disable it to compare monitoring-only behavior. Neither option changes your real company policy.
4. Select Run animated exercise for the six-stage sequence, or Start step by step followed by Next step. Pause animation stops automatic advancement. Reset timeline discards only the active timeline.
5. Follow Employee action → TraceSeal evidence → observation → policy decision → containment → alert and evidence. Every fingerprint and transfer in this sequence is synthetic.
6. Review the employee overview for exercise count, highest modeled risk and latest result. These are sandbox statistics, not employee production risk scores.
7. Acknowledge an alert in the Simulation incident ledger. For review-required exercises, approve or reject the exercise; no real pending request is released.
8. Export exercise evidence to obtain JSON labelled simulated and dryRun. Clear exercises removes sandbox incidents only. Live audit chains and company records remain unchanged.
9. Simulation state is local to this browser tab. Export important exercises before closing it. It is not a company-wide training database.

## 13. Understand the six simulation scenarios

1. Confidential external training evaluates the current console restriction and models a pre-send hold.
2. Credential prompt evaluates credential protection using a synthetic test string; it is not a valid secret.
3. Hypothetical onward transfer supplies a fictional provider-to-unapproved-destination event. A real gateway or provider audit source would be needed to know this actually happened.
4. Modified file evaluates provenance assurance and models administrator review.
5. Public internal use demonstrates an allowed request under the configured rules.
6. Unavailable checker demonstrates a hold when simulated protection is enabled; the risk is unavailable rather than invented.
7. The hypothetical connector isolation and desktop/phone alerts are modeled UI responses. This simulation sends no requests to AI providers or ntfy and stops no real software.

## 14. View employees alongside the simulation

1. Use the sandbox employee table to rehearse different employee roles and departments without changing production access.
2. Select Load my company members to obtain the roster visible to your existing authenticated company permissions.
3. That roster is a read-only reference. It is not imported into the sandbox, and simulator role selections do not grant real permissions.
4. Open Actual company members to manage invitations, inspect consented live observations and review administrative changes.
5. Employees report observations only from paired consenting devices while their CRM is open. Unpaired employees do not acquire fictional live activity.

## 15. Configure and verify phone alerts

1. Use an authenticated ntfy account with a private access-controlled topic. Subscribe to that topic in ntfy on your phone.
2. In AI pairing & alerts, enter the HTTPS server, private topic and access token, then select Connect phone alerts.
3. Select Send test notification. Service acceptance is not proof of phone receipt: check the actual phone and its notification permissions.
4. Keep the CRM running. Alert credentials stay in memory and must be re-entered after restart.
5. These are push notifications, not SMS. Native desktop notifications depend on operating-system permissions and signing.
6. The simulator previews notification responses only; it never tests actual phone delivery.

## 16. Audit, evidence and administrator review

1. Use Audit trail to review analytical policy events and verify its hash chain. Export an evidence copy before changing devices or closing a guest session.
2. Browser activity has its own hash-chained local observations; export them from that page.
3. Company accounts shows permitted shared observations and administrative changes. Refresh records and export visible company evidence when needed.
4. The simulator exports to a separate file and never inserts fictional incidents into either live audit trail.
5. A hash chain can reveal altered records relative to a trusted exported copy. It is not a trusted digital signature, independent timestamp or proof of what a provider did.
6. Optional redacted previews require extra consent. Heuristic masking is limited; review sharing choices and avoid unnecessary sensitive content.

## 17. Troubleshoot pairing and missing success messages

1. If Pair with Full CRM cannot reach the service, keep the Full CRM open on this laptop, sign in, check company entitlement and create a fresh code.
2. If a code is rejected, verify it was copied exactly and is not expired. Do not use an email sign-in link or AI password as a pairing code.
3. If Grant access & enable does nothing, tick consent, select at least one website and accept Chrome/Edge's permission prompt.
4. If success is not visible, update to browser companion 0.2.0, reload it and reopen the popup. The status box is now near the top and remains visible while scrolling.
5. Saved pairing indicators do not prove the current CRM session is still valid. Pair again after restarting the CRM.
6. If observations are absent, check the same browser/profile, approved domain, extension toggle and both consent steps, then reload the AI page.
7. If the company roster fails to load, sign in and create/join the company. The server's permission checks continue to apply; the simulation does not bypass them.
8. Copy the exact visible error, the CRM/extension version and the failed step for support. Do not send your pairing token, email link, passwords or raw confidential documents.

## 18. What the system can and cannot establish

1. It can hash exact file bytes locally, evaluate explicit rules and record supported browser observations on approved pages.
2. It can show permitted employee activity and apply a company threshold to supported intercepted controls while the CRM is running.
3. It cannot see provider training pipelines, retention stores or onward transfers without a separately validated source or integration. A browser hash is not a locator for downstream data.
4. It does not import historical chats, mobile sessions, cookies or AI account passwords. Arbitrary application monitoring and folder-wide watching are not implemented.
5. Automatic extraction from arbitrary PDFs, photos and Office documents and visual-similarity tracing are not implemented.
6. Provider page behavior, actual phone delivery, trusted signing and enterprise deployment controls require their own acceptance testing. Describe simulation outcomes as rehearsals rather than confirmed security incidents.

## 19. Administrator acceptance checklist

1. Verify the installer and extension version, sign-in email delivery, company selection and entitlement.
2. Invite a second controlled test account, confirm permitted visibility and verify that unauthorized accounts cannot access the company.
3. Register an original, verify identical/modified comparisons and inspect the exported chain.
4. Pair each test device, approve one AI site, enable both consent steps and confirm a harmless event appears.
5. Enable actual company protection and verify a supported blocked submission remains unsent on that page. Test unavailable-checker behavior separately.
6. Run every simulation scenario, compare enforcement on/off, review fictional employee incidents and confirm live record counts do not change.
7. Load the actual roster reference and confirm it matches the permitted company view.
8. Verify phone receipt on the actual device, export evidence and record any provider-selector or notification limitations before wider rollout.
