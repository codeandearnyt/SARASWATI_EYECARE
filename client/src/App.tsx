import { Route, Router, Switch } from "wouter";
import { useHashLocation } from "wouter/use-hash-location";
import { lazy, Suspense, useEffect, useState } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { isAdminHashRoute, legacyPublicHashPath } from "./lib/publicRoutes";
import Home from "./pages/Home";

const AdminApp = lazy(() => import("./pages/AdminApp"));
const ClinicPage = lazy(() => import("./pages/ClinicPage"));

function PublicRoutes() {
  return <Router><Switch><Route path="/about" component={ClinicPage} /><Route path="/services" component={ClinicPage} /><Route path="/photo" component={ClinicPage} /><Route path="/video" component={ClinicPage} /><Route path="/equipment" component={ClinicPage} /><Route path="/empanelment" component={ClinicPage} /><Route path="/career" component={ClinicPage} /><Route path="/contact" component={ClinicPage} /><Route path="/" component={Home} /><Route component={Home} /></Switch></Router>;
}

function AdminHashRoutes() {
  return <Router hook={useHashLocation}><Switch><Route path="/admin" component={AdminApp} /><Route path="/admin/blog" component={AdminApp} /><Route component={AdminApp} /></Switch></Router>;
}

function Routes() {
  const [adminRoute, setAdminRoute] = useState(() => isAdminHashRoute(window.location.hash));
  useEffect(() => {
    const syncRoute = () => {
      const legacyPath = legacyPublicHashPath(window.location.hash);
      if (legacyPath) {
        window.history.replaceState(null, "", legacyPath);
        window.dispatchEvent(new PopStateEvent("popstate"));
      }
      setAdminRoute(isAdminHashRoute(window.location.hash));
    };
    syncRoute();
    window.addEventListener("hashchange", syncRoute);
    return () => window.removeEventListener("hashchange", syncRoute);
  }, []);
  return adminRoute ? <AdminHashRoutes /> : <PublicRoutes />;
}

export default function App() {
  return <ErrorBoundary><Suspense fallback={<div className="route-loading" role="status">Loading page…</div>}><Routes /></Suspense></ErrorBoundary>;
}
