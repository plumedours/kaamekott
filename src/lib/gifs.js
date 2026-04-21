const cleanValue = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

const slugify = (value = "") =>
  cleanValue(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

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

const parseEpisodeParts = (episode = "") => {
  const raw = cleanValue(episode).toUpperCase();
  const match = raw.match(/^S(\d{1,2})E(\d{1,3})$/);

  if (!match) {
    return {
      seasonNumber: null,
      episodeNumber: null,
      seasonLabel: "",
      episodeShortLabel: raw || "Épisode inconnu",
      sortKey: 999999,
    };
  }

  const seasonNumber = Number.parseInt(match[1], 10);
  const episodeNumber = Number.parseInt(match[2], 10);

  return {
    seasonNumber,
    episodeNumber,
    seasonLabel:
      seasonNumber === 0 ? "Pilote" : `Livre ${toRoman(seasonNumber)}`,
    episodeShortLabel: `Épisode ${episodeNumber}`,
    sortKey: seasonNumber * 1000 + episodeNumber,
  };
};

export const normalizeGifs = (rawItems = [], episodesMap = new Map()) =>
  rawItems
    .map((item, index) => {
      const quote = cleanValue(item.quote);
      const filename = cleanValue(item.filename);
      const slug =
        cleanValue(item.slug) ||
        slugify(filename || quote || `gif-${index + 1}`);
      const episode = cleanValue(item.episode).toUpperCase();

      const characters = Array.isArray(item.characters)
        ? item.characters.map(cleanValue).filter(Boolean)
        : [];

      const charactersSpeaking = Array.isArray(item.characters_speaking)
        ? item.characters_speaking.map(cleanValue).filter(Boolean)
        : [];

      const primaryCharacter =
        charactersSpeaking[0] || characters[0] || "Personnage inconnu";

      const episodeInfo = parseEpisodeParts(episode);
      const episodeTitle = episode
        ? cleanValue(episodesMap.get(episode)?.title)
        : "";

      const displayEpisode =
        episode && episodeTitle
          ? `${episodeInfo.seasonLabel} · ${episodeTitle}`
          : episode && episodeInfo.seasonLabel
            ? `${episodeInfo.seasonLabel} · ${episodeInfo.episodeShortLabel}`
            : "Épisode non renseigné";

      return {
        id: slug || `gif-${index + 1}`,
        quote: quote || filename || `GIF ${index + 1}`,
        filename,
        slug,
        episode,
        episodeTitle,
        displayEpisode,
        episodeShortLabel: episodeInfo.episodeShortLabel,
        seasonLabel: episodeInfo.seasonLabel,
        episodeSortKey: episodeInfo.sortKey,
        seasonNumber: episodeInfo.seasonNumber,
        episodeNumber: episodeInfo.episodeNumber,
        characters,
        charactersSpeaking,
        primaryCharacter,
        imageUrl: `${import.meta.env.BASE_URL}gifs/${filename}`,
        searchText: [
          quote,
          filename,
          slug,
          episode,
          episodeTitle,
          displayEpisode,
          ...characters,
          ...charactersSpeaking,
        ]
          .join(" ")
          .toLowerCase(),
      };
    })
    .filter((item) => item.filename);

export const buildGifIndex = (gifs = []) => {
  const characterMap = new Map();
  const episodeMap = new Map();

  for (const gif of gifs) {
    for (const character of gif.characters) {
      const key = slugify(character);
      if (!characterMap.has(key)) {
        characterMap.set(key, { slug: key, name: character, count: 0 });
      }
      characterMap.get(key).count += 1;
    }

    if (gif.episode) {
      if (!episodeMap.has(gif.episode)) {
        episodeMap.set(gif.episode, {
          code: gif.episode,
          label: gif.displayEpisode,
          title: gif.episodeTitle,
          seasonLabel: gif.seasonLabel,
          sortKey: gif.episodeSortKey,
          count: 0,
        });
      }
      episodeMap.get(gif.episode).count += 1;
    }
  }

  const characters = Array.from(characterMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name, "fr"),
  );

  const episodes = Array.from(episodeMap.values()).sort(
    (a, b) => a.sortKey - b.sortKey || a.label.localeCompare(b.label, "fr"),
  );

  return { characters, episodes };
};

export const buildEpisodesMap = (rawEpisodes = []) => {
  const map = new Map();

  for (const item of rawEpisodes) {
    const code = cleanValue(item.code).toUpperCase();
    const title = cleanValue(item.title);

    if (!code) continue;
    map.set(code, { code, title });
  }

  return map;
};

export const searchInGif = (gif, search = "") => {
  const needle = cleanValue(search).toLowerCase();
  if (!needle) return true;
  return gif.searchText.includes(needle);
};

export { cleanValue, slugify };
