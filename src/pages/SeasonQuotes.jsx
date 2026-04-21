import { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ChatBubbleLeftRightIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import QuoteCard from "../components/QuoteCard";
import GifCard from "../components/GifCard";
import ScrollToTopButton from "../components/ScrollToTopButton";
import StatusView from "../components/StatusView";
import { useQuotesData } from "../lib/useQuotesData";
import { useGifsData } from "../lib/useGifsData";

export default function SeasonQuotesPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    quotes,
    seasons,
    episodes,
    loading: quotesLoading,
    error: quotesError,
  } = useQuotesData();

  const { gifs, loading: gifsLoading, error: gifsError } = useGifsData();

  const loading = quotesLoading || gifsLoading;
  const error = quotesError || gifsError;

  const season = useMemo(
    () => seasons.find((entry) => entry.slug === id),
    [seasons, id],
  );

  const seasonQuotes = useMemo(
    () => quotes.filter((quote) => quote.seasonSlug === id),
    [quotes, id],
  );

  const seasonEpisodes = useMemo(
    () => episodes.filter((episode) => episode.seasonSlug === id),
    [episodes, id],
  );

  const seasonGifs = useMemo(() => {
    if (!seasonQuotes.length) return [];

    const codes = new Set(
      seasonQuotes.map((quote) => quote.episodeCode).filter(Boolean),
    );

    if (!codes.size) return [];

    return gifs.filter((gif) => gif.episode && codes.has(gif.episode));
  }, [seasonQuotes, gifs]);

  if (loading) {
    return (
      <StatusView
        title="Chargement"
        message="On rassemble les citations et les GIF du livre…"
      />
    );
  }

  if (error) {
    return <StatusView title="Erreur" message={error} />;
  }

  if (!season) {
    return (
      <StatusView
        title="Introuvable"
        message="Ce livre n'existe pas dans le fichier."
      />
    );
  }

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[320px_1fr]">
            <div className="relative min-h-[240px] lg:min-h-full">
              <img
                src={season.cover}
                alt={season.name}
                className="absolute inset-0 h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.src = `${import.meta.env.BASE_URL}unknown.png`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/35 to-slate-900/10" />
            </div>

            <div className="p-8 sm:p-10">
              <Link
                to="/seasons"
                className="text-sm font-medium text-emerald-700 transition hover:text-emerald-900"
              >
                ← Retour aux livres
              </Link>

              <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-600">
                    Par livre
                  </p>
                  <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                    {season.name}
                  </h1>
                  <p className="mt-3 text-slate-600">
                    {seasonQuotes.length} citation
                    {seasonQuotes.length > 1 ? "s" : ""} ·{" "}
                    {seasonEpisodes.length} épisode
                    {seasonEpisodes.length > 1 ? "s" : ""} · {seasonGifs.length}{" "}
                    GIF
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  Sélectionne un épisode à gauche pour filtrer plus vite.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="xl:sticky xl:top-8 xl:self-start">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-slate-900">
                  Épisodes
                </h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {seasonEpisodes.length}
                </span>
              </div>

              <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
                {seasonEpisodes.map((episode) => (
                  <button
                    key={episode.key}
                    type="button"
                    onClick={() =>
                      navigate(
                        `/season/${season.slug}/episode/${episode.slug}/citations`,
                      )
                    }
                    className="flex w-full items-start justify-between gap-4 rounded-2xl border border-slate-200 px-4 py-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50"
                  >
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-slate-900">
                        {episode.title}
                      </span>
                      <span className="mt-1 block text-sm text-slate-500">
                        {episode.number
                          ? `Épisode ${episode.number}`
                          : "Sans numéro"}
                      </span>
                    </span>

                    <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {episode.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <div className="space-y-12">
            <div>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Citations
                  </h2>
                  <p className="text-sm text-slate-500">
                    Tout ce que ce livre contient de grand, de débile et de
                    mémorable.
                  </p>
                </div>
              </div>

              {seasonQuotes.length === 0 ? (
                <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
                  Aucune citation trouvée pour ce livre.
                </div>
              ) : (
                <div className="quote-masonry">
                  {seasonQuotes.map((quote) => (
                    <QuoteCard
                      key={quote.id}
                      quote={quote}
                      className="quote-masonry-item"
                      onCharacterClick={() =>
                        navigate(`/character/${quote.characterSlug}`)
                      }
                      onSeasonClick={() => {}}
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

            <div>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <PhotoIcon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    GIF du livre
                  </h2>
                  <p className="text-sm text-slate-500">
                    Les GIF retrouvés dans les épisodes de ce livre. Parce qu’au
                    bout d’un moment, il faut aussi les tronches.
                  </p>
                </div>
              </div>

              {seasonGifs.length === 0 ? (
                <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
                  Aucun GIF trouvé pour ce livre.
                </div>
              ) : (
                <div className="gif-grid">
                  {seasonGifs.map((gif) => (
                    <GifCard key={gif.id} gif={gif} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <ScrollToTopButton />
    </>
  );
}
