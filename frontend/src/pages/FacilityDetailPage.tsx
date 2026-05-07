import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, type ApiError } from "../lib/api-client";
import type { FacilityDetail, FacilityImage } from "../lib/types";

function pickCoverIndex(images: FacilityImage[]): number {
  if (images.length === 0) return -1;
  const explicit = images.findIndex((img) => img.is_cover);
  return explicit === -1 ? 0 : explicit;
}

export function FacilityDetailPage() {
  const { facilityId } = useParams<{ facilityId: string }>();
  const navigate = useNavigate();

  const { data, isPending, error } = useQuery<FacilityDetail, ApiError>({
    queryKey: ["facility-detail", facilityId],
    queryFn: () => apiGet<FacilityDetail>(`/facilities/${facilityId}`),
    retry: false,
    enabled: Boolean(facilityId),
  });

  if (isPending) {
    return <p className="text-text-secondary">Memuat detail fasilitas…</p>;
  }

  if (error) {
    if (error.status === 404) {
      return (
        <p className="text-text-secondary">
          {error.detail || "Fasilitas tidak ditemukan."}
        </p>
      );
    }
    return (
      <p
        role="alert"
        className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800"
      >
        {error.detail || "Gagal memuat detail fasilitas."}
      </p>
    );
  }

  if (!data) return null;

  const coverIndex = pickCoverIndex(data.images);
  const cover = coverIndex === -1 ? null : data.images[coverIndex];
  const otherImages = data.images.filter((_, i) => i !== coverIndex);

  return (
    <article className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">{data.name}</h2>
        <p className="text-text-secondary">{data.location}</p>
        <p className="text-sm text-text-secondary">
          {data.category} · Kapasitas {data.capacity} orang
        </p>
      </header>

      {cover && (
        <img
          src={cover.url}
          alt={cover.alt_text}
          className="h-72 w-full rounded-lg object-cover"
        />
      )}

      <section className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">Deskripsi</h3>
        <p className="text-text-secondary">{data.description}</p>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">Jam Operasional</h3>
        <p className="text-text-secondary">{data.open_hours_summary}</p>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">Biaya</h3>
        <p className="text-text-secondary">{data.price.summary}</p>
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">Kontak</h3>
        <p className="text-text-secondary">{data.contact.name}</p>
        <p className="text-text-secondary">{data.contact.phone}</p>
        {data.contact.email && (
          <p className="text-text-secondary">{data.contact.email}</p>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">Ulasan</h3>
        <p className="text-text-secondary">
          {data.review_summary.rating_average !== null
            ? `Rating ${data.review_summary.rating_average.toFixed(1)} dari ${data.review_summary.review_count} ulasan`
            : `Belum ada ulasan (${data.review_summary.review_count})`}
        </p>
      </section>

      {otherImages.length > 0 && (
        <section className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold">Galeri</h3>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {otherImages.map((img) => (
              <li key={img.url}>
                <img
                  src={img.url}
                  alt={img.alt_text}
                  className="h-40 w-full rounded object-cover"
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      <div>
        <button
          type="button"
          onClick={() =>
            navigate(`/student/facilities/${facilityId}/reserve/time`)
          }
          className="rounded bg-primary px-6 py-3 font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          Reservasi
        </button>
      </div>
    </article>
  );
}
