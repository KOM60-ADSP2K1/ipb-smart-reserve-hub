import {
  ArrowRight,
  Building2,
  DoorOpen,
  FlaskConical,
  Landmark,
  Search,
  Trees,
  UsersRound,
} from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { FormField } from "../../components/ui/FormField";
import { ApiClient } from "../../lib/apiClient";
import { useAuth } from "../auth/authSession";
import { mapCatalogPage, mapCategory } from "../facilities/apiMapping";
import { FacilityCard } from "../facilities/FacilityCard";
import {
  FacilityCatalogApiPage,
  FacilityCatalogItem,
  FacilityCategoryApiItem,
  FacilityCategoryOption,
} from "../facilities/types";

type SectionStatus = "empty" | "error" | "loading" | "ready";

const featuredLimit = 8;

const categoryIconMap = {
  auditorium: Landmark,
  classroom: DoorOpen,
  lab: FlaskConical,
  meeting: UsersRound,
  outdoor: Trees,
};

export function StudentHomePage() {
  const { apiClient } = useAuth();
  return <StudentHomePageView apiClient={apiClient} />;
}

export function StudentHomePageView({ apiClient }: { apiClient: ApiClient }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<FacilityCategoryOption[]>([]);
  const [featuredFacilities, setFeaturedFacilities] = useState<FacilityCatalogItem[]>([]);
  const [categoryStatus, setCategoryStatus] = useState<SectionStatus>("loading");
  const [featuredStatus, setFeaturedStatus] = useState<SectionStatus>("loading");
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [minimumCapacity, setMinimumCapacity] = useState("");
  const [capacityError, setCapacityError] = useState<string | undefined>();

  useEffect(() => {
    document.title = "Beranda - IPB Smart Reserve Hub";
  }, []);

  useEffect(() => {
    loadCategories();
    loadFeaturedFacilities();
  }, [apiClient]);

  async function loadCategories() {
    setCategoryStatus("loading");
    try {
      const response = await apiClient.request<FacilityCategoryApiItem[]>("/facility-categories");
      const mappedCategories = response.map(mapCategory);
      setCategories(mappedCategories);
      setCategoryStatus(mappedCategories.length ? "ready" : "empty");
    } catch {
      setCategories([]);
      setCategoryStatus("error");
    }
  }

  async function loadFeaturedFacilities() {
    setFeaturedStatus("loading");
    try {
      const response = await apiClient.request<FacilityCatalogApiPage>(`/facilities?featured=true&limit=${featuredLimit}`);
      const mappedPage = mapCatalogPage(response, categories);
      setFeaturedFacilities(mappedPage.items);
      setFeaturedStatus(mappedPage.items.length ? "ready" : "empty");
    } catch {
      setFeaturedFacilities([]);
      setFeaturedStatus("error");
    }
  }

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedCapacity = minimumCapacity.trim();

    if (trimmedCapacity && (!/^\d+$/.test(trimmedCapacity) || Number.parseInt(trimmedCapacity, 10) <= 0)) {
      setCapacityError("Kapasitas minimum harus berupa angka positif.");
      return;
    }

    setCapacityError(undefined);
    navigate(`/student/facilities${buildCatalogSearch({ category: selectedCategory, minCapacity: trimmedCapacity, q: keyword })}`);
  }

  return (
    <section className="grid gap-xl">
      <section className="relative isolate overflow-hidden rounded-lg bg-primary text-inverse-on-surface shadow-ambient">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-container via-secondary to-tertiary-container" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_20%,rgba(255,255,255,0.32),transparent_28%),linear-gradient(135deg,rgba(255,255,255,0.14)_0_1px,transparent_1px_22px)]" />
        <div className="relative grid min-w-0 gap-md p-md md:min-h-[500px] md:grid-cols-[minmax(0,1fr)_440px] md:items-end md:gap-lg md:p-xl">
          <div className="min-w-0 max-w-3xl self-end pb-md">
            <p className="text-label-bold uppercase text-secondary-fixed">Beranda Mahasiswa</p>
            <h1 className="mt-sm max-w-2xl break-words text-[30px] font-bold leading-tight tracking-normal text-inverse-on-surface md:text-h1">
              IPB Smart Reserve Hub
            </h1>
            <p className="mt-sm max-w-2xl text-body-md text-inverse-on-surface/86 md:mt-md md:text-body-lg">
              Temukan fasilitas kampus, cek ketersediaan, dan mulai reservasi sesuai kebutuhan kegiatan Anda.
            </p>
          </div>
          <form
            aria-label="Cari fasilitas kampus"
            className="grid min-w-0 gap-sm rounded-lg bg-surface-container-lowest p-md text-on-surface shadow-ambient md:gap-md md:p-lg"
            onSubmit={submitSearch}
          >
            <div className="grid gap-sm">
              <p className="text-label-bold text-secondary">Mulai pencarian</p>
              <p className="hidden text-body-md text-on-surface-variant sm:block">Cari berdasarkan nama, tipe fasilitas, atau kapasitas acara.</p>
            </div>
            <FormField
              id="student-home-keyword"
              label="Kata kunci"
              leadingIcon={<Search aria-hidden="true" className="h-4 w-4" />}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Nama fasilitas atau gedung"
              value={keyword}
            />
            <div className="grid gap-xs">
              <label className="text-label-bold text-on-surface" htmlFor="student-home-category">
                Tipe fasilitas
              </label>
              <select
                className="min-h-11 min-w-0 rounded border border-outline-variant bg-surface-container-low px-md text-body-md text-on-surface focus:border-secondary focus:bg-surface-container-lowest focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-secondary"
                disabled={categoryStatus === "loading"}
                id="student-home-category"
                onChange={(event) => setSelectedCategory(event.target.value)}
                value={selectedCategory}
              >
                <option value="">Semua tipe</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <FormField
              error={capacityError}
              id="student-home-capacity"
              inputMode="numeric"
              label="Kapasitas minimum"
              onChange={(event) => setMinimumCapacity(event.target.value)}
              placeholder="Contoh: 100"
              value={minimumCapacity}
            />
            <Button size="lg" type="submit">
              <Search aria-hidden="true" className="h-4 w-4" />
              Cari Fasilitas
            </Button>
          </form>
        </div>
      </section>

      <section aria-labelledby="facility-types-heading" className="grid gap-md">
        <div className="flex flex-col gap-sm md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-label-bold uppercase text-secondary">Tipe fasilitas</p>
            <h2 className="mt-xs text-h2 text-primary-container" id="facility-types-heading">
              Tipe Fasilitas
            </h2>
          </div>
          <Link className="inline-flex items-center gap-xs text-label-bold text-secondary underline-offset-4 hover:underline" to="/student/facilities">
            Lihat Semua Fasilitas
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
        {categoryStatus === "loading" ? (
          <CategorySkeleton />
        ) : categoryStatus === "error" ? (
          <SectionError message="Tipe fasilitas belum dapat dimuat." onRetry={loadCategories} title="Gagal memuat tipe fasilitas" />
        ) : categoryStatus === "empty" ? (
          <SectionEmpty message="Tipe fasilitas aktif belum tersedia." title="Belum ada tipe fasilitas" />
        ) : (
          <div className="grid grid-cols-2 gap-md lg:grid-cols-5">
            {categories.map((category) => (
              <CategoryShortcut category={category} key={category.id} />
            ))}
          </div>
        )}
      </section>

      <section aria-labelledby="featured-facilities-heading" className="grid gap-md">
        <div className="flex flex-col gap-sm md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-label-bold uppercase text-secondary">Pilihan kampus</p>
            <h2 className="mt-xs text-h2 text-primary-container" id="featured-facilities-heading">
              Jelajah Fasilitas
            </h2>
          </div>
          <Link className="inline-flex items-center gap-xs text-label-bold text-secondary underline-offset-4 hover:underline" to="/student/facilities">
            Lihat Semua Fasilitas
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
        {featuredStatus === "loading" ? (
          <FeaturedSkeleton />
        ) : featuredStatus === "error" ? (
          <SectionError message="Fasilitas unggulan belum dapat dimuat." onRetry={loadFeaturedFacilities} title="Gagal memuat fasilitas" />
        ) : featuredStatus === "empty" ? (
          <SectionEmpty
            action={<Link className="text-label-bold text-secondary underline-offset-4 hover:underline" to="/student/facilities">Buka katalog fasilitas</Link>}
            message="Belum ada fasilitas unggulan. Anda tetap dapat melihat semua fasilitas aktif."
            title="Fasilitas unggulan belum tersedia"
          />
        ) : (
          <div className="grid gap-md sm:grid-cols-2 xl:grid-cols-4">
            {featuredFacilities.map((facility) => (
              <FacilityCard facility={facility} key={facility.id} variant="featured" />
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

function CategoryShortcut({ category }: { category: FacilityCategoryOption }) {
  const Icon = categoryIconMap[category.iconHint as keyof typeof categoryIconMap] ?? Building2;

  return (
    <Link
      aria-label={`${category.name}, ${category.facilityCount} fasilitas aktif`}
      className="group grid min-h-36 gap-md rounded-lg border border-outline-variant bg-surface-container-lowest p-md shadow-control transition-colors hover:border-secondary hover:bg-primary-fixed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
      to={`/student/facilities?category=${encodeURIComponent(category.slug)}`}
    >
      <span className="grid h-11 w-11 place-items-center rounded bg-secondary-container text-secondary-on-container">
        <Icon aria-hidden="true" className="h-5 w-5" />
      </span>
      <span className="grid gap-xs">
        <span className="text-body-lg font-bold leading-snug text-primary-container group-hover:underline">{category.name}</span>
        <span className="text-body-md text-on-surface-variant">{category.facilityCount} fasilitas aktif</span>
      </span>
    </Link>
  );
}

function CategorySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-md lg:grid-cols-5" role="status">
      {Array.from({ length: 5 }).map((_, index) => (
        <div className="min-h-36 animate-pulse rounded-lg border border-outline-variant bg-surface-container-lowest p-md shadow-control" key={index}>
          <div className="h-11 w-11 rounded bg-surface-container-high" />
          <div className="mt-md h-5 w-3/4 rounded bg-surface-container-high" />
          <div className="mt-sm h-5 w-1/2 rounded bg-surface-container" />
        </div>
      ))}
      <span className="sr-only">Memuat tipe fasilitas...</span>
    </div>
  );
}

function FeaturedSkeleton() {
  return (
    <div className="grid gap-md sm:grid-cols-2 xl:grid-cols-4" role="status">
      {Array.from({ length: 4 }).map((_, index) => (
        <div className="min-h-96 animate-pulse rounded-lg border border-outline-variant bg-surface-container-lowest shadow-control" key={index}>
          <div className="aspect-[4/3] rounded bg-surface-container-high" />
          <div className="grid gap-md p-md">
            <div className="h-5 w-2/3 rounded bg-surface-container-high" />
            <div className="h-7 rounded bg-surface-container-high" />
            <div className="h-16 rounded bg-surface-container" />
          </div>
        </div>
      ))}
      <span className="sr-only">Memuat fasilitas unggulan...</span>
    </div>
  );
}

function SectionError({ message, onRetry, title }: { message: string; onRetry: () => void; title: string }) {
  return (
    <section className="rounded-lg border border-error bg-error-container p-lg shadow-control" role="alert">
      <h3 className="text-h3 text-error-on-container">{title}</h3>
      <p className="mt-sm text-body-md text-error-on-container">{message}</p>
      <Button className="mt-md" onClick={onRetry} type="button" variant="destructive">
        Coba Lagi
      </Button>
    </section>
  );
}

function SectionEmpty({ action, message, title }: { action?: ReactNode; message: string; title: string }) {
  return (
    <section className="rounded-lg border border-outline-variant bg-surface-container-lowest p-lg shadow-control">
      <h3 className="text-h3 text-primary-container">{title}</h3>
      <p className="mt-sm text-body-md text-on-surface-variant">{message}</p>
      {action ? <div className="mt-md">{action}</div> : null}
    </section>
  );
}

function buildCatalogSearch({ category, minCapacity, q }: { category: string; minCapacity: string; q: string }) {
  const params = new URLSearchParams();
  const trimmedQuery = q.trim();

  if (trimmedQuery) {
    params.set("q", trimmedQuery);
  }
  if (category) {
    params.set("category", category);
  }
  if (minCapacity) {
    params.set("minCapacity", minCapacity);
  }

  const search = params.toString();
  return search ? `?${search}` : "";
}
