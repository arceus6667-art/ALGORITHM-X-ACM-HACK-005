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

## 3. Configure email magic links

Configure valid custom SMTP credentials in Supabase. Keep email confirmation enabled. Use standard Confirm signup and Magic Link templates:

```html
<h2>Sign in to AgentTrap AI</h2>
<p><a href="{{ .ConfirmationURL }}">Continue to AgentTrap</a></p>
<p>If you did not request this email, ignore it.</p>
```

Add these redirect entries in Authentication → URL Configuration:
- `https://agenttrap-ai-governance.arceus6667.chatgpt.site/signin.html`
- `http://127.0.0.1:43127/auth/callback**`

For web login, open the email link in the browser where sign-in started. For desktop v0.3.0+, keep the CRM open and open the link on the same laptop. No OTP field is provided. PKCE keys are held in the initiating client; restarting invalidates pending desktop links. Test actual delivery and expired/reused links. Valid SMTP is still required: changing from codes to links does not fix invalid mail credentials.
