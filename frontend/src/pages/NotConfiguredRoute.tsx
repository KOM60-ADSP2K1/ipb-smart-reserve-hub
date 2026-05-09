export function NotConfiguredRoute() {
  return (
    <main className="grid min-h-screen place-items-center bg-surface px-6 text-on-surface">
      <section className="max-w-lg rounded-lg border border-outline-variant bg-surface-container-lowest p-8 shadow-emerald-sm">
        <h1 className="text-2xl font-bold">Route not configured.</h1>
        <p className="mt-3 text-base leading-7 text-on-surface-variant">
          Product routes will be added when their design or integration slice starts.
        </p>
      </section>
    </main>
  );
}
