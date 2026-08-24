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
import "./shared-site-chrome.css";
import "./doctor-ratings-refinement.css";

function installAnalytics() {
  const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;
  const websiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;
  if (!endpoint || !websiteId || endpoint.includes("%") || websiteId.includes("%")) return;
  const analytics = document.createElement("script");
  analytics.defer = true;
  analytics.src = `${endpoint.replace(/\/$/, "")}/umami`;
  analytics.dataset.websiteId = websiteId;
  document.head.appendChild(analytics);
}

installManagedAssetFallback();
installAnalytics();

createRoot(document.getElementById("root")!).render(
  <App />
);
