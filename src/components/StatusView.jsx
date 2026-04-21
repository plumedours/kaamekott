export default function StatusView({ title, message }) {
  return (
    <div className="mx-auto flex min-h-[40vh] max-w-3xl items-center justify-center px-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-3 text-slate-600">{message}</p>
      </div>
    </div>
  );
}
