export function StackReadyPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-surface px-6 text-on-surface">
      <section className="max-w-xl rounded-lg border border-outline-variant bg-surface-container-lowest p-8 shadow-emerald-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.05em] text-on-surface-variant">
          Technical setup
        </p>
        <h1 className="mt-3 text-3xl font-bold">IPB Smart Reserve Hub frontend is ready.</h1>
        <p className="mt-4 text-base leading-7 text-on-surface-variant">
          This placeholder verifies the frontend stack only. Product screens are planned in docs and will be
          implemented separately.
        </p>
      </section>
    </main>
  );
}
