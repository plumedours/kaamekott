import { useEffect, useMemo, useRef, useState } from "react";
import {
  MagnifyingGlassIcon,
  PhotoIcon,
  UserGroupIcon,
  FilmIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import GifCard from "../components/GifCard";
import ScrollToTopButton from "../components/ScrollToTopButton";
import StatusView from "../components/StatusView";
import { searchInGif } from "../lib/gifs";
import { useGifsData } from "../lib/useGifsData";

const PAGE_SIZE = 48;

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

export default function GifsPage() {
  const { gifs, characters, episodes, loading, error } = useGifsData();
  const [search, setSearch] = useState("");
  const [characterFilter, setCharacterFilter] = useState("");
  const [episodeFilter, setEpisodeFilter] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const loadMoreRef = useRef(null);

  const filteredGifs = useMemo(() => {
    return gifs.filter((gif) => {
      const matchesSearch = searchInGif(gif, search);

      const matchesCharacter = characterFilter
        ? gif.characters.some((name) => name === characterFilter)
        : true;

      const matchesEpisode = episodeFilter
        ? gif.episode === episodeFilter
        : true;

      return matchesSearch && matchesCharacter && matchesEpisode;
    });
  }, [gifs, search, characterFilter, episodeFilter]);

  const visibleGifs = useMemo(
    () => filteredGifs.slice(0, visibleCount),
    [filteredGifs, visibleCount],
  );

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, characterFilter, episodeFilter]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting && visibleCount < filteredGifs.length) {
          setVisibleCount((prev) =>
            Math.min(prev + PAGE_SIZE, filteredGifs.length),
          );
        }
      },
      { rootMargin: "300px 0px" },
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [visibleCount, filteredGifs.length]);

  if (loading) {
    return (
      <StatusView
        title="Chargement"
        message="Les GIF arrivent. Doucement, faut les laisser galoper."
      />
    );
  }

  if (error) {
    return <StatusView title="Erreur" message={error} />;
  }

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(59,130,246,0.08),_transparent_32%)]" />
          <div className="relative p-8 sm:p-10 lg:p-12">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              <SparklesIcon className="h-4 w-4" />
              GIF
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Les GIF de Kaamelott, pour répondre proprement quand les mots ne
              suffisent plus.
            </h1>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
              Cherche une réaction précise, une grimace mémorable, une
              engueulade d’anthologie ou une ambiance de merde particulièrement
              bien documentée.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <StatCard icon={PhotoIcon} label="GIF" value={gifs.length} />
          <StatCard
            icon={UserGroupIcon}
            label="Personnages"
            value={characters.length}
          />
          <StatCard
            icon={FilmIcon}
            label="Épisodes indexés"
            value={episodes.length}
          />
        </div>

        <div className="mt-8 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Recherche
              </span>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Quote, nom de fichier, personnage, épisode..."
                  className="w-full bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Personnage
              </span>
              <select
                value={characterFilter}
                onChange={(event) => setCharacterFilter(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400"
              >
                <option value="">Tous les personnages</option>
                {characters.map((character) => (
                  <option key={character.slug} value={character.name}>
                    {character.name} ({character.count})
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">
                Épisode
              </span>
              <select
                value={episodeFilter}
                onChange={(event) => setEpisodeFilter(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-emerald-400"
              >
                <option value="">Tous les épisodes</option>
                {episodes.map((episode) => (
                  <option key={episode.code} value={episode.code}>
                    {episode.title
                      ? `${episode.title} · ${episode.code} (${episode.count})`
                      : `${episode.label} (${episode.count})`}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <span className="rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
              {filteredGifs.length} résultat{filteredGifs.length > 1 ? "s" : ""}
            </span>

            {search || characterFilter || episodeFilter ? (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCharacterFilter("");
                  setEpisodeFilter("");
                }}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
              >
                Réinitialiser les filtres
              </button>
            ) : null}
          </div>
        </div>

        <div className="mt-8">
          {filteredGifs.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-lg font-semibold text-slate-900">
                Aucun GIF trouvé.
              </p>
              <p className="mt-2 text-slate-500">
                Essaie avec un autre personnage, un autre épisode, ou une
                réplique un peu moins obscure.
              </p>
            </div>
          ) : (
            <>
              <div className="gif-grid">
                {visibleGifs.map((gif) => (
                  <GifCard key={gif.id} gif={gif} />
                ))}
              </div>

              <div ref={loadMoreRef} className="h-8" />

              {visibleCount < filteredGifs.length ? (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={() =>
                      setVisibleCount((prev) =>
                        Math.min(prev + PAGE_SIZE, filteredGifs.length),
                      )
                    }
                    className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-300 hover:text-emerald-700"
                  >
                    Charger plus de GIF
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </section>

      <ScrollToTopButton />
    </>
  );
}
