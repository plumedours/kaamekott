import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuoteCard from "../components/QuoteCard";
import ScrollToTopButton from "../components/ScrollToTopButton";
import StatusView from "../components/StatusView";
import { searchInQuote } from "../lib/quotes";
import { useQuotesData } from "../lib/useQuotesData";

export default function QuotesPage() {
  const navigate = useNavigate();
  const { quotes, loading, error } = useQuotesData();
  const [search, setSearch] = useState("");

  const filteredQuotes = useMemo(
    () => quotes.filter((quote) => searchInQuote(quote, search)),
    [quotes, search],
  );

  if (loading) {
    return <StatusView title="Chargement" message="Lecture des citations…" />;
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
              Collection
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Toutes les citations
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Recherche dans les citations, les personnages, les acteurs, les
              livres et les épisodes.
            </p>

            <div className="mt-6">
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Rechercher une citation, un personnage, un acteur, un épisode..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            {filteredQuotes.length} résultat
            {filteredQuotes.length > 1 ? "s" : ""}
          </p>
        </div>

        <div className="mt-6">
          {filteredQuotes.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              Aucun résultat pour cette recherche.
            </div>
          ) : (
            <div className="quote-masonry">
              {filteredQuotes.map((quote) => (
                <QuoteCard
                  key={quote.id}
                  quote={quote}
                  className="quote-masonry-item"
                  onCharacterClick={() =>
                    navigate(`/character/${quote.characterSlug}`)
                  }
                  onSeasonClick={() => navigate(`/season/${quote.seasonSlug}`)}
                  onEpisodeClick={() =>
                    navigate(
                      `/season/${quote.seasonSlug}/episode/${quote.episodeSlug}/citations`,
                    )
                  }
                />
              ))}
            </div>
          )}
        </div>
      </section>
      <ScrollToTopButton />
    </>
  );
}