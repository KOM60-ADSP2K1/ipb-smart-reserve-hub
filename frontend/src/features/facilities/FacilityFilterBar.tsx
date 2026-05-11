import { FormEvent, useEffect, useState } from "react";
import { RotateCcw, Search } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { FacilityCategoryOption, FacilityFilterValues, FacilitySort } from "./types";

type FacilityFilterBarProps = {
  categoryError?: string;
  categoryLoading?: boolean;
  categories: FacilityCategoryOption[];
  errors?: Partial<Record<keyof FacilityFilterValues, string>>;
  onReset: () => void;
  onSubmit: (values: FacilityFilterValues) => void;
  values: FacilityFilterValues;
  variant?: "catalog" | "home";
};

const sortOptions: { label: string; value: FacilitySort }[] = [
  { label: "Nama A-Z", value: "name_asc" },
  { label: "Kapasitas terbesar", value: "capacity_desc" },
  { label: "Rating tertinggi", value: "rating_desc" },
  { label: "Harga terendah", value: "price_asc" },
];

export function FacilityFilterBar({
  categoryError,
  categoryLoading = false,
  categories,
  errors = {},
  onReset,
  onSubmit,
  values,
  variant = "catalog",
}: FacilityFilterBarProps) {
  const [draft, setDraft] = useState(values);

  useEffect(() => {
    setDraft(values);
  }, [values]);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit({
      ...draft,
      minCapacity: draft.minCapacity.trim(),
      q: draft.q.trim(),
    });
  }

  return (
    <form
      aria-label={variant === "home" ? "Pencarian fasilitas" : "Filter katalog fasilitas"}
      className="grid gap-md rounded-lg border border-outline-variant bg-surface-container-lowest p-md shadow-control md:p-lg"
      onSubmit={submit}
    >
      <div className="grid gap-md lg:grid-cols-[1.4fr_1fr_0.8fr_1fr]">
        <label className="grid gap-xs text-label-bold text-on-surface" htmlFor="facility-filter-q">
          Kata kunci
          <div className="flex min-h-11 items-center gap-sm rounded border border-outline-variant bg-surface-container-lowest px-md focus-within:border-secondary focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-secondary">
            <Search aria-hidden="true" className="h-4 w-4 shrink-0 text-primary-container" />
            <input
              className="min-w-0 flex-1 bg-transparent text-body-md font-normal text-on-surface placeholder:text-on-surface-variant focus:outline-none"
              id="facility-filter-q"
              onChange={(event) => setDraft((current) => ({ ...current, q: event.target.value }))}
              placeholder="Nama fasilitas atau gedung"
              type="search"
              value={draft.q}
            />
          </div>
        </label>

        <label className="grid gap-xs text-label-bold text-on-surface" htmlFor="facility-filter-category">
          Tipe fasilitas
          <select
            className="min-h-11 rounded border border-outline-variant bg-surface-container-lowest px-md text-body-md font-normal text-on-surface shadow-control focus:border-secondary focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-secondary"
            disabled={categoryLoading || Boolean(categoryError)}
            id="facility-filter-category"
            onChange={(event) => setDraft((current) => ({ ...current, category: event.target.value }))}
            value={draft.category}
          >
            <option value="">Semua tipe</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name} ({category.facilityCount})
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-xs text-label-bold text-on-surface" htmlFor="facility-filter-capacity">
          Kapasitas minimum
          <input
            aria-describedby={errors.minCapacity ? "facility-filter-capacity-error" : undefined}
            aria-invalid={errors.minCapacity ? "true" : undefined}
            className={[
              "min-h-11 rounded border bg-surface-container-lowest px-md text-body-md font-normal text-on-surface shadow-control placeholder:text-on-surface-variant focus:border-secondary focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-secondary",
              errors.minCapacity ? "border-error" : "border-outline-variant",
            ].join(" ")}
            id="facility-filter-capacity"
            inputMode="numeric"
            onChange={(event) => setDraft((current) => ({ ...current, minCapacity: event.target.value }))}
            placeholder="50"
            type="text"
            value={draft.minCapacity}
          />
        </label>

        <label className="grid gap-xs text-label-bold text-on-surface" htmlFor="facility-filter-sort">
          Urutkan
          <select
            className="min-h-11 rounded border border-outline-variant bg-surface-container-lowest px-md text-body-md font-normal text-on-surface shadow-control focus:border-secondary focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-secondary"
            id="facility-filter-sort"
            onChange={(event) => setDraft((current) => ({ ...current, sort: event.target.value as FacilitySort }))}
            value={draft.sort}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-col gap-sm md:flex-row md:items-center md:justify-between">
        <div className="min-h-5">
          {errors.minCapacity ? (
            <p className="text-label-sm font-medium text-error" id="facility-filter-capacity-error">
              {errors.minCapacity}
            </p>
          ) : categoryLoading ? (
            <p className="text-label-sm text-on-surface-variant">Memuat tipe fasilitas...</p>
          ) : categoryError ? (
            <p className="text-label-sm font-medium text-error">{categoryError}</p>
          ) : null}
        </div>
        <div className="grid grid-cols-2 gap-sm sm:flex sm:justify-end">
          <Button className="px-sm" onClick={onReset} type="button" variant="secondary">
            <RotateCcw aria-hidden="true" className="h-4 w-4" />
            Atur Ulang Filter
          </Button>
          <Button className="px-sm" type="submit">
            <Search aria-hidden="true" className="h-4 w-4" />
            Terapkan Filter
          </Button>
        </div>
      </div>
    </form>
  );
}
