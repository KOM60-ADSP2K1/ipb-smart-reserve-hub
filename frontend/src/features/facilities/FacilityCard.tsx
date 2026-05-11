import { Building2, MapPin, Star, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
import { FacilityCatalogItem } from "./types";
import { FacilityImage } from "./FacilityImage";

type FacilityCardProps = {
  facility: FacilityCatalogItem;
  variant?: "catalog" | "featured";
};

export function FacilityCard({ facility, variant = "catalog" }: FacilityCardProps) {
  return (
    <article className="group relative grid h-full overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest shadow-control transition-shadow hover:shadow-ambient">
      <FacilityImage
        alt={`${facility.name}, ${facility.category}`}
        facilityName={facility.name}
        src={facility.coverImageUrl}
        variant="card"
      />
      <div className="grid gap-md p-md">
        <div className="grid gap-sm">
          <div className="flex flex-wrap items-center gap-sm">
            <span className="inline-flex min-h-7 items-center gap-xs rounded-full bg-secondary-container px-sm text-label-sm font-bold text-secondary-on-container">
              <Building2 aria-hidden="true" className="h-3.5 w-3.5" />
              {facility.category}
            </span>
            <span className="inline-flex min-h-7 items-center gap-xs rounded-full bg-surface-container px-sm text-label-sm text-on-surface-variant">
              <Star aria-hidden="true" className="h-3.5 w-3.5 fill-tertiary-container text-tertiary" />
              {facility.ratingAverage ? facility.ratingAverage.toFixed(1) : "Baru"} ({facility.reviewCount})
            </span>
          </div>
          <h2 className={variant === "featured" ? "text-h3 text-primary-container" : "text-body-lg font-bold text-primary-container"}>
            <Link
              className="rounded underline-offset-4 after:absolute after:inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary group-hover:underline"
              to={`/student/facilities/${facility.id}`}
            >
              {facility.name}
            </Link>
          </h2>
          <p className="line-clamp-2 min-h-12 text-body-md text-on-surface-variant">{facility.openHoursSummary}</p>
        </div>
        <dl className="grid gap-sm border-t border-outline-variant pt-md text-label-bold text-primary-container">
          <div className="flex items-center gap-sm">
            <MapPin aria-hidden="true" className="h-4 w-4 text-secondary" />
            <dt className="sr-only">Lokasi</dt>
            <dd className="min-w-0 truncate">{facility.location}</dd>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-sm">
            <div className="flex items-center gap-sm">
              <UsersRound aria-hidden="true" className="h-4 w-4 text-secondary" />
              <dt className="sr-only">Kapasitas</dt>
              <dd>{facility.capacity} orang</dd>
            </div>
            <div>
              <dt className="sr-only">Biaya</dt>
              <dd className="text-right text-secondary">{facility.priceSummary}</dd>
            </div>
          </div>
        </dl>
      </div>
    </article>
  );
}
