# Security Notes

This public website is designed so that administrator credentials, signed human-verification logic, appointment records, and other sensitive operations remain on the server. They are not embedded in the browser bundle.

## Browser developer tools

No public website can reliably prevent visitors from opening browser developer tools, viewing network requests, or inspecting code that their browser must download to render the page. Attempting to block those features is bypassable and can harm accessibility, browser compatibility, and legitimate support workflows. The appropriate protection is to keep secrets, private data, authorization checks, and write operations on the server.

## External Vercel deployment

`vercel.json` proxies the project-managed `/manus-storage/*` paths so the existing image and media references resolve when the Vite site is deployed to Vercel. It also applies baseline browser protections including a Content Security Policy, MIME-type sniffing protection, restrictive permissions, and a safer referrer policy. Deploy the full Node/tRPC application separately if protected administration or appointment persistence is required outside Manus hosting; a static Vercel build alone cannot provide the secured server APIs.

Security reports can be sent to the address in `client/public/.well-known/security.txt`.
