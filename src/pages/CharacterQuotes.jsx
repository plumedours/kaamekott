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

export default function CharacterQuotesPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    quotes,
    characters,
    loading: quotesLoading,
    error: quotesError,
  } = useQuotesData();

  const { gifs, loading: gifsLoading, error: gifsError } = useGifsData();

  const loading = quotesLoading || gifsLoading;
  const error = quotesError || gifsError;

  const character = useMemo(
    () => characters.find((entry) => entry.slug === id),
    [characters, id],
  );

  const characterQuotes = useMemo(
    () => quotes.filter((quote) => quote.characterSlug === id),
    [quotes, id],
  );

  const characterGifs = useMemo(() => {
    if (!character) return [];

    return gifs.filter(
      (gif) =>
        gif.characters.some((name) => name === character.name) ||
        gif.charactersSpeaking.some((name) => name === character.name),
    );
  }, [gifs, character]);

  const seasonsCount = useMemo(() => {
    return new Set(characterQuotes.map((quote) => quote.seasonSlug)).size;
  }, [characterQuotes]);

  if (loading) {
    return (
      <StatusView
        title="Chargement"
        message="Lecture des citations et des GIF du personnage…"
      />
    );
  }

  if (error) {
    return <StatusView title="Erreur" message={error} />;
  }

  if (!character) {
    return (
      <StatusView
        title="Introuvable"
        message="Ce personnage n'existe pas dans le fichier."
      />
    );
  }

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="p-8 sm:p-10">
            <Link
              to="/characters"
              className="text-sm font-medium text-emerald-700 transition hover:text-emerald-900"
            >
              ← Retour aux personnages
            </Link>

            <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-600">
                  Personnage
                </p>
                <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
                  {character.name}
                </h1>

                {character.actor && character.actor !== character.name ? (
                  <p className="mt-3 text-slate-600">
                    Interprété par {character.actor}
                  </p>
                ) : null}
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                  <p className="text-sm text-slate-500">Citations</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {characterQuotes.length}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                  <p className="text-sm text-slate-500">GIF</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {characterGifs.length}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4">
                  <p className="text-sm text-slate-500">Livres concernés</p>
                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {seasonsCount}
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
                Tout ce que ce brave personnage a pu dire de mémorable.
              </p>
            </div>
          </div>

          {characterQuotes.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              Aucune citation trouvée pour ce personnage.
            </div>
          ) : (
            <div className="quote-masonry">
              {characterQuotes.map((quote) => (
                <QuoteCard
                  key={quote.id}
                  quote={quote}
                  className="quote-masonry-item"
                  onCharacterClick={() => {}}
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

        <div className="mt-12">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <PhotoIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">GIF</h2>
              <p className="text-sm text-slate-500">
                Parce qu’au bout d’un moment, il faut aussi la tronche qui va
                avec.
              </p>
            </div>
          </div>

          {characterGifs.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              Aucun GIF trouvé pour ce personnage.
            </div>
          ) : (
            <div className="gif-grid">
              {characterGifs.map((gif) => (
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
