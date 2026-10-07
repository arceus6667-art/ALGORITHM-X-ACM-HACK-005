# Vercel website deployment

Vercel serves the repository's website assets from `web/` after `npm ci` and `npm run build`. The build also prepares downloadable companion/portable packages.

The stateful console, magic-link sign-in and enterprise portal redirect to the existing hosted application. This preserves its Supabase redirect configuration and Cloudflare D1 trial state without moving user records or resetting trial durations. The release-list endpoint is rewritten to the existing application so native downloads keep tracking GitHub release assets.

This is a Vercel-hosted frontend with the existing authenticated application/backend. It is not a migration of the D1 database or authentication service to Vercel. Keep the existing application available. A full backend migration would require a durable trial-store adapter, server routes and additional verified auth redirect URLs.

The initial deployment is uploaded directly from a built repository snapshot because the selected Vercel team does not yet have GitHub integration access to this repository. For automatic push deployments, connect the GitHub repository in Vercel. Existing Vercel deployment protection is retained.
