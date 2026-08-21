import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { Spinner } from "./components/ui/Spinner";

// Lazy-load pages to keep the initial bundle lean.
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const RepositoriesPage = lazy(() => import("./pages/RepositoriesPage"));
const RepositoryHealthPage = lazy(() => import("./pages/RepositoryHealthPage"));
const AnalysisPage = lazy(() => import("./pages/AnalysisPage"));
const ReportPage = lazy(() => import("./pages/ReportPage"));
const AutomationPage = lazy(() => import("./pages/AutomationPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));

function PageFallback() {
  return (
    <div className="py-20">
      <Spinner label="Loading page…" />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/repositories" element={<RepositoriesPage />} />
          <Route path="/repos/:owner/:repo" element={<RepositoryHealthPage />} />
          <Route path="/repos/:owner/:repo/analysis" element={<AnalysisPage />} />
          <Route path="/repos/:owner/:repo/report" element={<ReportPage />} />
          <Route path="/repos/:owner/:repo/automation" element={<AutomationPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}