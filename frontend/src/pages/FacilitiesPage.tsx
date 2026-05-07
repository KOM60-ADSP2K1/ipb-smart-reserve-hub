import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { apiGet, type ApiError } from "../lib/api-client";
import type { FacilityCatalogItem } from "../lib/types";

function matchesSearch(facility: FacilityCatalogItem, query: string): boolean {
  if (!query) return true;
  const haystack =
    `${facility.name} ${facility.location} ${facility.category}`.toLowerCase();
  return haystack.includes(query.toLowerCase());
}

export function FacilitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isPending, error } = useQuery<FacilityCatalogItem[], ApiError>({
    queryKey: ["facilities"],
    queryFn: () => apiGet<FacilityCatalogItem[]>("/facilities"),
    retry: false,
  });

  const filtered = useMemo(
    () => (data ?? []).filter((f) => matchesSearch(f, searchQuery.trim())),
    [data, searchQuery],
  );

  return (
    <div>
      <h2 className="text-xl font-bold">Fasilitas</h2>
      {isPending && (
        <p className="mt-2 text-text-secondary">Memuat fasilitas…</p>
      )}
      {error && (
        <p
          role="alert"
          className="mt-2 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800"
        >
          {error.detail ?? "Gagal memuat fasilitas."}
        </p>
      )}
      {data && data.length === 0 && (
        <p className="mt-2 text-text-secondary">
          Belum ada fasilitas yang tersedia.
        </p>
      )}
      {data && data.length > 0 && (
        <label className="mt-4 block">
          <span className="sr-only">Cari fasilitas</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Cari berdasarkan nama, lokasi, atau kategori"
            aria-label="Cari fasilitas"
            className="w-full rounded border border-border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>
      )}
      {data && data.length > 0 && filtered.length === 0 && (
        <p className="mt-4 text-text-secondary">
          Tidak ada fasilitas yang cocok dengan pencarian Anda.
        </p>
      )}
      {data && filtered.length > 0 && (
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((facility) => (
            <li key={facility.id}>
              <article className="relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-white shadow-sm focus-within:ring-2 focus-within:ring-primary">
                {facility.cover_image_url && (
                  <img
                    src={facility.cover_image_url}
                    alt={facility.name}
                    className="h-40 w-full object-cover"
                  />
                )}
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <h3 className="text-lg font-semibold">
                    <Link
                      to={`/student/facilities/${facility.id}`}
                      className="after:absolute after:inset-0"
                    >
                      {facility.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-text-secondary">
                    {facility.location}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {facility.category} · Kapasitas {facility.capacity}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {facility.open_hours_summary}
                  </p>
                  <p className="mt-auto text-sm font-medium">
                    {facility.price_summary}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
