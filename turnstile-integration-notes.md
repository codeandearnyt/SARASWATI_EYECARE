# Cloudflare Turnstile Integration Notes

Cloudflare Turnstile protects a form through two required steps: a browser widget issues a token and the application server validates that token. The public site key identifies the widget in the browser; the secret key is private and must remain only on the server. Cloudflare requires a Siteverify request to `https://challenges.cloudflare.com/turnstile/v0/siteverify` with the secret key and token; browser-only validation is not sufficient. Tokens are single-use and expire after five minutes. The appointment submission procedure should reject requests unless server-side verification succeeds, then persist the verified request for the protected admin panel.

Sources: [Cloudflare Turnstile Get Started](https://developers.cloudflare.com/turnstile/get-started/) and [Cloudflare Turnstile Server-side Validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/).

## Implementation decision

The clinic chose not to activate an external Turnstile service. The appointment workflow instead uses a lightweight, mandatory in-site signed arithmetic verification check that is validated server-side before an appointment is persisted in the protected admin panel. This is intentionally a modest abuse-deterrent rather than a substitute for a managed anti-bot service.

## Validation

The custom verification unit tests confirm correct answers are accepted only once, while incorrect and expired answers are rejected. Appointment-router tests confirm an invalid verification prevents persistence and a valid proof stores the request with `deliveryStatus: "pending"` without contacting an email endpoint. A non-persistent browser check confirmed that the Review-step submit action remains disabled until the displayed arithmetic question is answered, then becomes available.

The appointment interface now distinguishes a rejected human check from a storage or network failure. Router-level integration coverage uses the protected admin procedure to confirm that a verified, mocked appointment record is returned through the same list query that powers `/#/admin`, without creating test data in the clinic database.

A dedicated server-rendered UI test now mounts the protected appointment administration screen with a mocked verified record. It confirms the request name and service are visibly rendered in the appointment table and that the administration copy explicitly states the workflow is website-inbox-only, without email delivery.
