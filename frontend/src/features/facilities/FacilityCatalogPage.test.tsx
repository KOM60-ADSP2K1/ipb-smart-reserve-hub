import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { FacilityCatalogPageView } from "./FacilityCatalogPage";
import { ApiClient } from "../../lib/apiClient";

function renderCatalogPage(client: ApiClient, initialEntry = "/student/facilities?q=auditorium&category=auditorium&minCapacity=500&sort=capacity_desc") {
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route element={<FacilityCatalogPageView apiClient={client} />} path="/student/facilities" />
      </Routes>
    </MemoryRouter>,
  );
}

test("loads catalog facilities from the public API using URL filters", async () => {
  const request = vi.fn(async (path: string) => {
    if (path === "/facility-categories") {
      return [{ facility_count: 1, icon_hint: "auditorium", id: "cat-1", name: "Auditorium", slug: "auditorium" }];
    }
    if (path === "/facilities?q=auditorium&category=auditorium&min_capacity=500&sort=capacity_desc&page=1&page_size=4") {
      return {
        items: [
          {
            capacity: 1200,
            category: "Auditorium",
            cover_image_url: null,
            id: "auditorium-ccr",
            location: "Kampus IPB Dramaga",
            name: "Auditorium CCR",
            open_hours_summary: "Senin-Jumat, 08.00-21.00",
            price_summary: "Rp2.500.000 / kegiatan",
            rating_average: 4.8,
            review_count: 42,
          },
        ],
        page: 1,
        page_size: 4,
        total_items: 1,
        total_pages: 1,
      };
    }
    throw new Error(`Unexpected path ${path}`);
  });

  renderCatalogPage({ request } as unknown as ApiClient);

  expect(await screen.findByRole("link", { name: "Auditorium CCR" })).toBeVisible();
  expect(screen.getByText("1 fasilitas ditemukan")).toBeVisible();
  await waitFor(() => expect(request).toHaveBeenCalledWith("/facility-categories"));
  expect(request).toHaveBeenCalledWith("/facilities?q=auditorium&category=auditorium&min_capacity=500&sort=capacity_desc&page=1&page_size=4");
});
