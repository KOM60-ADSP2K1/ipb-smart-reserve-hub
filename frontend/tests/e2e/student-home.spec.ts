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
  { facility_count: 4, icon_hint: "outdoor", id: "cat-outdoor", name: "Ruang Terbuka dengan Nama Sangat Panjang", slug: "ruang-terbuka" },
];

const featuredFacilities = [
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
];

test.beforeEach(async ({ page }) => {
  await page.route("http://localhost:8000/auth/me", async (route) => {
    await route.fulfill({ contentType: "application/json", json: studentUser, status: 200 });
  });
  await page.route("http://localhost:8000/facility-categories", async (route) => {
    await route.fulfill({ contentType: "application/json", json: categories, status: 200 });
  });
  await page.route("http://localhost:8000/facilities?**", async (route) => {
    await route.fulfill({
      contentType: "application/json",
      json: {
        items: featuredFacilities,
        page: 1,
        page_size: 8,
        total_items: featuredFacilities.length,
        total_pages: 1,
      },
      status: 200,
    });
  });
  await page.addInitScript(() => {
    window.sessionStorage.setItem("ipb-srh-session-token", "playwright-token");
  });
});

test("student home renders discovery search, category shortcuts, and featured facilities", async ({ page }) => {
  await page.goto("/student");

  await expect(page.getByRole("heading", { name: "IPB Smart Reserve Hub" })).toBeVisible();
  await expect(page.getByLabel("Cari fasilitas kampus")).toBeVisible();
  await expect(page.getByRole("link", { name: /Ruang Terbuka dengan Nama Sangat Panjang/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Gedung Graha Widya Wisuda/ })).toBeVisible();
  await expect(page).toHaveScreenshot("student-home-ready.png", {
    maxDiffPixelRatio: 0.02,
  });
});

test("student home search routes into facility catalog filters", async ({ page }) => {
  await page.goto("/student");

  await page.getByLabel("Kata kunci").fill("Auditorium CCR");
  await page.locator("#student-home-category").selectOption("auditorium");
  await page.getByLabel("Kapasitas minimum").fill("500");
  await page.getByRole("button", { name: "Cari Fasilitas" }).click();

  await expect(page).toHaveURL("/student/facilities?q=Auditorium+CCR&category=auditorium&minCapacity=500");
});
