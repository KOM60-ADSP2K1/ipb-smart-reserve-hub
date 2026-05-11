import { expect, test } from "@playwright/test";

const studentUser = {
  academic_profile: {
    degree: "S1",
    entry_year: 2022,
    faculty: "FMIPA",
    program_studi: "Ilmu Komputer",
  },
  email: "rani@apps.ipb.ac.id",
  full_name: "Rani Prameswari",
  id: "student-1",
  is_active: true,
  nim: "G64000000",
  phone: "08123456789",
  role: "student",
};

const categories = [
  { facility_count: 8, icon_hint: "auditorium", id: "cat-auditorium", name: "Auditorium", slug: "auditorium" },
  { facility_count: 12, icon_hint: "classroom", id: "cat-classroom", name: "Ruang Kelas", slug: "ruang-kelas" },
  { facility_count: 6, icon_hint: "lab", id: "cat-lab", name: "Laboratorium", slug: "laboratorium" },
  { facility_count: 5, icon_hint: "meeting", id: "cat-meeting", name: "Ruang Rapat", slug: "ruang-rapat" },
];

const catalogItems = [
  {
    capacity: 1200,
    category: "Auditorium",
    cover_image_url: "fixture:auditorium",
    id: "auditorium-ccr",
    location: "Kampus IPB Dramaga, Gedung CCR",
    name: "Auditorium CCR",
    open_hours_summary: "Senin-Jumat, 08.00-21.00",
    price_summary: "Rp2.500.000 / kegiatan",
    rating_average: 4.8,
    review_count: 42,
  },
  {
    capacity: 650,
    category: "Auditorium",
    cover_image_url: null,
    id: "graha-widya-wisuda",
    location: "Kampus IPB Dramaga, Jalan Agatis",
    name: "Gedung Graha Widya Wisuda dengan Nama Sangat Panjang untuk Menguji Pemotongan Teks",
    open_hours_summary: "Senin-Jumat, 08.00-20.00",
    price_summary: "Rp1.500.000 / kegiatan",
    rating_average: null,
    review_count: 0,
  },
  {
    capacity: 140,
    category: "Ruang Kelas",
    cover_image_url: "fixture:classroom",
    id: "kelas-besar-tpb-a101",
    location: "Gedung TPB, Lantai 1",
    name: "Kelas Besar TPB A101",
    open_hours_summary: "Senin-Jumat, 07.00-17.00",
    price_summary: "Rp350.000 / kegiatan",
    rating_average: 4.1,
    review_count: 14,
  },
  {
    capacity: 48,
    category: "Laboratorium",
    cover_image_url: "fixture:lab",
    id: "laboratorium-biologi-dasar",
    location: "Departemen Biologi, Gedung B",
    name: "Laboratorium Biologi Dasar",
    open_hours_summary: "Senin-Jumat, 07.00-16.00",
    price_summary: "Gratis untuk kegiatan akademik",
    rating_average: 4.2,
    review_count: 9,
  },
  {
    capacity: 90,
    category: "Ruang Rapat",
    cover_image_url: "fixture:seminar",
    id: "ruang-seminar-fmipa",
    location: "Fakultas MIPA, Lantai 2",
    name: "Ruang Seminar FMIPA",
    open_hours_summary: "Senin-Sabtu, 07.30-18.00",
    price_summary: "Gratis untuk organisasi mahasiswa terverifikasi",
    rating_average: 4.5,
    review_count: 18,
  },
  {
    capacity: 220,
    category: "Ruang Terbuka",
    cover_image_url: "fixture:outdoor",
    id: "plaza-faperta",
    location: "Fakultas Pertanian",
    name: "Plaza Faperta",
    open_hours_summary: "Setiap hari, 07.00-18.00",
    price_summary: "Rp500.000 / kegiatan",
    rating_average: 4.6,
    review_count: 11,
  },
];

const auditoriumDetail = {
  capacity: 1200,
  category: "Auditorium",
  contact: { email: "ccr@apps.ipb.ac.id", name: "Unit Layanan CCR", phone: "0251-8622642" },
  description:
    "Auditorium utama untuk wisuda, seminar nasional, kuliah umum, dan kegiatan mahasiswa berskala besar dengan akses foyer dan area registrasi yang luas.",
  id: "auditorium-ccr",
  images: [
    { alt_text: "Auditorium CCR dengan panggung dan kursi utama", is_cover: true, url: "fixture:auditorium" },
    { alt_text: "Foyer Auditorium CCR untuk registrasi peserta", is_cover: false, url: "fixture:foyer" },
    { alt_text: "Area kursi Auditorium CCR dari sisi balkon", is_cover: false, url: "fixture:auditorium-side" },
  ],
  location: "Kampus IPB Dramaga, Gedung CCR",
  name: "Auditorium CCR",
  open_hours_summary: "Senin-Jumat, 08.00-21.00",
  price: { amount_rupiah: 2500000, is_free: false, summary: "Rp2.500.000 / kegiatan" },
  review_summary: { rating_average: 4.8, review_count: 42 },
  reviews: [
    { author_name: "BEM KM IPB", comment: "Alur masuk peserta jelas dan fasilitas audio membantu acara berjalan rapi.", created_at: "2026-04-18", id: "review-1", rating: 5 },
    { author_name: "Himalkom", comment: "Kapasitas besar, tetapi panitia perlu datang lebih awal untuk pengecekan perangkat.", created_at: "2026-03-30", id: "review-2", rating: 4 },
  ],
};

test.beforeEach(async ({ page }) => {
  await page.route("http://localhost:8000/auth/me", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      json: studentUser,
      status: 200,
    });
  });
  await page.route("http://localhost:8000/facility-categories", async (route) => {
    await route.fulfill({ contentType: "application/json", json: categories, status: 200 });
  });
  await page.route("http://localhost:8000/facilities/auditorium-ccr", async (route) => {
    await route.fulfill({ contentType: "application/json", json: auditoriumDetail, status: 200 });
  });
  await page.route("http://localhost:8000/facilities?**", async (route) => {
    const url = new URL(route.request().url());
    const query = url.searchParams.get("q")?.toLowerCase() ?? "";
    const category = url.searchParams.get("category") ?? "";
    const minCapacity = Number.parseInt(url.searchParams.get("min_capacity") ?? "0", 10);
    const pageNumber = Number.parseInt(url.searchParams.get("page") ?? "1", 10);
    const pageSize = Number.parseInt(url.searchParams.get("page_size") ?? "4", 10);
    const filtered = catalogItems.filter((item) => {
      const matchesQuery = !query || [item.name, item.category, item.location].some((value) => value.toLowerCase().includes(query));
      const matchesCategory = !category || categories.find((option) => option.name === item.category)?.slug === category;
      const matchesCapacity = !minCapacity || item.capacity >= minCapacity;
      return matchesQuery && matchesCategory && matchesCapacity;
    });
    const start = (pageNumber - 1) * pageSize;

    await route.fulfill({
      contentType: "application/json",
      json: {
        items: filtered.slice(start, start + pageSize),
        page: pageNumber,
        page_size: pageSize,
        total_items: filtered.length,
        total_pages: Math.max(1, Math.ceil(filtered.length / pageSize)),
      },
      status: 200,
    });
  });
  await page.addInitScript(() => {
    window.sessionStorage.setItem("ipb-srh-session-token", "playwright-token");
  });
});

test("facility catalog renders filters, fallback media, long text, and responsive cards", async ({ page }) => {
  await page.goto("/student/facilities");

  await expect(page.getByRole("heading", { name: "Katalog Fasilitas" })).toBeVisible();
  await expect(page.getByRole("link", { name: /Gedung Graha Widya Wisuda/ })).toBeVisible();
  await expect(page.getByRole("img", { name: /Gedung Graha Widya Wisuda/ })).toBeVisible();
  await expect(page).toHaveScreenshot("facility-catalog-ready.png", {
    maxDiffPixelRatio: 0.02,
  });
});

test("facility catalog hydrates filters from the URL and writes submitted filters back to the URL", async ({ page }) => {
  await page.goto("/student/facilities?q=ruang&category=ruang-rapat&minCapacity=50&sort=capacity_desc");

  await expect(page.getByLabel("Kata kunci")).toHaveValue("ruang");
  await expect(page.getByLabel("Tipe fasilitas")).toHaveValue("ruang-rapat");
  await expect(page.getByLabel("Kapasitas minimum")).toHaveValue("50");
  await expect(page.getByRole("link", { name: "Ruang Seminar FMIPA" })).toBeVisible();

  await page.getByLabel("Kata kunci").fill("auditorium");
  await page.getByLabel("Tipe fasilitas").selectOption("auditorium");
  await page.getByLabel("Kapasitas minimum").fill("500");
  await page.getByRole("button", { name: "Terapkan Filter" }).click();

  await expect(page).toHaveURL("/student/facilities?q=auditorium&category=auditorium&minCapacity=500&sort=capacity_desc");
  await expect(page.getByRole("link", { name: "Auditorium CCR" })).toBeVisible();
  await expect(page).toHaveScreenshot("facility-catalog-filtered.png", {
    maxDiffPixelRatio: 0.02,
  });
});

test("facility details renders gallery, facts, reviews, and reservation action", async ({ page }) => {
  await page.goto("/student/facilities/auditorium-ccr");

  await expect(page.getByRole("heading", { name: "Auditorium CCR" })).toBeVisible();
  await expect(page.getByRole("region", { name: "Galeri Auditorium CCR" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Reservasi Fasilitas" }).first()).toHaveAttribute(
    "href",
    "/student/facilities/auditorium-ccr/reserve/time",
  );
  await expect(page).toHaveScreenshot("facility-details-ready.png", {
    maxDiffPixelRatio: 0.02,
  });
});
