import { createRoot } from "react-dom/client";
import App from "./App";
import { installManagedAssetFallback } from "./lib/managedAssets";
import "./index.css";
import "./final-accessibility.css";
import "./team-review-refresh.css";
import "./original-reviews-section.css";
import "./purple-theme.css";
import "./contrast-repair.css";
import "./review-controls-accessibility.css";
import "./final-logo-portrait-visibility.css";
import "./portrait-zoom.css";
import "./portrait-bottom-anchor.css";
import "./portrait-individual-offsets.css";
import "./human-attention-contrast.css";
import "./premium-scroll-header.css";
import "./capsule-hero-header.css";
import "./centered-capsule-header.css";
import "./hero-orbit-return.css";
import "./interaction-typography-refinement.css";
import "./blog-system.css";
import "./home-blog-dialog.css";
import "./expanded-clinic-pages.css";
import "./admin-motion.css";
import "./shared-site-chrome.css";
import "./real-video-mobile-fixes.css";
import "./doctor-ratings-refinement.css";
import "./appointment-eye-refinement.css";
import "./appointment-human-verification.css";
import "./admin-appointment-filters.css";
import "./appointment-modal-readability.css";
import "./mobile-contact-repair.css";

installManagedAssetFallback();

createRoot(document.getElementById("root")!).render(
  <App />
);
