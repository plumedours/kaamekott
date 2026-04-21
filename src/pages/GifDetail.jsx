import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
  ShareIcon,
  UserIcon,
  FilmIcon,
  TagIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import ScrollToTopButton from "../components/ScrollToTopButton";
import StatusView from "../components/StatusView";
import GifCard from "../components/GifCard";
import { useGifsData } from "../lib/useGifsData";

function MetaRow({ icon: Icon, label, children }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">{label}</p>
          <div className="mt-1 text-sm leading-7 text-slate-600">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GifDetailPage() {
  const { slug } = useParams();
  const { gifs, loading, error } = useGifsData();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);

  const gif = useMemo(
    () => gifs.find((item) => item.slug === slug),
    [gifs, slug],
  );

  const relatedGifs = useMemo(() => {
    if (!gif) return [];

    return gifs
      .filter((item) => item.slug !== gif.slug)
      .filter((item) => {
        const sameEpisode = gif.episode && item.episode === gif.episode;
        const sharedCharacter = item.characters.some((name) =>
          gif.characters.includes(name),
        );
        return sameEpisode || sharedCharacter;
      })
      .slice(0, 6);
  }, [gifs, gif]);

  const pageUrl = `${window.location.origin}${import.meta.env.BASE_URL}#/gif/${slug}`;

  const copyPageLink = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 1500);
    } catch {
      window.alert("Impossible de copier le lien.");
    }
  };

  const copyGifImage = async () => {
    try {
      if (!navigator.clipboard || typeof ClipboardItem === "undefined") {
        throw new Error("Clipboard image API indisponible");
      }

      const response = await fetch(gif.imageUrl, { mode: "cors" });
      if (!response.ok) {
        throw new Error("Impossible de récupérer le GIF");
      }

      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);

      setCopiedImage(true);
      window.setTimeout(() => setCopiedImage(false), 1500);
    } catch {
      window.alert(
        "La copie directe du GIF n'est pas supportée sur ce navigateur. Utilise le lien ou le partage.",
      );
    }
  };

  const shareGif = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: gif.quote,
          text: `Un GIF Kaamelott : ${gif.quote}`,
          url: pageUrl,
        });
        return;
      }

      await navigator.clipboard.writeText(pageUrl);
      window.alert("Lien copié pour le partage.");
    } catch {
      // annulation utilisateur ou erreur silencieuse
    }
  };

  if (loading) {
    return (
      <StatusView
        title="Chargement"
        message="On va chercher le GIF. Pas la peine d’hurler."
      />
    );
  }

  if (error) {
    return <StatusView title="Erreur" message={error} />;
  }

  if (!gif) {
    return (
      <StatusView
        title="Introuvable"
        message="Ce GIF n’existe pas ou plus dans le fichier."
      />
    );
  }

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            to="/gifs"
            className="text-sm font-medium text-emerald-700 transition hover:text-emerald-900"
          >
            ← Retour aux GIF
          </Link>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
            <div className="relative aspect-video overflow-hidden bg-slate-100">
              <img
                src={gif.imageUrl}
                alt={gif.quote}
                className="h-full w-full object-cover"
              />

              <div className="absolute left-5 top-5 inline-flex items-center rounded-full bg-slate-950/65 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                GIF
              </div>
            </div>

            <div className="border-t border-slate-100 px-6 py-6 sm:px-8">
              <p className="text-2xl font-bold leading-10 text-slate-900 sm:text-3xl">
                “{gif.quote}”
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={copyPageLink}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                >
                  <ClipboardDocumentListIcon className="h-4 w-4" />
                  {copiedLink ? "Lien copié" : "Copier le lien"}
                </button>

                <button
                  type="button"
                  onClick={copyGifImage}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                >
                  <ClipboardDocumentCheckIcon className="h-4 w-4" />
                  {copiedImage ? "Image copiée" : "Copier l'image"}
                </button>

                <button
                  type="button"
                  onClick={shareGif}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                >
                  <ShareIcon className="h-4 w-4" />
                  Partager
                </button>

                <a
                  href={gif.imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
                >
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  Ouvrir le fichier
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <MetaRow icon={UserIcon} label="Personnages">
              <div className="flex flex-wrap gap-2">
                {gif.characters.map((character) => (
                  <Link
                    key={character}
                    to={`/characters`}
                    className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
                  >
                    {character}
                  </Link>
                ))}
              </div>
            </MetaRow>

            <MetaRow icon={FilmIcon} label="Épisode">
              {gif.displayEpisode}
              {gif.episode ? (
                <span className="ml-1 text-slate-400">· {gif.episode}</span>
              ) : null}
            </MetaRow>

            <MetaRow icon={TagIcon} label="Fichier">
              <span className="break-all">{gif.filename}</span>
            </MetaRow>

            <div className="rounded-[1.5rem] border border-emerald-100 bg-emerald-50/70 p-5">
              <p className="text-sm font-semibold text-slate-900">
                Petit rappel utile
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                Ici, “copier le lien” partage la page du GIF sur le site.
                “Copier l’image” tente de mettre directement le GIF dans le
                presse-papiers, pour le coller ensuite dans une conversation ou
                un outil compatible.
              </p>
            </div>
          </div>
        </div>

        {relatedGifs.length > 0 ? (
          <div className="mt-12">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-slate-900">
                GIF associés
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Du même épisode ou avec au moins un personnage en commun.
              </p>
            </div>

            <div className="gif-grid">
              {relatedGifs.map((item) => (
                <GifCard key={item.id} gif={item} />
              ))}
            </div>
          </div>
        ) : null}
      </section>

      <ScrollToTopButton />
    </>
  );
}
