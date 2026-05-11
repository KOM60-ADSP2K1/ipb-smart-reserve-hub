import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { ApiClient } from "../../lib/apiClient";
import { useAuth } from "../auth/authSession";
import { catalogPath, mapCatalogPage, mapCategory } from "./apiMapping";
import { FacilityCard } from "./FacilityCard";
import { FacilityFilterBar } from "./FacilityFilterBar";
import {
  FacilityCatalogApiPage,
  FacilityCatalogItem,
  FacilityCategoryApiItem,
  FacilityCategoryOption,
  FacilityFilterValues,
  FacilitySort,
} from "./types";

const pageSize = 4;
const validSorts: FacilitySort[] = ["name_asc", "capacity_desc", "rating_desc", "price_asc"];

type CatalogPageState = {
  items: FacilityCatalogItem[];
  page: number;
  totalItems: number;
  totalPages: number;
};

export function FacilityCatalogPage() {
  const { apiClient } = useAuth();
  return <FacilityCatalogPageView apiClient={apiClient} />;
}

export function FacilityCatalogPageView({ apiClient: client }: { apiClient: ApiClient }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const parsed = parseCatalogParams(searchParams);
  const [categories, setCategories] = useState<FacilityCategoryOption[]>([]);
  const [catalogPage, setCatalogPage] = useState<CatalogPageState>({
    items: [],
    page: 1,
    totalItems: 0,
    totalPages: 1,
  });
  const [status, setStatus] = useState<"error" | "loading" | "ready">("loading");

  useEffect(() => {
    let isActive = true;
    setStatus("loading");

    async function loadCatalog() {
      try {
        const categoryResponse = await client.request<FacilityCategoryApiItem[]>("/facility-categories");
        if (!isActive) {
          return;
        }
        const mappedCategories = categoryResponse.map(mapCategory);
        setCategories(mappedCategories);

        const catalogResponse = await client.request<FacilityCatalogApiPage>(catalogPath(parsed.values, parsed.page, pageSize));
        if (!isActive) {
          return;
        }
        const mappedPage = mapCatalogPage(catalogResponse, mappedCategories);
        setCatalogPage({
          items: mappedPage.items,
          page: mappedPage.page,
          totalItems: mappedPage.totalItems,
          totalPages: Math.max(1, mappedPage.totalPages),
        });
        setStatus("ready");
      } catch {
        if (isActive) {
          setStatus("error");
        }
      }
    }

    loadCatalog();

    return () => {
      isActive = false;
    };
  }, [client, parsed.page, parsed.values.category, parsed.values.minCapacity, parsed.values.q, parsed.values.sort]);

  const currentPage = Math.min(catalogPage.page, catalogPage.totalPages);
  const pageItems = catalogPage.items;

  function submitFilters(values: FacilityFilterValues) {
    navigate(`/student/facilities?${buildSearchParams(values, 1).toString()}`);
  }

  function resetFilters() {
    navigate("/student/facilities");
  }

  function setPage(page: number) {
    navigate(`/student/facilities?${buildSearchParams(parsed.values, page).toString()}`);
  }

  return (
    <section className="grid gap-lg">
      <div className="grid gap-sm">
        <p className="text-label-bold uppercase text-secondary">Fasilitas</p>
        <div className="flex flex-col gap-md md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-h2 text-primary-container">Katalog Fasilitas</h1>
            <p className="mt-sm max-w-3xl text-body-md text-on-surface-variant">
              Cari, filter, dan bandingkan fasilitas aktif berdasarkan kebutuhan kegiatan mahasiswa.
            </p>
          </div>
          <p className="rounded bg-secondary-container px-md py-sm text-label-bold text-secondary-on-container" aria-live="polite">
            {catalogPage.totalItems} fasilitas ditemukan
          </p>
        </div>
      </div>

      <FacilityFilterBar
        categories={categories}
        errors={parsed.errors}
        onReset={resetFilters}
        onSubmit={submitFilters}
        values={parsed.values}
      />

      {status === "loading" ? (
        <CatalogSkeleton />
      ) : status === "error" ? (
        <CatalogError onReset={resetFilters} />
      ) : pageItems.length ? (
        <>
          <div className="grid gap-md sm:grid-cols-2 xl:grid-cols-4">
            {pageItems.map((facility) => (
              <FacilityCard facility={facility} key={facility.id} />
            ))}
          </div>
          <div className="flex flex-col gap-sm rounded-lg border border-outline-variant bg-surface-container-lowest p-md shadow-control sm:flex-row sm:items-center sm:justify-between">
            <p className="text-body-md text-on-surface-variant">
              Halaman {currentPage} dari {catalogPage.totalPages}
            </p>
            <div className="flex gap-sm">
              <Button disabled={currentPage <= 1} onClick={() => setPage(currentPage - 1)} variant="secondary">
                <ChevronLeft aria-hidden="true" className="h-4 w-4" />
                Sebelumnya
              </Button>
              <Button disabled={currentPage >= catalogPage.totalPages} onClick={() => setPage(currentPage + 1)} variant="secondary">
                Berikutnya
                <ChevronRight aria-hidden="true" className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <EmptyCatalog onReset={resetFilters} />
      )}
    </section>
  );
}

function CatalogSkeleton() {
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
      <span className="sr-only">Memuat katalog fasilitas...</span>
    </div>
  );
}

function CatalogError({ onReset }: { onReset: () => void }) {
  return (
    <section className="rounded-lg border border-error bg-error-container p-lg shadow-control">
      <h2 className="text-h3 text-error-on-container">Katalog belum dapat dimuat</h2>
      <p className="mt-sm text-body-md text-error-on-container">Periksa koneksi atau coba tampilkan ulang katalog fasilitas.</p>
      <Button className="mt-md" onClick={onReset} type="button" variant="destructive">
        Muat Ulang Katalog
      </Button>
    </section>
  );
}

function EmptyCatalog({ onReset }: { onReset: () => void }) {
  return (
    <section className="grid min-h-72 place-items-center rounded-lg border border-outline-variant bg-surface-container-lowest p-lg text-center shadow-control">
      <div className="grid max-w-md justify-items-center gap-md">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-surface-container-high text-primary-container">
          <SearchX aria-hidden="true" className="h-7 w-7" />
        </span>
        <div>
          <h2 className="text-h3 text-primary-container">Fasilitas tidak ditemukan</h2>
          <p className="mt-sm text-body-md text-on-surface-variant">
            Coba kata kunci lain, kurangi kapasitas minimum, atau tampilkan semua tipe fasilitas.
          </p>
        </div>
        <Button onClick={onReset} type="button">
          Atur Ulang Filter
        </Button>
      </div>
    </section>
  );
}

function parseCatalogParams(searchParams: URLSearchParams) {
  const sortParam = searchParams.get("sort") as FacilitySort | null;
  const minCapacity = searchParams.get("minCapacity") ?? "";
  const pageParam = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const hasInvalidCapacity = minCapacity !== "" && (!/^\d+$/.test(minCapacity) || Number.parseInt(minCapacity, 10) <= 0);

  return {
    errors: hasInvalidCapacity
      ? {
          minCapacity: "Kapasitas minimum harus berupa angka positif.",
        }
      : {},
    page: Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1,
    values: {
      category: searchParams.get("category") ?? "",
      minCapacity,
      q: searchParams.get("q") ?? "",
      sort: sortParam && validSorts.includes(sortParam) ? sortParam : "name_asc",
    },
  };
}

function buildSearchParams(values: FacilityFilterValues, page: number) {
  const params = new URLSearchParams();
  const trimmedQuery = values.q.trim();
  const trimmedCapacity = values.minCapacity.trim();

  if (trimmedQuery) {
    params.set("q", trimmedQuery);
  }
  if (values.category) {
    params.set("category", values.category);
  }
  if (trimmedCapacity) {
    params.set("minCapacity", trimmedCapacity);
  }
  if (values.sort !== "name_asc") {
    params.set("sort", values.sort);
  }
  if (page > 1) {
    params.set("page", String(page));
  }
  return params;
}
