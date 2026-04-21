import {
  ArrowTopRightOnSquareIcon,
  CodeBracketIcon,
  PhotoIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import ScrollToTopButton from "../components/ScrollToTopButton";

function ExternalLinkCard({ title, href, description, icon: Icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group block rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <h3 className="font-semibold text-slate-900 group-hover:text-emerald-700">
            {title}
          </h3>
          <p className="mt-1 text-sm text-slate-600 leading-6">{description}</p>

          <div className="mt-3 flex items-center gap-2 text-sm font-medium text-emerald-700">
            Ouvrir
            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
          </div>
        </div>
      </div>
    </a>
  );
}

export default function AboutPage() {
  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="p-8 sm:p-10">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-600">
              À propos
            </p>

            <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Kaamekott
            </h1>

            <p className="mt-4 max-w-2xl text-slate-600 leading-7">
              Un site dédié aux meilleures répliques de Kaamelott. Les phrases
              cultes, les punchlines, les moments absurdes… tout ce qu’il faut
              pour se replonger dans ce joyeux bordel.
            </p>

            <p className="mt-4 max-w-2xl text-slate-600 leading-7">
              Tu cherches une réplique précise, un personnage, ou juste un truc
              à balancer dans une conversation ? Tu fouilles, tu trouves, et
              normalement ça fait mouche.
            </p>
          </div>
        </div>

        {/* 🔹 CRÉDITS */}
        <div className="mt-12">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-900">Crédits</h2>
            <p className="mt-1 text-sm text-slate-500">
              Les sources et projets qui ont servi de base pour construire ce
              site.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <ExternalLinkCard
              title="API Kaamelott (citations)"
              href="https://github.com/sin0light/api-kaamelott"
              icon={ChatBubbleLeftRightIcon}
              description="Projet d’origine utilisé comme base pour récupérer et structurer les citations."
            />

            <ExternalLinkCard
              title="Kaamelott Gifboard (repo)"
              href="https://github.com/kaamelott-gifboard/kaamelott-gifboard"
              icon={CodeBracketIcon}
              description="Source principale utilisée pour constituer la base de GIF, ensuite adaptée pour le site."
            />

            <ExternalLinkCard
              title="Kaamelott Gifboard (site)"
              href="https://kaamelott-gifboard.fr/"
              icon={PhotoIcon}
              description="Le site d’origine dédié aux GIF Kaamelott. Allez voir, c’est pas du travail de bouseux."
            />
          </div>
        </div>

        {/* 🔹 AUTEUR */}
        <div className="mt-12">
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-slate-900">
              À propos de l’auteur
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Si tu veux voir d’autres projets ou jeter un œil derrière le
              rideau.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            <ExternalLinkCard
              title="Portfolio"
              href="https://plumedours.github.io/portfolio/"
              icon={UserCircleIcon}
              description="D’autres projets, d’autres idées, et parfois des trucs un peu plus sérieux. Mais pas toujours."
            />

            <ExternalLinkCard
              title="GitHub"
              href="https://github.com/plumedours"
              icon={CodeBracketIcon}
              description="Le code, les expérimentations, et probablement quelques trucs bancals. Mais assumés."
            />

            <ExternalLinkCard
              title="Signaler / Contribuer"
              href="https://forms.gle/iLDJtXWebEf4ZVDm6"
              icon={UserCircleIcon}
              description="Si t’as repéré une connerie ou que t’as mieux à proposer, c’est ici. On trie, on vérifie… et on essaye de garder un minimum de tenue."
            />
          </div>
        </div>
      </section>

      <ScrollToTopButton />
    </>
  );
}
