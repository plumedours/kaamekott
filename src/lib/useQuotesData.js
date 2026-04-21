import { useEffect, useMemo, useState } from "react";
import { buildDataIndex, buildEpisodesMap, normalizeQuotes } from "./quotes";

export function useQuotesData() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadQuotes() {
      try {
        setLoading(true);
        setError("");

        const [quotesResponse, episodesResponse] = await Promise.all([
          fetch(`${import.meta.env.BASE_URL}quotes.json`, {
            cache: "no-store",
          }),
          fetch(`${import.meta.env.BASE_URL}episodes.json`, {
            cache: "no-store",
          }),
        ]);

        if (!quotesResponse.ok) {
          throw new Error(
            `Impossible de charger quotes.json (${quotesResponse.status})`,
          );
        }

        if (!episodesResponse.ok) {
          throw new Error(
            `Impossible de charger episodes.json (${episodesResponse.status})`,
          );
        }

        const rawQuotes = await quotesResponse.json();
        const rawEpisodes = await episodesResponse.json();

        if (!Array.isArray(rawQuotes)) {
          throw new Error(
            "Le fichier quotes.json doit contenir un tableau JSON.",
          );
        }

        if (!Array.isArray(rawEpisodes)) {
          throw new Error(
            "Le fichier episodes.json doit contenir un tableau JSON.",
          );
        }

        const episodesMap = buildEpisodesMap(rawEpisodes);
        const normalized = normalizeQuotes(rawQuotes, episodesMap);

        if (!cancelled) {
          setQuotes(normalized);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err?.message || "Erreur inconnue lors du chargement des citations.",
          );
          setQuotes([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadQuotes();

    return () => {
      cancelled = true;
    };
  }, []);

  const { characters, seasons, episodes } = useMemo(
    () => buildDataIndex(quotes),
    [quotes],
  );

  return {
    quotes,
    characters,
    seasons,
    episodes,
    loading,
    error,
  };
}
