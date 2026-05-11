import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { ApiClient } from "../../lib/apiClient";
import { StudentHomePageView } from "./StudentHomePage";

const categories = [
  { facility_count: 8, icon_hint: "auditorium", id: "cat-auditorium", name: "Auditorium", slug: "auditorium" },
  { facility_count: 12, icon_hint: "classroom", id: "cat-classroom", name: "Ruang Kelas", slug: "ruang-kelas" },
];

const featuredPage = {
  items: [
    {
      capacity: 1200,
      category: "Auditorium",
      cover_image_url: null,
      id: "auditorium-ccr",
      location: "Kampus IPB Dramaga, Gedung CCR",
      name: "Auditorium CCR",
      open_hours_summary: "Senin-Jumat, 08.00-21.00",
      price_summary: "Rp2.500.000 / kegiatan",
      rating_average: 4.8,
      review_count: 42,
    },
  ],
  page: 1,
  page_size: 8,
  total_items: 1,
  total_pages: 1,
};

function makeClient(overrides: Record<string, unknown> = {}) {
  const request = vi.fn(async (path: string) => {
    if (path === "/facility-categories") {
      return categories;
    }
    if (path === "/facilities?featured=true&limit=8") {
      return featuredPage;
    }
    throw new Error(`Unexpected path ${path}`);
  });

  return {
    download: vi.fn(),
    request,
    upload: vi.fn(),
    ...overrides,
  } as unknown as ApiClient;
}

function LocationText() {
  const location = useLocation();
  return <span data-testid="location">{location.pathname + location.search}</span>;
}

function renderHomePage(client = makeClient()) {
  render(
    <MemoryRouter initialEntries={["/student"]}>
      <Routes>
        <Route element={<StudentHomePageView apiClient={client} />} path="/student" />
        <Route element={<LocationText />} path="/student/facilities" />
        <Route element={<LocationText />} path="/student/facilities/:facilityId" />
      </Routes>
    </MemoryRouter>,
  );
  return client;
}

test("loads facility categories and featured facilities from the public APIs", async () => {
  const client = renderHomePage();

  expect(await screen.findByRole("heading", { name: "IPB Smart Reserve Hub" })).toBeVisible();
  expect(await screen.findByRole("link", { name: /Auditorium, 8 fasilitas aktif/ })).toBeVisible();
  expect(await screen.findByRole("link", { name: "Auditorium CCR" })).toBeVisible();
  await waitFor(() => expect(client.request).toHaveBeenCalledWith("/facility-categories"));
  expect(client.request).toHaveBeenCalledWith("/facilities?featured=true&limit=8");
});

test("submits combined search filters to the facility catalog route", async () => {
  const user = userEvent.setup();
  renderHomePage();

  await screen.findByRole("option", { name: "Auditorium" });
  await user.type(screen.getByLabelText("Kata kunci"), "Auditorium CCR");
  await user.selectOptions(screen.getByLabelText("Tipe fasilitas"), "auditorium");
  await user.type(screen.getByLabelText("Kapasitas minimum"), "500");
  await user.click(screen.getByRole("button", { name: "Cari Fasilitas" }));

  expect(screen.getByTestId("location")).toHaveTextContent("/student/facilities?q=Auditorium+CCR&category=auditorium&minCapacity=500");
});

test("routes category shortcuts and featured cards to discovery destinations", async () => {
  const user = userEvent.setup();
  renderHomePage();

  await user.click(await screen.findByRole("link", { name: /Auditorium, 8 fasilitas aktif/ }));
  expect(screen.getByTestId("location")).toHaveTextContent("/student/facilities?category=auditorium");
});

test("validates minimum capacity before navigating", async () => {
  const user = userEvent.setup();
  renderHomePage();

  await user.type(screen.getByLabelText("Kapasitas minimum"), "0");
  await user.click(screen.getByRole("button", { name: "Cari Fasilitas" }));

  expect(await screen.findByText("Kapasitas minimum harus berupa angka positif.")).toBeVisible();
  expect(screen.queryByTestId("location")).not.toBeInTheDocument();
});

test("shows retryable error and useful empty states", async () => {
  const request = vi
    .fn()
    .mockRejectedValueOnce(new Error("category failed"))
    .mockResolvedValueOnce({
      items: [],
      page: 1,
      page_size: 8,
      total_items: 0,
      total_pages: 1,
    });

  renderHomePage(makeClient({ request }));

  expect(await screen.findByText("Gagal memuat tipe fasilitas")).toBeVisible();
  expect(await screen.findByText("Fasilitas unggulan belum tersedia")).toBeVisible();
  expect(screen.getByRole("link", { name: "Buka katalog fasilitas" })).toHaveAttribute("href", "/student/facilities");
});
