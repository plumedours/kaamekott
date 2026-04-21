import { Link } from "react-router-dom";
import {
  ChatBubbleLeftRightIcon,
  UsersIcon,
  BookOpenIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-lg font-bold text-slate-900">Kaamekott</p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Le coin tranquille pour retrouver citations, personnages et GIF de
              Kaamelott, sans avoir à consulter tout le royaume.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Navigation
            </p>

            <div className="mt-4 space-y-3 text-sm">
              <Link
                to="/quotes"
                className="flex items-center gap-2 text-slate-600 transition hover:text-emerald-700"
              >
                <ChatBubbleLeftRightIcon className="h-4 w-4" />
                Toutes les citations
              </Link>

              <Link
                to="/characters"
                className="flex items-center gap-2 text-slate-600 transition hover:text-emerald-700"
              >
                <UsersIcon className="h-4 w-4" />
                Par personnage
              </Link>

              <Link
                to="/seasons"
                className="flex items-center gap-2 text-slate-600 transition hover:text-emerald-700"
              >
                <BookOpenIcon className="h-4 w-4" />
                Par livre
              </Link>

              <Link
                to="/gifs"
                className="flex items-center gap-2 text-slate-600 transition hover:text-emerald-700"
              >
                <PhotoIcon className="h-4 w-4" />
                GIF
              </Link>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Important
            </p>

            <p className="mt-4 text-sm leading-6 text-slate-600">
              Ce site est dédié aux citations et GIF de Kaamelott. Si tu
              cherches des décisions logiques, des plans fiables ou des gens
              compétents, ça risque de coincer.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-500">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="font-medium text-slate-600">
                © {new Date().getFullYear()} Kaamekott
              </p>

              <p className="max-w-xl italic text-slate-500">
                “La joie d’vivre et le jambon, y’a pas 36 recettes du bonheur !”
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Link to="/about" className="transition hover:text-emerald-700">
                À propos
              </Link>

              <a
                href="https://github.com/plumedours"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-emerald-700"
              >
                GitHub
              </a>

              <a
                href="https://plumedours.github.io/portfolio/"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-emerald-700"
              >
                Portfolio
              </a>

              <a
                href="https://forms.gle/iLDJtXWebEf4ZVDm6"
                target="_blank"
                rel="noreferrer"
                className="transition hover:text-emerald-700"
              >
                Signaler / Contribuer
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
