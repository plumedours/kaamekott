import { useRef } from "react";
import html2canvas from "html2canvas";
import {
  ArrowDownTrayIcon,
  ClipboardIcon,
  ShareIcon,
  UserIcon,
  MicrophoneIcon,
  PencilSquareIcon,
  FilmIcon,
  HashtagIcon,
} from "@heroicons/react/24/outline";

const actionButtonClass =
  "rounded-full border border-slate-200 bg-white p-2.5 text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700 hover:shadow-sm";

function MetaRow({ icon: Icon, children, onClick, strong = false }) {
  const content = (
    <span
      className={[
        "flex items-start gap-2 text-sm",
        strong ? "font-semibold text-slate-800" : "text-slate-600",
      ].join(" ")}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
      <span>{children}</span>
    </span>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left transition hover:text-emerald-700"
      >
        {content}
      </button>
    );
  }

  return content;
}

export default function QuoteCard({
  quote,
  onCharacterClick,
  onSeasonClick,
  onEpisodeClick,
  className = "",
  featured = false,
}) {
  const cardRef = useRef(null);

  const buildCanvas = async () => {
    if (!cardRef.current) return null;

    const clone = cardRef.current.cloneNode(true);
    clone.style.position = "fixed";
    clone.style.left = "-9999px";
    clone.style.top = "0";
    clone.style.width = `${cardRef.current.offsetWidth}px`;

    clone.querySelectorAll('[data-export-hidden="true"]').forEach((element) => {
      element.remove();
    });

    document.body.appendChild(clone);
    const canvas = await html2canvas(clone, {
      backgroundColor: "#f8fafc",
      scale: 2,
    });
    document.body.removeChild(clone);
    return canvas;
  };

  const downloadImage = async () => {
    const canvas = await buildCanvas();
    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `citation-${quote.id}.png`;
    link.click();
  };

  const copyImage = async () => {
    if (!navigator.clipboard || typeof ClipboardItem === "undefined") {
      window.alert("La copie d'image n'est pas supportée sur ce navigateur.");
      return;
    }

    const canvas = await buildCanvas();
    if (!canvas) return;

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );
    if (!blob) return;

    await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
    window.alert("Image copiée dans le presse-papier.");
  };

  const shareImage = async () => {
    const canvas = await buildCanvas();
    if (!canvas) return;

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/png"),
    );
    if (!blob) return;

    const file = new File([blob], `citation-${quote.id}.png`, {
      type: "image/png",
    });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        title: "Citation Kaamelott",
        text: "Voici une citation de Kaamelott.",
        files: [file],
      });
      return;
    }

    await copyImage();
  };

  const shownCharacter =
    quote.character || quote.displayCharacter || quote.actor || "Inconnu";

  return (
    <article
      ref={cardRef}
      className={[
        "quote-card-item group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-xl",
        featured ? "quote-card-featured" : "",
        className,
      ].join(" ")}
    >
      <div className="border-b border-slate-100 px-6 py-5">
        <div className="flex items-start justify-between gap-4">
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700">
            {quote.season}
          </span>

          <span className="text-xs font-medium text-slate-400">
            {quote.episodeNumber
              ? `Épisode ${quote.episodeNumber}`
              : "Sans numéro"}
          </span>
        </div>

        <blockquote
          className={[
            "mt-4 text-slate-900",
            featured
              ? "text-xl leading-10 sm:text-2xl"
              : "text-[1.02rem] leading-8",
          ].join(" ")}
        >
          <span className="mr-1 text-emerald-600">“</span>
          {quote.text}
          <span className="ml-1 text-emerald-600">”</span>
        </blockquote>
      </div>

      <div className="space-y-3 px-6 py-5">
        <MetaRow icon={UserIcon} onClick={onCharacterClick} strong>
          {shownCharacter}
        </MetaRow>

        {quote.actor ? (
          <MetaRow icon={MicrophoneIcon}>Acteur : {quote.actor}</MetaRow>
        ) : null}

        {quote.author ? (
          <MetaRow icon={PencilSquareIcon}>Auteur : {quote.author}</MetaRow>
        ) : null}

        <MetaRow icon={FilmIcon} onClick={onEpisodeClick}>
          {quote.episodeTitle}
          {quote.episodeNumber ? ` · Épisode ${quote.episodeNumber}` : ""}
        </MetaRow>

        <MetaRow icon={HashtagIcon} onClick={onSeasonClick}>
          {quote.season}
        </MetaRow>
      </div>

      <div
        data-export-hidden="true"
        className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4"
      >
        <button
          type="button"
          onClick={copyImage}
          className={actionButtonClass}
          aria-label="Copier l'image"
        >
          <ClipboardIcon className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={shareImage}
          className={actionButtonClass}
          aria-label="Partager l'image"
        >
          <ShareIcon className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={downloadImage}
          className={actionButtonClass}
          aria-label="Télécharger l'image"
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
        </button>
      </div>
    </article>
  );
}
