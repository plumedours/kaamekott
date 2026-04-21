import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  UsersIcon,
  BookOpenIcon,
  MagnifyingGlassIcon,
  PhotoIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import QuoteCard from "../components/QuoteCard";
import GifCard from "../components/GifCard";
import ScrollToTopButton from "../components/ScrollToTopButton";
import StatusView from "../components/StatusView";
import { getRandomQuote } from "../lib/quotes";
import { useQuotesData } from "../lib/useQuotesData";
import { useGifsData } from "../lib/useGifsData";

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Icon className="h-6 w-6" />
        </div>

        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function ShortcutCard({ icon: Icon, title, text, to }) {
  return (
    <Link
      to={to}
      className="group rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-100">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </Link>
  );
}

export default function HomePage() {
  const navigate = useNavigate();

  const {
    quotes,
    characters,
    seasons,
    loading: quotesLoading,
    error: quotesError,
  } = useQuotesData();

  const { gifs, loading: gifsLoading, error: gifsError } = useGifsData();

  const loading = quotesLoading || gifsLoading;
  const error = quotesError || gifsError;

  const [randomSeed, setRandomSeed] = useState(0);

  const featuredQuotes = useMemo(() => {
    const copy = [...quotes];
    const shuffled = copy.sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 6);
  }, [quotes]);

  const randomQuote = useMemo(() => {
    if (!quotes.length) return null;

    if (randomSeed === 0) {
      return getRandomQuote(quotes);
    }

    return quotes[Math.floor(Math.random() * quotes.length)];
  }, [quotes, randomSeed]);

  const randomGif = useMemo(() => {
    if (!gifs.length) return null;
    return gifs[Math.floor(Math.random() * gifs.length)];
  }, [gifs, randomSeed]);

  const refreshRandom = () => {
    setRandomSeed((prev) => prev + 1);
  };

  if (loading) {
    return (
      <StatusView
        title="Chargement"
        message="Les citations et les GIF arrivent. Pas tous en même temps, faut pas pousser."
      />
    );
  }

  if (error) {
    return <StatusView title="Erreur" message={error} />;
  }

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.08),_transparent_32%)]" />

            <div className="relative flex h-full flex-col p-8 sm:p-10 lg:p-12">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                <SparklesIcon className="h-4 w-4" />
                Kaamekott
              </div>

              <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
                Les meilleures citations de Kaamelott, sans les tartes aux
                fraises mais avec les répliques qui claquent.
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                Retrouve les phrases cultes, les punchlines de génie, les
                sorties de route verbales, et tout ce qui fait qu’on peut
                difficilement faire plus classe qu’un bon vieux “C’est pas
                faux”.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Link
                  to="/quotes"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5" />
                  Toutes les citations
                </Link>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
                <Link
                  to="/characters"
                  className="inline-flex h-12 min-w-[250px] items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                >
                  <UsersIcon className="h-5 w-5" />
                  Parcourir par personnage
                </Link>

                <Link
                  to="/seasons"
                  className="inline-flex h-12 min-w-[250px] items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                >
                  <BookOpenIcon className="h-5 w-5" />
                  Parcourir par livre
                </Link>
              </div>

              <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50/80 p-5">
                <p className="text-sm font-semibold text-slate-900">
                  Ici, pas de blabla inutile.
                </p>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Tu cherches une réplique d’Arthur, une envolée lyrique de
                  Karadoc, une horreur sortie par Léodagan ou une absurdité
                  signée Perceval ? Tu fouilles, tu trouves, et tu te régales.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-slate-200 bg-gradient-to-br from-emerald-50 via-white to-slate-50 p-6 shadow-sm sm:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-700">
              Bibliothèque
            </p>

            <div className="mt-6 grid gap-4">
              <StatCard
                icon={ChatBubbleLeftRightIcon}
                label="Citations"
                value={quotes.length}
              />
              <StatCard
                icon={UsersIcon}
                label="Personnages"
                value={characters.length}
              />
              <StatCard
                icon={BookOpenIcon}
                label="Livres / films"
                value={seasons.length}
              />
            </div>

            <div className="mt-6 rounded-[1.5rem] border border-emerald-100 bg-emerald-50/70 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Conseil de stratège
                  </p>
                  <p className="mt-1 text-sm leading-7 text-slate-600">
                    Utilise la recherche pour remettre la main sur une citation,
                    un personnage, un acteur ou un épisode. C’est plus efficace
                    que ces cons de pigeons.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
          <ShortcutCard
            icon={UsersIcon}
            title="Par personnage"
            text="Pour retrouver qui a dit quoi, et vérifier une bonne fois pour toutes que Bohort n’est pas armé pour la brutalité."
            to="/characters"
          />
          <ShortcutCard
            icon={BookOpenIcon}
            title="Par livre"
            text="Navigue de saison en saison et replonge dans les grands moments de solitude du royaume."
            to="/seasons"
          />
          <ShortcutCard
            icon={ChatBubbleLeftRightIcon}
            title="Toutes les citations"
            text="Le grand inventaire des répliques cultes, des menaces fleuries et des raisonnements de travers."
            to="/quotes"
          />
          <ShortcutCard
            icon={PhotoIcon}
            title="GIF"
            text="Quand une réplique ne suffit plus et qu’il faut carrément sortir l’expression faciale qui va avec."
            to="/gifs"
          />
        </div>

        {(randomQuote || randomGif) && (
          <div className="mt-12">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  Aléatoire
                </p>
                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  Le destin décide à ta place
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Une citation et un GIF tirés au hasard. Comme une stratégie
                  montée par Perceval, mais qui marche.
                </p>
              </div>

              <button
                type="button"
                onClick={refreshRandom}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
              >
                <ArrowPathIcon className="h-5 w-5" />
                Relancer l’aléatoire
              </button>
            </div>

            <div className="grid gap-8 xl:grid-cols-2">
              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <ChatBubbleLeftRightIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      Citation aléatoire
                    </h3>
                    <p className="text-sm text-slate-500">
                      Pour tomber sur une pépite sans lever le petit doigt.
                    </p>
                  </div>
                </div>

                {randomQuote && (
                  <QuoteCard
                    quote={randomQuote}
                    featured
                    onCharacterClick={() =>
                      navigate(`/character/${randomQuote.characterSlug}`)
                    }
                    onSeasonClick={() =>
                      navigate(`/season/${randomQuote.seasonSlug}`)
                    }
                    onEpisodeClick={() =>
                      navigate(
                        `/season/${randomQuote.seasonSlug}/episode/${randomQuote.episodeSlug}/citations`,
                      )
                    }
                  />
                )}
              </div>

              <div>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                    <PhotoIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">
                      GIF aléatoire
                    </h3>
                    <p className="text-sm text-slate-500">
                      Pour répondre dignement quand les mots ne suffisent plus.
                    </p>
                  </div>
                </div>

                {randomGif && <GifCard gif={randomGif} />}
              </div>
            </div>
          </div>
        )}

        <div className="mt-12">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                Sélection
              </p>
              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Quelques citations
              </h2>
            </div>

            <Link
              to="/quotes"
              className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-900"
            >
              Tout voir →
            </Link>
          </div>

          <div className="quote-masonry">
            {featuredQuotes.map((quote) => (
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
        </div>
      </section>

      <ScrollToTopButton />
    </>
  );
}
