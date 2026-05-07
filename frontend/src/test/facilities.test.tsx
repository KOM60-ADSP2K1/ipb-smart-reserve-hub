import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { http, HttpResponse, delay } from "msw";
import { MemoryRouter } from "react-router-dom";
import { App } from "../App";
import { server } from "./server";

function renderAsStudent(initialRoute = "/student/facilities") {
  localStorage.setItem("access_token", "fake-token-123");
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>,
  );
}

describe("Student Facility Catalog", () => {
  it("renders a card for each active facility returned by GET /facilities", async () => {
    server.use(
      http.get("http://localhost:8000/facilities", () =>
        HttpResponse.json([
          {
            id: "fac-1",
            name: "Auditorium Andi Hakim Nasoetion",
            location: "Kampus Dramaga",
            capacity: 500,
            category: "Auditorium",
            cover_image_url: "https://example.com/auditorium.jpg",
            rating_average: 4.6,
            review_count: 23,
            price_summary: "Rp 5.000.000",
            open_hours_summary: "Senin–Jumat, 08:00–17:00",
          },
          {
            id: "fac-2",
            name: "Gedung Common Class Room",
            location: "Kampus Dramaga",
            capacity: 80,
            category: "Ruang Kelas",
            cover_image_url: null,
            rating_average: null,
            review_count: 0,
            price_summary: "Gratis",
            open_hours_summary: "Senin–Jumat, 07:00–18:00",
          },
        ]),
      ),
    );

    renderAsStudent();

    expect(
      await screen.findByRole("heading", {
        name: /auditorium andi hakim nasoetion/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /gedung common class room/i }),
    ).toBeInTheDocument();

    const auditoriumCard = screen
      .getByRole("heading", { name: /auditorium andi hakim nasoetion/i })
      .closest("article");
    expect(auditoriumCard).not.toBeNull();
    expect(auditoriumCard).toHaveTextContent(/kampus dramaga/i);
    expect(auditoriumCard).toHaveTextContent(/auditorium/i);
    expect(auditoriumCard).toHaveTextContent(/500/);
    expect(auditoriumCard).toHaveTextContent(/senin–jumat, 08:00–17:00/i);
    expect(auditoriumCard).toHaveTextContent(/rp 5\.000\.000/i);

    const cover = screen.getByAltText(/auditorium andi hakim nasoetion/i);
    expect(cover).toHaveAttribute("src", "https://example.com/auditorium.jpg");
  });

  it("shows an empty state when no facilities are returned", async () => {
    server.use(
      http.get("http://localhost:8000/facilities", () =>
        HttpResponse.json([]),
      ),
    );

    renderAsStudent();

    expect(
      await screen.findByText(/belum ada fasilitas yang tersedia/i),
    ).toBeInTheDocument();
  });

  it("shows an error state when the facilities request fails", async () => {
    server.use(
      http.get("http://localhost:8000/facilities", () =>
        HttpResponse.json(
          { detail: "Layanan fasilitas sedang tidak tersedia." },
          { status: 500 },
        ),
      ),
    );

    renderAsStudent();

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/layanan fasilitas sedang tidak tersedia/i);
  });

  it("filters facilities locally by name, location, or category", async () => {
    server.use(
      http.get("http://localhost:8000/facilities", () =>
        HttpResponse.json([
          {
            id: "fac-1",
            name: "Auditorium Andi Hakim Nasoetion",
            location: "Kampus Dramaga",
            capacity: 500,
            category: "Auditorium",
            cover_image_url: null,
            rating_average: null,
            review_count: 0,
            price_summary: "Rp 5.000.000",
            open_hours_summary: "Senin–Jumat, 08:00–17:00",
          },
          {
            id: "fac-2",
            name: "Lapangan Sepak Bola",
            location: "Kampus Baranangsiang",
            capacity: 200,
            category: "Olahraga",
            cover_image_url: null,
            rating_average: null,
            review_count: 0,
            price_summary: "Gratis",
            open_hours_summary: "Setiap hari, 06:00–18:00",
          },
          {
            id: "fac-3",
            name: "Ruang Kelas A1",
            location: "Kampus Dramaga",
            capacity: 40,
            category: "Ruang Kelas",
            cover_image_url: null,
            rating_average: null,
            review_count: 0,
            price_summary: "Gratis",
            open_hours_summary: "Senin–Jumat, 07:00–18:00",
          },
        ]),
      ),
    );

    const user = userEvent.setup();
    renderAsStudent();

    await screen.findByRole("heading", { name: /auditorium andi hakim/i });

    const search = screen.getByRole("searchbox", { name: /cari fasilitas/i });

    await user.type(search, "baranangsiang");
    expect(
      screen.getByRole("heading", { name: /lapangan sepak bola/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /auditorium andi hakim/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /ruang kelas a1/i }),
    ).not.toBeInTheDocument();

    await user.clear(search);
    await user.type(search, "ruang kelas");
    expect(
      screen.getByRole("heading", { name: /ruang kelas a1/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /lapangan sepak bola/i }),
    ).not.toBeInTheDocument();
  });

  it("navigates to the facility detail route when a card is clicked", async () => {
    server.use(
      http.get("http://localhost:8000/facilities", () =>
        HttpResponse.json([
          {
            id: "fac-42",
            name: "Auditorium Andi Hakim Nasoetion",
            location: "Kampus Dramaga",
            capacity: 500,
            category: "Auditorium",
            cover_image_url: null,
            rating_average: null,
            review_count: 0,
            price_summary: "Rp 5.000.000",
            open_hours_summary: "Senin–Jumat, 08:00–17:00",
          },
        ]),
      ),
      http.get("http://localhost:8000/facilities/fac-42", () =>
        HttpResponse.json({
          id: "fac-42",
          name: "Auditorium Andi Hakim Nasoetion",
          location: "Kampus Dramaga",
          capacity: 500,
          category: "Auditorium",
          description: "Deskripsi.",
          contact: { name: "Admin", phone: "0812", email: null },
          images: [],
          price: { is_free: false, amount_rupiah: 5000000, summary: "Rp 5.000.000" },
          open_hours_summary: "Senin–Jumat, 08:00–17:00",
          review_summary: { rating_average: null, review_count: 0 },
          reviews: [],
        }),
      ),
    );

    const user = userEvent.setup();
    renderAsStudent();

    const facilityLink = await screen.findByRole("link", {
      name: /auditorium andi hakim nasoetion/i,
    });
    expect(facilityLink).toHaveAttribute(
      "href",
      "/student/facilities/fac-42",
    );

    await user.click(facilityLink);

    expect(
      await screen.findByRole("button", { name: /reservasi/i }),
    ).toBeInTheDocument();
  });

  it("shows a loading state while facilities are being fetched", async () => {
    server.use(
      http.get("http://localhost:8000/facilities", async () => {
        await delay("infinite");
        return HttpResponse.json([]);
      }),
    );

    renderAsStudent();

    expect(
      await screen.findByText(/memuat fasilitas/i),
    ).toBeInTheDocument();
  });
});
