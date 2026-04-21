import { useEffect, useMemo, useState } from "react";
import { buildEpisodesMap, buildGifIndex, normalizeGifs } from "./gifs";

export function useGifsData() {
  const [gifs, setGifs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadGifs() {
      try {
        setLoading(true);
        setError("");

        const [gifsResponse, episodesResponse] = await Promise.all([
          fetch(`${import.meta.env.BASE_URL}gifs.json`, { cache: "no-store" }),
          fetch(`${import.meta.env.BASE_URL}episodes.json`, {
            cache: "no-store",
          }),
        ]);

        if (!gifsResponse.ok) {
          throw new Error(
            `Impossible de charger gifs.json (${gifsResponse.status})`,
          );
        }

        if (!episodesResponse.ok) {
          throw new Error(
            `Impossible de charger episodes.json (${episodesResponse.status})`,
          );
        }

        const rawGifs = await gifsResponse.json();
        const rawEpisodes = await episodesResponse.json();

        if (!Array.isArray(rawGifs)) {
          throw new Error(
            "Le fichier gifs.json doit contenir un tableau JSON.",
          );
        }

        if (!Array.isArray(rawEpisodes)) {
          throw new Error(
            "Le fichier episodes.json doit contenir un tableau JSON.",
          );
        }

        const episodesMap = buildEpisodesMap(rawEpisodes);
        const normalized = normalizeGifs(rawGifs, episodesMap);

        if (!cancelled) {
          setGifs(normalized);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.message || "Erreur inconnue lors du chargement des GIF.",
          );
          setGifs([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadGifs();

    return () => {
      cancelled = true;
    };
  }, []);

  const { characters, episodes } = useMemo(() => buildGifIndex(gifs), [gifs]);

  return {
    gifs,
    characters,
    episodes,
    loading,
    error,
  };
}
