# External Deployment Validation

The external Vercel repair is configuration-based: `vercel.json` routes every existing `/manus-storage/*` asset path to the published project storage endpoint before the single-page-app fallback. This covers the logo, clinic photography, clinician portraits, Google Maps mark, video thumbnails, favicon, and preload assets without duplicating media into the deployment bundle.

The local server serves `/.well-known/security.txt`, and the production output includes that file without source maps. The public homepage also remains visually intact after the deployment configuration change. The sandbox could not make a direct TLS connection to the published Manus domain during an asset probe, so final external confirmation requires redeploying the included `vercel.json` on Vercel and checking the live browser network panel.

The shared footer was rechecked at 375px and 768px viewports after its grid and embedded-map containment repair. At mobile it becomes a single `minmax(0, 1fr)` column; at tablet it uses two containment-safe columns. The Google map remains within its card width with a bounded aspect ratio and no visible right-edge overflow.
