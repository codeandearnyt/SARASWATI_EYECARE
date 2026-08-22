# Performance and quality audit

## Baseline mobile Lighthouse audit

The local mobile audit of the public homepage reported **Performance 45**, **Accessibility 82**, **Best Practices 81**, and **SEO 92**. The main opportunities were an unoptimized visual payload, a large initial JavaScript bundle, external rendering dependencies, missing crawler guidance, restrictive viewport configuration, contrast and touch-target issues, and non-sequential footer headings.

## Optimization plan

The implementation will retain the clinic’s original imagery but create optimized WebP derivatives, preload the hero image, lazy-load below-the-fold imagery, and code-split appointment and admin features. It will replace the restrictive viewport, add canonical and social metadata, publish valid `robots.txt` and `llms.txt`, extend structured data, improve heading semantics, enlarge interactive targets, and strengthen low-contrast text styles. Lighthouse results will be measured again after the changes.

## Completed refinements

The public homepage now uses compact, source-preserving WebP derivatives for the hero, facility gallery, clinician portraits, and the brand mark. The four clinician portraits are lazy-loaded with explicit dimensions and asynchronous decoding. The appointment wizard and protected admin page are code-split so they no longer load with the initial public route. The site now includes a canonical URL, Open Graph and Twitter metadata, MedicalOrganization structured data, `robots.txt`, `sitemap.xml`, and `llms.txt`. Keyboard focus, touch target, heading, and contrast refinements were also added while retaining the warm parchment-and-teal clinical editorial design.

## Final local production audit

After moving the tRPC/React Query client behind the lazy appointment and admin feature boundaries, the initial public JavaScript bundle decreased from approximately **956 KiB to 853 KiB** before transfer compression. The final locally served production homepage audit reported **Performance 55**, **Accessibility 100**, **Best Practices 81**, and **SEO 100**. The protected `/#/admin` route reported **Performance 57**, **Accessibility 100**, **Best Practices 81**, and **SEO 100**. Image-delivery savings were reduced from roughly 948 KiB before the brand-mark and clinician-image work to approximately 17 KiB. The public interface and protected appointment-management screen were visually checked at desktop and mobile breakpoints.

The local audit remains materially affected by the managed runtime: the generated document includes runtime/debug instrumentation, the local audit server does not mirror edge compression/caching, and the runtime injects an unload-event listener. Lighthouse identifies that listener as a deprecated API and the reason that the page cannot use the back/forward cache. The remaining source-map and small unminified-JavaScript observations also stem from the generated runtime response rather than clinic code.

## Ownership of remaining Lighthouse findings

| Finding | Ownership | Disposition |
| --- | --- | --- |
| Deprecated unload-event API and failed back/forward-cache restoration | **Platform-controlled** | The generated local runtime response attaches the unload listener. This is outside the public clinic components and cannot be removed safely from application code. |
| Missing source maps and the small unminified-JavaScript observation | **Platform-controlled** | These relate to the generated runtime response and build delivery rather than a clinic feature module. |
| Local document latency, lack of edge compression/cache parity, and debug instrumentation | **Platform-controlled in this measurement** | The local server does not reproduce the deployed edge’s network and caching behavior. A deployed PageSpeed test is required for representative delivery measurements. |
| Residual unused JavaScript and render-blocking opportunity | **Application-controlled, reduced** | The client data stack is now lazy-loaded; this lowered the public initial JavaScript from approximately 956 KiB to 853 KiB. Further reductions would require replacing additional premium interaction/runtime dependencies and should be evaluated against visual and feature regressions. |

Therefore the site is SEO-ready and aggressively optimized within the existing architecture, but a guaranteed 95+ score in every third-party PageSpeed/Lighthouse run cannot be represented honestly without testing the deployed edge response and removing platform-controlled runtime overhead.
