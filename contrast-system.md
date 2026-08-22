# Purple Theme Contrast System

The website uses two deliberate contrast layers. `client/src/contrast-repair.css` owns the shared, high-visibility text tokens for dark public purple surfaces, including the hero, doctor cards, team feature, CTA, and footer. It defines the strong, muted, accent, and control text colors used against deep violet backgrounds.

`client/src/purple-theme.css` owns the global purple visual system and the light-surface administration interface. Its rules cover the public page backgrounds and purple admin cards, tables, controls, delivery states, and light-surface text. These admin treatments remain separate because they use light lavender surfaces rather than the dark public purple palette.

Both routes were audited after the contrast repair: the public homepage and `/#/admin` each reached **Accessibility 100** in the local production Lighthouse audit. Remaining Best Practices observations are the previously documented managed-runtime deprecation and source-map items, not application contrast findings.
