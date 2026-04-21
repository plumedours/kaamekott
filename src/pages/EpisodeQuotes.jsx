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

export default function EpisodeQuotesPage() {
  const { seasonId, episodeId } = useParams();
  const navigate = useNavigate();

  const {
    quotes,
    episodes,
    loading: quotesLoading,
    error: quotesError,
  } = useQuotesData();

  const { gifs, loading: gifsLoading, error: gifsError } = useGifsData();

  const loading = quotesLoading || gifsLoading;
  const error = quotesError || gifsError;

  const episode = useMemo(
    () =>
      episodes.find(
        (entry) => entry.seasonSlug === seasonId && entry.slug === episodeId,
      ),
    [episodes, seasonId, episodeId],
  );

  const episodeQuotes = useMemo(() => {
    if (!episode) return [];

    if (episode.code) {
      return quotes.filter((quote) => quote.episodeCode === episode.code);
    }

    return quotes.filter(
      (quote) =>
        quote.seasonSlug === seasonId && quote.episodeSlug === episodeId,
    );
  }, [quotes, episode, seasonId, episodeId]);

  const episodeGifs = useMemo(() => {
    if (!episode?.code) return [];
    return gifs.filter((gif) => gif.episode === episode.code);
  }, [gifs, episode]);

  if (loading) {
    return (
      <StatusView
        title="Chargement"
        message="Lecture des citations et des GIF de l’épisode…"
      />
    );
  }

  if (error) {
    return <StatusView title="Erreur" message={error} />;
  }

  if (!episode) {
    return (
      <StatusView
        title="Introuvable"
        message="Cet épisode n'existe pas dans le fichier."
      />
    );
  }

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="p-8 sm:p-10">
            <Link
              to={`/season/${seasonId}`}
              className="text-sm font-medium text-emerald-700 transition hover:text-emerald-900"
            >
              ← Retour au livre
            </Link>

            <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-600">
                  Épisode
                </p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                  {episode.title}
                </h1>
                <p className="mt-3 text-slate-600">
                  {episode.season}
                  {episode.number ? ` · Épisode ${episode.number}` : ""}
                  {episode.code ? ` · ${episode.code}` : ""}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                  <p className="text-sm text-slate-500">Citations</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {episodeQuotes.length}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                  <p className="text-sm text-slate-500">GIF</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {episodeGifs.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <ChatBubbleLeftRightIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Citations</h2>
              <p className="text-sm text-slate-500">
                Tout le meilleur — ou le pire — de cet épisode.
              </p>
            </div>
          </div>

          {episodeQuotes.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              Aucune citation trouvée pour cet épisode.
            </div>
          ) : (
            <div className="quote-masonry">
              {episodeQuotes.map((quote) => (
                <QuoteCard
                  key={quote.id}
                  quote={quote}
                  className="quote-masonry-item"
                  onCharacterClick={() =>
                    navigate(`/character/${quote.characterSlug}`)
                  }
                  onSeasonClick={() => navigate(`/season/${quote.seasonSlug}`)}
                  onEpisodeClick={() => {}}
                />
              ))}
            </div>
          )}
        </div>

        <div className="mt-12">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <PhotoIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">GIF</h2>
              <p className="text-sm text-slate-500">
                Les GIF connus pour cet épisode, quand le visuel est plus fort
                que les grands discours.
              </p>
            </div>
          </div>

          {episodeGifs.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              Aucun GIF trouvé pour cet épisode.
            </div>
          ) : (
            <div className="gif-grid">
              {episodeGifs.map((gif) => (
                <GifCard key={gif.id} gif={gif} />
              ))}
            </div>
          )}
        </div>
      </section>

      <ScrollToTopButton />
    </>
  );
}
