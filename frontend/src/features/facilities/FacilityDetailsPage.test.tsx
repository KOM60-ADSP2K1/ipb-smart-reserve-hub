import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { FacilityDetailsPageView } from "./FacilityDetailsPage";
import { ApiClient } from "../../lib/apiClient";

test("loads facility details from the public API", async () => {
  const request = vi.fn(async (path: string) => {
    if (path !== "/facilities/auditorium-ccr") {
      throw new Error(`Unexpected path ${path}`);
    }
    return {
      capacity: 1200,
      category: "Auditorium",
      contact: { email: "ccr@apps.ipb.ac.id", name: "Unit Layanan CCR", phone: "0251-8622642" },
      description: "Auditorium utama untuk kegiatan mahasiswa berskala besar.",
      id: "auditorium-ccr",
      images: [{ alt_text: "Auditorium CCR", is_cover: true, url: null }],
      location: "Kampus IPB Dramaga",
      name: "Auditorium CCR",
      open_hours_summary: "Senin-Jumat, 08.00-21.00",
      price: { amount_rupiah: 2500000, is_free: false, summary: "Rp2.500.000 / kegiatan" },
      review_summary: { rating_average: 4.8, review_count: 42 },
      reviews: [{ author_name: "BEM KM IPB", comment: "Alur masuk peserta jelas.", created_at: "2026-04-18", id: "review-1", rating: 5 }],
    };
  });

  render(
    <MemoryRouter initialEntries={["/student/facilities/auditorium-ccr"]}>
      <Routes>
        <Route element={<FacilityDetailsPageView apiClient={requestClient(request)} />} path="/student/facilities/:facilityId" />
      </Routes>
    </MemoryRouter>,
  );

  expect(await screen.findByRole("heading", { name: "Auditorium CCR" })).toBeVisible();
  expect(screen.getByText("Rp2.500.000 / kegiatan")).toBeVisible();
  expect(request).toHaveBeenCalledWith("/facilities/auditorium-ccr");
});

function requestClient(request: (path: string) => Promise<unknown>) {
  return { request } as unknown as ApiClient;
}
