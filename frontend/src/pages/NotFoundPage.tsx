import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8fafc] px-6 py-12 text-[#111827]">
      <section className="w-full max-w-[520px] rounded-xl border border-[#e5e7eb] bg-white p-8 text-center shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)]">
        <p className="m-0 text-sm font-bold uppercase tracking-[0.08em] text-[#0f9d58]">404</p>
        <h1 className="m-0 mt-3 text-[32px] font-bold leading-tight max-md:text-[28px]">
          Halaman tidak ditemukan
        </h1>
        <p className="m-0 mt-3 text-sm leading-6 text-[#6b7280]">
          Rute yang dibuka tidak tersedia di IPB Smart Reserve Hub.
        </p>
        <Link
          className="mt-7 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#0f9d58] px-5 text-sm font-bold text-white no-underline"
          to="/login"
        >
          Kembali ke login
        </Link>
      </section>
    </main>
  );
}
