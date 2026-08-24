# Master Flutter Build Prompt — Saraswati Eye Care Centre

> Build a production-ready Flutter workspace for **Saraswati Eye Care Centre, Jind, Haryana**. Create two responsive Flutter applications that share API models, design tokens, and authentication conventions: `clinic_admin` for authorised clinic staff and `patient_booking` for patients. Use Flutter stable, Dart 3, Material 3, `go_router`, Riverpod, Dio, `flutter_secure_storage`, `freezed`/`json_serializable`, `intl`, and a clean architecture organised by `core`, `features`, `data`, `domain`, and `presentation`. Do not place credentials, database connection strings, admin passwords, or backend secrets in either client.

> Use a premium clinic identity: deep purple and white surfaces with restrained gold highlights, rounded cards, accessible high-contrast text, clear loading/empty/error states, and tablet/desktop-responsive admin layouts. Use only real verified clinic information, doctor imagery, clinic photos, and official YouTube media. Never fabricate testimonials, ratings, appointments, patient records, credentials, or medical claims.

> ## App 1 — `clinic_admin`
>
> Build a protected staff-only admin app with these screens: Sign In, Dashboard, Appointment Inbox, Appointment Detail, Blog Management, and Website/Settings. The main Appointment Inbox must be a full responsive UI, not a placeholder. Include summary cards for new, confirmed, and total requests; search by patient name, phone, service, or specialist; status, service, and date filters; a clear-filters action; pagination or cursor loading; refresh; empty and error states; and CSV export containing **only currently filtered records**. The appointment detail must show patient contact information, requested service, preferred date/time, notes, human-verification state, current status, and an audited staff status-update action. Use confirmation dialogs for sensitive actions. Show a restricted screen for users without an `admin` role; do not render appointment data or export controls for them.

> Protect sessions with short-lived access tokens and rotating refresh tokens stored securely. Use server-enforced roles, TLS, rate limiting, consistent 401/403 handling, logout, token-expiry recovery, and audit-friendly status events. Never implement direct database access from Flutter.

> ## App 2 — `patient_booking`
>
> Build a patient-facing app with Home, About, Services, Doctors, Gallery, Official Videos, Equipment, Empanelments, Contact, Before Your Visit FAQ, and Appointment Booking. Include call, WhatsApp, map, and booking actions. Build a multi-step appointment wizard with field-level validation, progress indication, accessible labels, loading states, retry-safe submission, and a mandatory server-validated human challenge. Do not email submissions: verified requests must appear only in the protected admin inbox. Use touch-friendly interactions and provide a reduced-motion option. The clinical eye visual should support tap-to-explore on touch devices and pointer movement where supported.

> ## Required backend API contract
>
> Implement versioned HTTPS JSON endpoints with OpenAPI 3.1 documentation and typed generated client models:
>
> - `POST /v1/admin/auth/login`, `POST /v1/admin/auth/refresh`, `POST /v1/admin/auth/logout`, `GET /v1/admin/auth/me`.
> - `GET /v1/admin/appointments?q=&status=&service=&date=&cursor=&limit=` for admin-only filtered lists.
> - `GET /v1/admin/appointments/{id}` and `PATCH /v1/admin/appointments/{id}/status` with an audit event.
> - `GET /v1/admin/appointments/export?q=&status=&service=&date=` to stream CSV for the active filters only; safely quote fields and neutralise spreadsheet-formula prefixes.
> - `POST /v1/public/appointment-challenge` to issue a short-lived, one-time challenge and `POST /v1/public/appointments` to accept a verified appointment request. Reject invalid, expired, or reused proof server-side. Apply IP and account rate limits.
> - Read-only public endpoints for clinic profile, services, doctors, media, empanelments, FAQ, and published blog posts.
>
> Return RFC 9457-style error objects with stable machine-readable codes. Enforce validation, authorization, pagination bounds, request IDs, structured audit logs, and never return secrets. Keep appointment data in the protected clinic inbox; no outgoing email delivery.

> Deliver a complete workspace structure, API client layer, repository interfaces and implementations, Riverpod providers, route guards, design system, reusable form controls, unit/widget tests, integration-test plan, `.env.example` files without values, OpenAPI file, README setup instructions, and CI commands. The final result must compile, be accessible, and avoid mock patient or review data.
