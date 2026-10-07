# AgentTrap authentication activation

The website is connected to project `ndtlhzrkonordpntyphe`. The database is live. No service-role key is required by the website. The application uses a publishable key, verified access tokens and account-owned row-level security.

## 1. Set the website URLs

Open https://supabase.com/dashboard/project/ndtlhzrkonordpntyphe/auth/url-configuration

- Site URL: `https://agenttrap-ai-governance.arceus6667.chatgpt.site`
- Additional redirect URL: `https://agenttrap-ai-governance.arceus6667.chatgpt.site/signin.html`

## 2. Activate Google

Open https://supabase.com/dashboard/project/ndtlhzrkonordpntyphe/auth/providers

Create a Google OAuth web application in Google Cloud, configure the consent screen, and enter its client ID and client secret into the Supabase Google provider settings. Add this authorized redirect URI in Google Cloud:

`https://ndtlhzrkonordpntyphe.supabase.co/auth/v1/callback`

Enable Google and save. Use the live site's Continue with Google button to verify the complete consent and callback flow. Configure the Google consent application for your intended audience; a test-mode application only permits configured test users.

## 3. Configure email OTP

Open https://supabase.com/dashboard/project/ndtlhzrkonordpntyphe/auth/templates

Edit the Magic Link email template to include the verification code:

```html
<h2>Your AgentTrap sign-in code</h2>
<p>Enter this code in the AgentTrap sign-in page:</p>
<p><strong>{{ .Token }}</strong></p>
<p>If you did not request this code, ignore this email.</p>
```

Supabase sends a magic link by default. Including `{{ .Token }}` enables the code-entry experience already implemented on the website. The website also supports following an email sign-in link when supplied.

Configure custom SMTP for delivery to your intended users: https://supabase.com/dashboard/project/ndtlhzrkonordpntyphe/settings/auth
Supabase's default email service has restricted recipients and delivery limits. Keep email confirmation enabled. Test a new and returning user, incorrect and expired codes, resend cooldown, and session persistence.

## Verification and boundaries

Phone sign-in has been removed from the website. Google and email use Supabase authentication. Real provider delivery and consent must be verified with the configured accounts.

The database save/load, row isolation, cross-account write rejection, revision conflict and append-only audit permissions were verified against the real Supabase database with rollback-only synthetic accounts. Browser workflows and API expiry were tested with simulated authentication. Complete real provider sign-in testing after activation.

The guest trial lasts five minutes. A verified Supabase account has one thirty-minute trial. These timers are enforced by the website's server. Refreshing or signing back in does not restart them. Saved CRM records can be restored and exported after expiry; new demo actions require an active trial.

CRM metadata persists in Supabase. Document files and pasted analysis text remain in the browser. Guest metadata is temporarily stored in this tab's session storage. Guest records are imported into a new account workspace when its signed-in trial starts; an existing saved account workspace takes precedence. The current CRM is private per account. Shared organization workspaces and organization administrator roles are future work. The analysis role selector supplies demo policy context and does not grant account permissions.
