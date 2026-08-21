import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

/**
 * Application shell: fixed clay sidebar (desktop) with a slide-over drawer on
 * mobile, sticky top bar, and the routed page content.
 */
export function AppShell() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  // Close the drawer when navigating.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col gap-6 p-6 lg:flex">
        <div className="clay-card clay-card-soft flex flex-1 flex-col gap-6 overflow-y-auto p-6">
          <Sidebar />
        </div>
      </aside>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 lg:hidden ${
          menuOpen ? "bg-[#332f3a]/30 opacity-100 backdrop-blur-sm" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 transform p-3 transition-transform duration-300 lg:hidden ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Mobile navigation"
        aria-hidden={!menuOpen}
      >
        <div className="clay-card clay-card-soft flex h-full flex-col gap-6 overflow-y-auto p-6">
          <div className="flex items-center justify-between">
            <p className="font-clay text-lg font-black">
              Menu
            </p>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="clay-btn clay-btn-secondary clay-btn-sm"
              aria-label="Close navigation"
            >
              ✕
            </button>
          </div>
          <Sidebar />
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar onMenuToggle={() => setMenuOpen(true)} />
        <main className="min-w-0 flex-1 px-4 pb-16 pt-2 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}