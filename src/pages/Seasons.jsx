import { Link } from "react-router-dom";
import ScrollToTopButton from "../components/ScrollToTopButton";
import StatusView from "../components/StatusView";
import { useQuotesData } from "../lib/useQuotesData";

export default function SeasonsPage() {
  const { seasons, loading, error } = useQuotesData();

  if (loading) {
    return (
      <StatusView
        title="Chargement"
        message="On range les livres sur l’étagère…"
      />
    );
  }

  if (error) {
    return <StatusView title="Erreur" message={error} />;
  }

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="p-8 sm:p-10">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-600">
              Navigation
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Livres et films
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Toutes les citations classées par livre et par film. Pour
              retrouver facilement une saison… et les conneries qui vont avec.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {seasons.map((season) => (
            <Link
              key={season.slug}
              to={`/season/${season.slug}`}
              className="group overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={season.cover}
                  alt={season.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.04]"
                  onError={(event) => {
                    event.currentTarget.src = `${import.meta.env.BASE_URL}unknown.png`;
                  }}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-slate-900/10 to-transparent" />

                {/* <div className="absolute left-5 top-5">
                  <div className="inline-flex h-12 min-w-[48px] items-center justify-center rounded-xl border border-white/15 bg-black/45 text-xs font-bold text-white shadow-lg backdrop-blur-md">
                    {season.order === 0 ? "P" : season.order}
                  </div>
                </div> */}

                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="inline-flex max-w-full flex-col rounded-xl border border-white/10 bg-black/45 px-3 py-2 text-white shadow-lg backdrop-blur-md transition duration-200 group-hover:bg-black/55">
                    <h2 className="truncate text-base font-bold leading-tight">
                      {season.name}
                    </h2>
                    <p className="mt-1 text-xs font-medium text-white/80">
                      {season.count} citation{season.count > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <ScrollToTopButton />
    </>
  );
}
