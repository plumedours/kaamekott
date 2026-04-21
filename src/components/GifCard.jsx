import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ClipboardDocumentListIcon,
  ClipboardDocumentCheckIcon,
  ShareIcon,
  UserIcon,
  FilmIcon,
  TagIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

function MetaRow({ icon: Icon, children }) {
  return (
    <div className="flex items-start gap-2 text-sm text-slate-600">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
      <div>{children}</div>
    </div>
  );
}

export default function GifCard({ gif }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);

  const pageUrl = `${window.location.origin}${import.meta.env.BASE_URL}#/gif/${gif.slug}`;

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

  return (
    <article className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-xl">
      <Link to={`/gif/${gif.slug}`} className="block">
        <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
          <img
            src={gif.imageUrl}
            alt={gif.quote}
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 hover:scale-[1.01]"
          />

          <div className="absolute left-4 top-4 inline-flex items-center rounded-full bg-slate-950/65 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            GIF
          </div>
        </div>
      </Link>

      <div className="border-b border-slate-100 px-6 py-5">
        <Link to={`/gif/${gif.slug}`} className="block">
          <p className="text-lg font-semibold leading-8 text-slate-900 transition hover:text-emerald-700">
            “{gif.quote}”
          </p>
        </Link>
      </div>

      <div className="space-y-3 px-6 py-5">
        <MetaRow icon={UserIcon}>
          <span className="font-medium text-slate-800">
            {gif.primaryCharacter}
          </span>
          {gif.characters.length > 1 ? (
            <span className="ml-1 text-slate-500">
              · Avec{" "}
              {gif.characters
                .filter((name) => name !== gif.primaryCharacter)
                .join(", ")}
            </span>
          ) : null}
        </MetaRow>

        <MetaRow icon={FilmIcon}>
          {gif.displayEpisode}
          {gif.episode ? (
            <span className="ml-1 text-slate-400">· {gif.episode}</span>
          ) : null}
        </MetaRow>

        <MetaRow icon={TagIcon}>
          <span className="break-all">{gif.filename}</span>
        </MetaRow>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
        <button
          type="button"
          onClick={copyPageLink}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
        >
          <ClipboardDocumentListIcon className="h-4 w-4" />
          {copiedLink ? "Lien copié" : "Copier le lien"}
        </button>

        <button
          type="button"
          onClick={copyGifImage}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
        >
          <ClipboardDocumentCheckIcon className="h-4 w-4" />
          {copiedImage ? "Image copiée" : "Copier l'image"}
        </button>

        <button
          type="button"
          onClick={shareGif}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
        >
          <ShareIcon className="h-4 w-4" />
          Partager
        </button>

        <a
          href={gif.imageUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-300 hover:text-emerald-700"
        >
          <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          Ouvrir
        </a>
      </div>
    </article>
  );
}
