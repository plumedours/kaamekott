const cleanValue = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

const slugify = (value = "") =>
  cleanValue(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "-")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const normalizeLoose = (value = "") =>
  cleanValue(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, "'")
    .toLowerCase()
    .replace(/[^a-z0-9']+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const seasonOrderMap = {
  pilote: 0,
  "livre i": 1,
  "livre ii": 2,
  "livre iii": 3,
  "livre iv": 4,
  "livre v": 5,
  "livre vi": 6,
  film: 7,
  "volet i": 7,
  "premier volet": 7,
};

const toRoman = (num) => {
  const map = [
    [10, "X"],
    [9, "IX"],
    [5, "V"],
    [4, "IV"],
    [1, "I"],
  ];

  let n = Number(num);
  if (!Number.isFinite(n) || n <= 0) return String(num);

  let result = "";
  for (const [value, symbol] of map) {
    while (n >= value) {
      result += symbol;
      n -= value;
    }
  }
  return result;
};

const pad2 = (value) => String(value).padStart(2, "0");

const getSeasonOrder = (season = "") => {
  const key = cleanValue(season).toLowerCase();
  return seasonOrderMap[key] ?? 999;
};

const getSeasonNumberFromLabel = (season = "") => {
  const raw = cleanValue(season).toLowerCase();

  if (raw === "pilote") return 0;
  if (raw.startsWith("livre ")) {
    const order = getSeasonOrder(season);
    return order === 999 ? null : order;
  }

  return null;
};

const parseEpisodeNumber = (value) => {
  const raw = cleanValue(value);
  const number = Number.parseInt(raw, 10);
  return Number.isNaN(number) ? null : number;
};

const parseEpisodeCode = (code = "") => {
  const raw = cleanValue(code).toUpperCase();
  const match = raw.match(/^S(\d{2})E(\d{2,3})$/);

  if (!match) {
    return {
      code: raw,
      seasonNumber: null,
      episodeNumber: null,
      sortKey: 999999,
    };
  }

  const seasonNumber = Number.parseInt(match[1], 10);
  const episodeNumber = Number.parseInt(match[2], 10);

  return {
    code: raw,
    seasonNumber,
    episodeNumber,
    sortKey: seasonNumber * 1000 + episodeNumber,
  };
};

export const buildEpisodesMap = (rawEpisodes = []) => {
  const byCode = new Map();
  const bySeasonAndTitle = new Map();

  for (const item of rawEpisodes) {
    const code = cleanValue(item.code).toUpperCase();
    const title = cleanValue(item.title);
    if (!code || !title) continue;

    const parsed = parseEpisodeCode(code);
    const normalizedTitle = normalizeLoose(title);

    const meta = {
      code,
      title,
      normalizedTitle,
      seasonNumber: parsed.seasonNumber,
      episodeNumber: parsed.episodeNumber,
      sortKey: parsed.sortKey,
      seasonLabel:
        parsed.seasonNumber === 0
          ? "Pilote"
          : parsed.seasonNumber
            ? `Livre ${toRoman(parsed.seasonNumber)}`
            : "",
    };

    byCode.set(code, meta);

    if (meta.seasonNumber !== null) {
      bySeasonAndTitle.set(`${meta.seasonNumber}:${normalizedTitle}`, meta);
    }
  }

  return { byCode, bySeasonAndTitle };
};

export const buildQuoteId = (quote, index) => {
  const preferredName =
    cleanValue(quote.character) ||
    cleanValue(quote.personnage) ||
    cleanValue(quote.actor) ||
    "quote";

  const base = [
    cleanValue(quote.season),
    cleanValue(quote.title),
    cleanValue(quote.episode),
    preferredName,
    index + 1,
  ]
    .filter(Boolean)
    .join("-");

  return slugify(base) || `quote-${index + 1}`;
};

const getSeasonCover = (season = "", seasonOrder = null) => {
  const normalized = cleanValue(season).toLowerCase();

  if (normalized === "pilote") {
    return `${import.meta.env.BASE_URL}unknown.png`;
  }

  if (
    normalized.includes("film") ||
    normalized.includes("volet") ||
    normalized.includes("premier volet")
  ) {
    return `${import.meta.env.BASE_URL}movie-volet-1.png`;
  }

  const resolvedOrder = seasonOrder ?? getSeasonOrder(season);

  if (resolvedOrder >= 1 && resolvedOrder <= 6) {
    return `${import.meta.env.BASE_URL}livre-${resolvedOrder}.jpg`;
  }

  return `${import.meta.env.BASE_URL}unknown.png`;
};

const resolveEpisodeMeta = ({ season, title, episode, episodesMap }) => {
  const seasonNumber = getSeasonNumberFromLabel(season);
  const explicitEpisodeNumber = parseEpisodeNumber(episode);

  if (seasonNumber !== null && explicitEpisodeNumber !== null) {
    const code = `S${pad2(seasonNumber)}E${pad2(explicitEpisodeNumber)}`;
    const exact = episodesMap.byCode.get(code);

    return {
      code,
      seasonNumber,
      episodeNumber: explicitEpisodeNumber,
      titleResolved: exact?.title || cleanValue(title),
      sortKey: exact?.sortKey ?? seasonNumber * 1000 + explicitEpisodeNumber,
    };
  }

  if (seasonNumber !== null && cleanValue(title)) {
    const key = `${seasonNumber}:${normalizeLoose(title)}`;
    const match = episodesMap.bySeasonAndTitle.get(key);

    if (match) {
      return {
        code: match.code,
        seasonNumber: match.seasonNumber,
        episodeNumber: match.episodeNumber,
        titleResolved: match.title,
        sortKey: match.sortKey,
      };
    }
  }

  return {
    code: "",
    seasonNumber,
    episodeNumber: explicitEpisodeNumber,
    titleResolved: cleanValue(title),
    sortKey:
      seasonNumber !== null && explicitEpisodeNumber !== null
        ? seasonNumber * 1000 + explicitEpisodeNumber
        : 999999,
  };
};

export const normalizeQuotes = (
  rawQuotes = [],
  episodesMap = { byCode: new Map(), bySeasonAndTitle: new Map() },
) =>
  rawQuotes
    .map((item, index) => {
      const text = cleanValue(item.quote ?? item.text);
      const season = cleanValue(item.season) || "Inconnu";
      const episodeTitle =
        cleanValue(item.title ?? item.episodeTitle) || "Sans titre";
      const episodeRaw = cleanValue(item.episode ?? item.episodeNumber);
      const actor = cleanValue(item.actor);
      const character = cleanValue(item.character ?? item.personnage);

      const displayCharacter = character || actor || "Inconnu";
      const id = cleanValue(item.id) || buildQuoteId(item, index);
      const seasonSlug = slugify(season);
      const seasonOrder = item.seasonOrder ?? getSeasonOrder(season);

      const resolvedEpisode = resolveEpisodeMeta({
        season,
        title: episodeTitle,
        episode: episodeRaw,
        episodesMap,
      });

      const episodeCode = resolvedEpisode.code;
      const episodeNumberValue = resolvedEpisode.episodeNumber;
      const episodeNumber =
        episodeNumberValue !== null ? String(episodeNumberValue) : "";
      const episodeTitleResolved =
        resolvedEpisode.titleResolved || episodeTitle;

      const episodeSlug = episodeCode
        ? slugify(episodeCode)
        : slugify(`${episodeTitleResolved}-${episodeNumber || index + 1}`);

      const characterSlug = slugify(displayCharacter);

      return {
        id,
        text,
        author: cleanValue(item.author),
        actor,
        character,
        displayCharacter,
        characterSlug,
        season,
        seasonSlug,
        seasonOrder,
        seasonCover: getSeasonCover(season, seasonOrder),
        episodeTitle: episodeTitleResolved,
        episodeNumber,
        episodeNumberValue,
        episodeCode,
        episodeSlug,
        episodeSortKey: resolvedEpisode.sortKey,
      };
    })
    .filter((item) => item.text);

export const buildDataIndex = (quotes = []) => {
  const charactersMap = new Map();
  const seasonsMap = new Map();
  const episodesMap = new Map();

  for (const quote of quotes) {
    if (!charactersMap.has(quote.characterSlug)) {
      charactersMap.set(quote.characterSlug, {
        slug: quote.characterSlug,
        name: quote.displayCharacter,
        actor: quote.actor,
        count: 0,
      });
    }
    charactersMap.get(quote.characterSlug).count += 1;

    if (!seasonsMap.has(quote.seasonSlug)) {
      seasonsMap.set(quote.seasonSlug, {
        slug: quote.seasonSlug,
        name: quote.season,
        order: quote.seasonOrder,
        count: 0,
        cover: quote.seasonCover,
      });
    }
    seasonsMap.get(quote.seasonSlug).count += 1;

    const episodeKey = quote.episodeCode
      ? quote.episodeCode
      : `${quote.seasonSlug}::${quote.episodeSlug}`;

    if (!episodesMap.has(episodeKey)) {
      episodesMap.set(episodeKey, {
        key: episodeKey,
        slug: quote.episodeSlug,
        code: quote.episodeCode,
        seasonSlug: quote.seasonSlug,
        season: quote.season,
        title: quote.episodeTitle,
        number: quote.episodeNumber,
        numberValue: quote.episodeNumberValue,
        sortKey: quote.episodeSortKey,
        count: 0,
      });
    }
    episodesMap.get(episodeKey).count += 1;
  }

  const characters = Array.from(charactersMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name, "fr"),
  );

  const seasons = Array.from(seasonsMap.values()).sort(
    (a, b) => a.order - b.order || a.name.localeCompare(b.name, "fr"),
  );

  const episodes = Array.from(episodesMap.values()).sort((a, b) => {
    const seasonDiff = (a.seasonSlug || "").localeCompare(
      b.seasonSlug || "",
      "fr",
    );
    if (seasonDiff !== 0) return seasonDiff;

    if (a.sortKey !== b.sortKey) return a.sortKey - b.sortKey;

    return a.title.localeCompare(b.title, "fr");
  });

  return { characters, seasons, episodes };
};

export const getRandomQuote = (quotes = []) => {
  if (!quotes.length) return null;
  return quotes[Math.floor(Math.random() * quotes.length)];
};

export const searchInQuote = (quote, search = "") => {
  const needle = cleanValue(search).toLowerCase();
  if (!needle) return true;

  return [
    quote.text,
    quote.displayCharacter,
    quote.character,
    quote.actor,
    quote.season,
    quote.episodeTitle,
    quote.episodeNumber,
    quote.episodeCode,
    quote.author,
  ]
    .join(" ")
    .toLowerCase()
    .includes(needle);
};

export { slugify, getSeasonCover, cleanValue };
