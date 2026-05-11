import { ArrowLeft, Clock3, Mail, MapPin, Phone, Star, UsersRound } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ApiClient } from "../../lib/apiClient";
import { useAuth } from "../auth/authSession";
import { mapFacilityDetail } from "./apiMapping";
import { FacilityGallery } from "./FacilityGallery";
import { FacilityDetail, FacilityDetailApiResponse } from "./types";

export function FacilityDetailsPage() {
  const { apiClient } = useAuth();
  return <FacilityDetailsPageView apiClient={apiClient} />;
}

export function FacilityDetailsPageView({ apiClient }: { apiClient: ApiClient }) {
  const { facilityId } = useParams();
  const [facility, setFacility] = useState<FacilityDetail | null>(null);
  const [status, setStatus] = useState<"error" | "loading" | "ready">("loading");

  useEffect(() => {
    let isActive = true;
    setStatus("loading");

    apiClient
      .request<FacilityDetailApiResponse>(`/facilities/${facilityId}`)
      .then((response) => {
        if (!isActive) {
          return;
        }
        setFacility(mapFacilityDetail(response));
        setStatus("ready");
      })
      .catch(() => {
        if (isActive) {
          setStatus("error");
        }
      });

    return () => {
      isActive = false;
    };
  }, [apiClient, facilityId]);

  if (status === "loading") {
    return <FacilityDetailsSkeleton />;
  }

  if (status === "error" || !facility) {
    return <FacilityDetailsError />;
  }

  return (
    <section className="grid gap-lg">
      <Link
        className="inline-flex w-fit items-center gap-sm rounded text-label-bold text-secondary underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
        to="/student/facilities"
      >
        <ArrowLeft aria-hidden="true" className="h-4 w-4" />
        Kembali ke Katalog
      </Link>

      <div className="grid gap-md">
        <div className="flex flex-col gap-md md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-label-bold uppercase text-secondary">{facility.category}</p>
            <h1 className="mt-sm max-w-4xl text-h2 text-primary-container">{facility.name}</h1>
            <div className="mt-sm flex flex-wrap gap-md text-body-md text-on-surface-variant">
              <span className="inline-flex items-center gap-xs">
                <MapPin aria-hidden="true" className="h-4 w-4 text-secondary" />
                {facility.location}
              </span>
              <span className="inline-flex items-center gap-xs">
                <Star aria-hidden="true" className="h-4 w-4 fill-tertiary-container text-tertiary" />
                {facility.ratingAverage ? facility.ratingAverage.toFixed(1) : "Belum ada rating"} ({facility.reviewCount} ulasan)
              </span>
            </div>
          </div>
          <Link className="inline-flex min-h-12 items-center justify-center rounded bg-secondary px-lg text-body-md font-bold text-secondary-on hover:bg-secondary-on-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary" to={`/student/facilities/${facility.id}/reserve/time`}>
            Reservasi Fasilitas
          </Link>
        </div>
      </div>

      <FacilityGallery facilityName={facility.name} images={facility.images} />

      <div className="grid gap-lg lg:grid-cols-[1fr_360px]">
        <div className="grid gap-lg">
          <section className="rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-control">
            <h2 className="text-h3 text-primary-container">Tentang Fasilitas</h2>
            <p className="mt-md text-body-md text-on-surface-variant">{facility.description}</p>
            <dl className="mt-lg grid gap-md sm:grid-cols-3">
              <Metric icon={<UsersRound aria-hidden="true" className="h-5 w-5" />} label="Kapasitas" value={`${facility.capacity} orang`} />
              <Metric icon={<Clock3 aria-hidden="true" className="h-5 w-5" />} label="Jam buka" value={facility.openHoursSummary} />
              <Metric icon={<Star aria-hidden="true" className="h-5 w-5" />} label="Rating" value={facility.ratingAverage ? facility.ratingAverage.toFixed(1) : "Baru"} />
            </dl>
          </section>

          <section className="rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-control">
            <h2 className="text-h3 text-primary-container">Ulasan Peminjam</h2>
            {facility.reviews.length ? (
              <div className="mt-md grid gap-md">
                {facility.reviews.map((review) => (
                  <article className="rounded border border-outline-variant bg-surface-container-low p-md" key={review.id}>
                    <div className="flex items-center justify-between gap-md">
                      <h3 className="text-body-md font-bold text-primary-container">{review.authorName}</h3>
                      <p className="inline-flex items-center gap-xs text-label-bold text-tertiary">
                        <Star aria-hidden="true" className="h-4 w-4 fill-tertiary-container" />
                        {review.rating}
                      </p>
                    </div>
                    <p className="mt-sm text-body-md text-on-surface-variant">{review.comment ?? "Tidak ada komentar tertulis."}</p>
                  </article>
                ))}
              </div>
            ) : (
              <p className="mt-md rounded bg-surface-container p-md text-body-md text-on-surface-variant">
                Belum ada ulasan publik untuk fasilitas ini.
              </p>
            )}
          </section>
        </div>

        <aside className="h-fit rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-control lg:sticky lg:top-28">
          <p className="text-label-bold uppercase text-secondary">Ringkasan Reservasi</p>
          <p className="mt-sm text-h3 text-primary-container">{facility.price.summary}</p>
          <p className="mt-sm text-body-md text-on-surface-variant">
            Pastikan jadwal kegiatan sesuai jam buka sebelum melanjutkan ke pemilihan waktu.
          </p>
          <dl className="mt-lg grid gap-md border-y border-outline-variant py-md">
            <div>
              <dt className="text-label-bold text-primary-container">Kontak pengelola</dt>
              <dd className="mt-xs text-body-md text-on-surface-variant">{facility.contact.name}</dd>
            </div>
            <div className="flex items-center gap-sm text-body-md text-on-surface-variant">
              <Phone aria-hidden="true" className="h-4 w-4 text-secondary" />
              {facility.contact.phone}
            </div>
            {facility.contact.email ? (
              <div className="flex items-center gap-sm text-body-md text-on-surface-variant">
                <Mail aria-hidden="true" className="h-4 w-4 text-secondary" />
                {facility.contact.email}
              </div>
            ) : null}
          </dl>
          <Link className="mt-lg block" to={`/student/facilities/${facility.id}/reserve/time`}>
            <span className="inline-flex min-h-12 w-full items-center justify-center rounded bg-secondary px-lg text-body-md font-bold text-secondary-on hover:bg-secondary-on-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary">
              Reservasi Fasilitas
            </span>
          </Link>
        </aside>
      </div>
    </section>
  );
}

function FacilityDetailsSkeleton() {
  return (
    <section className="grid gap-lg" role="status">
      <div className="h-5 w-40 animate-pulse rounded bg-surface-container-high" />
      <div className="grid gap-sm">
        <div className="h-5 w-28 animate-pulse rounded bg-surface-container-high" />
        <div className="h-10 w-80 max-w-full animate-pulse rounded bg-surface-container-high" />
      </div>
      <div className="grid gap-sm md:grid-cols-[1.45fr_0.55fr]">
        <div className="min-h-96 animate-pulse rounded bg-surface-container-high" />
        <div className="grid grid-cols-2 gap-sm md:grid-cols-1">
          <div className="min-h-44 animate-pulse rounded bg-surface-container" />
          <div className="min-h-44 animate-pulse rounded bg-surface-container" />
        </div>
      </div>
      <span className="sr-only">Memuat detail fasilitas...</span>
    </section>
  );
}

function FacilityDetailsError() {
  return (
    <section className="grid min-h-72 place-items-center rounded-lg border border-error bg-error-container p-lg text-center shadow-control">
      <div className="grid max-w-md justify-items-center gap-md">
        <h1 className="text-h3 text-error-on-container">Fasilitas tidak ditemukan</h1>
        <p className="text-body-md text-error-on-container">Buka kembali katalog untuk memilih fasilitas aktif yang tersedia.</p>
        <Link className="inline-flex min-h-11 items-center justify-center rounded bg-error px-lg text-label-bold text-error-on focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary" to="/student/facilities">
          Kembali ke Katalog
        </Link>
      </div>
    </section>
  );
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded bg-surface-container-low p-md">
      <dt className="flex items-center gap-sm text-label-bold text-secondary">
        {icon}
        {label}
      </dt>
      <dd className="mt-xs text-body-md font-bold text-primary-container">{value}</dd>
    </div>
  );
}
