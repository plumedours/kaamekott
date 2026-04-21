import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
  BookOpenIcon,
  PhotoIcon,
  InformationCircleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const navItems = [
  { to: "/", label: "Accueil", icon: HomeIcon },
  {
    to: "/quotes",
    label: "Toutes les citations",
    icon: ChatBubbleLeftRightIcon,
  },
  { to: "/characters", label: "Par personnage", icon: UsersIcon },
  { to: "/seasons", label: "Par livre", icon: BookOpenIcon },
  { to: "/gifs", label: "GIF", icon: PhotoIcon },
  { to: "/about", label: "À propos", icon: InformationCircleIcon },
];

function desktopNavLinkClass({ isActive }) {
  return [
    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
    isActive
      ? "bg-emerald-50 text-emerald-700"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  ].join(" ");
}

function mobileNavLinkClass({ isActive }) {
  return [
    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
    isActive
      ? "bg-emerald-50 text-emerald-700"
      : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
  ].join(" ");
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;

    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflow;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
          <NavLink to="/" className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <img
                src={`${import.meta.env.BASE_URL}unknown.png`}
                alt="Kaamekott"
                className="h-8 w-8 object-contain"
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-lg font-bold text-slate-900">
                Kaamekott
              </p>
              <p className="truncate text-xs text-slate-500">
                Les meilleures citations de Kaamelott
              </p>
            </div>
          </NavLink>

          <nav className="hidden flex-wrap items-center gap-2 lg:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={desktopNavLinkClass}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 lg:hidden"
            aria-label={mobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </header>

      <div
        className={[
          "fixed inset-0 z-40 bg-slate-950/30 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          mobileMenuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={() => setMobileMenuOpen(false)}
      />

      <div
        id="mobile-menu"
        className={[
          "fixed inset-x-0 top-[73px] z-50 mx-4 origin-top rounded-[2rem] border border-slate-200 bg-white/95 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-out sm:mx-6",
          mobileMenuOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-3 scale-95 opacity-0",
          "lg:hidden",
        ].join(" ")}
      >
        <div className="p-4">
          <div className="mb-3 px-2 pt-1">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Navigation
            </p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={mobileNavLinkClass}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-4 rounded-[1.5rem] border border-emerald-100 bg-emerald-50/80 p-4">
            <p className="text-sm font-semibold text-slate-900">
              Petit conseil
            </p>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Pour les GIF, passe par la recherche. C’est plus efficace que ces
              cons de pigeons.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
