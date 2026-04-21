import { Link } from "react-router-dom";
import ScrollToTopButton from "../components/ScrollToTopButton";
import StatusView from "../components/StatusView";
import { useQuotesData } from "../lib/useQuotesData";

export default function CharactersPage() {
  const { characters, loading, error } = useQuotesData();

  if (loading) {
    return (
      <StatusView title="Chargement" message="Préparation des personnages…" />
    );
  }

  if (error) {
    return <StatusView title="Erreur" message={error} />;
  }

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="p-8 sm:p-10">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-600">
              Navigation
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Personnages
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Toutes les citations classées par personnage. Parce que certaines conneries méritent d’être attribuées correctement.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {characters.map((character) => (
            <Link
              key={character.slug}
              to={`/character/${character.slug}`}
              className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-full flex-col justify-between gap-5">
                <div>
                  <div className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700">
                    Personnage
                  </div>

                  <h2 className="mt-4 text-2xl font-bold text-slate-900">
                    {character.name}
                  </h2>

                  {character.actor && character.actor !== character.name ? (
                    <p className="mt-2 text-sm text-slate-500">
                      Interprété par {character.actor}
                    </p>
                  ) : null}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    {character.count} citation{character.count > 1 ? "s" : ""}
                  </span>
                  <span className="text-sm font-semibold text-emerald-700 transition group-hover:text-emerald-900">
                    Ouvrir →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <ScrollToTopButton />
    </>
  );
}
