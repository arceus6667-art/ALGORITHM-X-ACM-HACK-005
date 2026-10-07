# AgentTrap enterprise setup and activation

## Real email verification (operator setup required)

This release uses real Supabase email magic link, not a shared or generated demo credential. No custom SMTP credentials were supplied for this project. The application cannot configure email delivery without them. Supabase's default mail service is restricted and is not suitable for company-user onboarding.

1. In the existing Supabase project, open Authentication → Email / SMTP settings and configure your own SMTP host, port, sender address, username and password. Enter these secrets in Supabase, never in the repository or CRM frontend.
2. Verify the sender/domain with your mail provider. Follow its SPF/DKIM setup instructions. Set appropriate provider and Supabase rate limits.
3. Under Authentication → Email Templates, keep standard **Confirm signup** and **Magic Link** emails with a link using `{{ .ConfirmationURL }}`. There is no numeric-code input. Test actual inbox delivery.
4. Register with your company email and full name. Keep the CRM open, then click the latest email link on the same laptop. Add the desktop callback URL described below to Supabase's redirect allowlist.
5. Complete Company accounts → Create workspace with your company name. A business-domain email is required. Mailbox verification does not independently prove ownership of the company/domain. Company owner can verify domain control using the DNS TXT instructions and Verify DNS domain control button in Company accounts. The authenticated verification function queries public DNS and only marks the exact owner’s company verified when the TXT value matches. This proves DNS control, not legal incorporation.

Official references: https://supabase.com/docs/guides/auth/auth-smtp and https://supabase.com/docs/guides/auth/auth-email-passwordless

## Members and consent

Owner/admin creates an invitation for an exact email at the company's domain. Owner can invite admins; admins can invite members. Share the one-time code securely (the app does not send invitations automatically). Each recipient registers/verifies their own email and accepts the code. Membership does not itself grant browser monitoring permission.

Each Full device must install the latest companion extension, pair locally, approve individual websites and explicitly enable monitoring. Optional redacted previews require a separate consent checkbox. Administrators see consented activity from their own company's reporting members, up to 500 latest observations in the dashboard. Members see only their own activity. Admin actions are retained separately. Export evidence before long-term retention/archive decisions; an automatic retention/delete policy is not configured.

An owner/admin can revoke a member. Subsequent cloud actions and protected submission checks are denied. Local accounts have separate metadata files keyed by verified user ID. Document bytes are not uploaded. Shared company logs include actor/device/time, provider, fingerprint, risk/action and consent metadata, plus selected-file name and optional redacted preview. Previews are limited to 160 characters and credential/email patterns are masked; masking is heuristic, so use synthetic or approved data.

## Evaluation and the ₹90,000 paid license

New companies receive a seven-day hackathon evaluation, clearly labelled evaluation. Downloading Full does not prove payment. License records are server-controlled; authenticated clients cannot insert/update them. Trial counts are also enforced per verified account in the database (5 analyses, 3 integrity checks), so reinstalling does not reset those account limits. An active evaluation or verified paid license is required for Full actions, pairing and reporting.

No payment provider, merchant account or webhook credentials were supplied. There is no online checkout or automatic financial verification. The operator must verify the payment using their merchant/bank records. After verification, an authorized database operator may activate the specific company in Supabase SQL Editor with a query of this form, substituting reviewed values:

```sql
update public.agenttrap_licenses
set plan = 'paid', status = 'active', expires_at = null,
    amount_paise = 9000000,
    payment_reference = '<actual verified merchant reference>',
    verified_at = now()
where company_id = '<reviewed company UUID>'::uuid;
```

Do not execute this with placeholders, a guessed transaction reference, or an unverified payment. The DNS verification button marks domain control only after the authenticated owner’s TXT proof is observed. An operator may separately review legal company identity and record evidence; DNS control alone does not verify incorporation. No company has been marked paid or domain-verified by this implementation.

## Risk hold and monitoring boundaries

A company administrator controls the risk threshold (25–100) and enables the pre-send hold. The companion synchronously intercepts selected prompt submit controls and file-input change handlers on approved pages, asks the signed-in local CRM to evaluate configured rules and waits for the decision. Credential patterns score 95, manipulation patterns 90, matching Confidential/Restricted registered local assets 95, email patterns 45, otherwise 10. These are deterministic indicators, not calibrated breach probabilities.

When enabled, a score at/above threshold is held before forwarding that intercepted UI event. Unknown/oversized files or a checker/cloud-record failure are held. Local pending records retry cloud sync while the authenticated CRM remains open. Sites can change controls and browser code can bypass generic selectors; each provider needs live regression testing. This is not a system-wide firewall, traffic gateway, mobile/app observer or proof of provider-side retention. Permissions cannot expose private provider internals. No historical chats are imported.

Notifications are generic. Device notifications and configured ntfy phone delivery run while the reporting local CRM is running. Tokens remain in memory. Company admin aggregation does not imply unattended cloud push or SMS; a production backend delivery service and credentials are additional work.

## Sessions and production readiness

Access/refresh tokens are held only in the local service's memory, never in browser JavaScript responses, local database files, exports or installers. Restart requires sign-in again. Authentication and licensed actions require internet access. Server endpoints verify Supabase sessions and database membership; company roles are not derived from user-editable auth metadata. Public tables use RLS and write operations use guarded tenant RPCs. This does not make unsigned client binaries tamper-resistant or independently attest browser observations. Native signing/notarization, real mail and provider-page testing, production billing, SSO, device attestation, a managed enforcement gateway, central alert delivery, retention controls and security review remain necessary for commercial enterprise use.

## Magic-link sign-in (desktop v0.3.0+)

No numeric code is entered. Keep the desktop CRM open, request a link, and open the latest email link on the same laptop. The desktop stores a PKCE verifier and single-use callback state in memory. Restarting invalidates pending requests.

In Supabase Authentication → URL Configuration, retain the website sign-in redirect and add `http://127.0.0.1:43127/auth/callback**` for the default desktop listener (the trailing wildcard allows its random state query). Do not substitute the website URL into SMTP Host. Custom SMTP still needs valid provider credentials.

Restore **both Confirm signup and Magic Link** email templates to standard links using `<a href="{{ .ConfirmationURL }}">Sign in to AgentTrap</a>`. Website Google sign-in remains available; email authentication uses links only. Never disable email confirmation to bypass verification.
