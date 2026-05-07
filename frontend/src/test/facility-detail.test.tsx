import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { http, HttpResponse, delay } from "msw";
import { MemoryRouter } from "react-router-dom";
import { App } from "../App";
import { server } from "./server";

function renderAsStudent(initialRoute: string) {
  localStorage.setItem("access_token", "fake-token-123");
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>,
  );
}

const fullDetail = {
  id: "fac-1",
  name: "Auditorium Andi Hakim Nasoetion",
  location: "Kampus Dramaga",
  capacity: 500,
  category: "Auditorium",
  description: "Auditorium serbaguna untuk acara akademik dan kemahasiswaan.",
  contact: {
    name: "Pak Budi",
    phone: "08123456789",
    email: "auditorium@apps.ipb.ac.id",
  },
  images: [
    {
      url: "https://example.com/auditorium-cover.jpg",
      alt_text: "Tampak depan Auditorium Andi Hakim Nasoetion",
      is_cover: true,
    },
    {
      url: "https://example.com/auditorium-stage.jpg",
      alt_text: "Panggung utama auditorium",
      is_cover: false,
    },
  ],
  price: {
    is_free: false,
    amount_rupiah: 5000000,
    summary: "Rp 5.000.000",
  },
  open_hours_summary: "Senin–Jumat, 08:00–17:00",
  review_summary: {
    rating_average: 4.6,
    review_count: 23,
  },
  reviews: [],
};

describe("Student Facility Detail", () => {
  it("renders public Facility detail loaded from GET /facilities/{facility_id}", async () => {
    server.use(
      http.get("http://localhost:8000/facilities/fac-1", () =>
        HttpResponse.json(fullDetail),
      ),
    );

    renderAsStudent("/student/facilities/fac-1");

    expect(
      await screen.findByRole("heading", {
        name: /auditorium andi hakim nasoetion/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        /auditorium serbaguna untuk acara akademik dan kemahasiswaan\./i,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText(/kampus dramaga/i)).toBeInTheDocument();
    expect(screen.getByText(/kapasitas 500/i)).toBeInTheDocument();
    expect(screen.getByText(/senin–jumat, 08:00–17:00/i)).toBeInTheDocument();
    expect(screen.getByText(/rp 5\.000\.000/i)).toBeInTheDocument();
    expect(screen.getByText(/pak budi/i)).toBeInTheDocument();
    expect(screen.getByText(/08123456789/)).toBeInTheDocument();
    expect(
      screen.getByText(/auditorium@apps\.ipb\.ac\.id/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/rating 4[.,]6 dari 23 ulasan/i)).toBeInTheDocument();

    const cover = screen.getByAltText(
      /tampak depan auditorium andi hakim nasoetion/i,
    );
    expect(cover).toHaveAttribute(
      "src",
      "https://example.com/auditorium-cover.jpg",
    );
  });

  it("navigates to the reservation time-selection route when Reserve is activated", async () => {
    server.use(
      http.get("http://localhost:8000/facilities/fac-1", () =>
        HttpResponse.json(fullDetail),
      ),
    );

    const user = userEvent.setup();
    renderAsStudent("/student/facilities/fac-1");

    const reserve = await screen.findByRole("button", { name: /reservasi/i });
    await user.click(reserve);

    expect(
      await screen.findByRole("heading", { name: /pilih waktu reservasi/i }),
    ).toBeInTheDocument();
  });

  it("shows a loading state while the facility detail is being fetched", async () => {
    server.use(
      http.get("http://localhost:8000/facilities/fac-1", async () => {
        await delay("infinite");
        return HttpResponse.json(fullDetail);
      }),
    );

    renderAsStudent("/student/facilities/fac-1");

    expect(
      await screen.findByText(/memuat detail fasilitas/i),
    ).toBeInTheDocument();
  });

  it("shows a not-found state when the facility does not exist", async () => {
    server.use(
      http.get("http://localhost:8000/facilities/fac-missing", () =>
        HttpResponse.json({ detail: "Fasilitas tidak ditemukan." }, { status: 404 }),
      ),
    );

    renderAsStudent("/student/facilities/fac-missing");

    expect(
      await screen.findByText(/fasilitas tidak ditemukan/i),
    ).toBeInTheDocument();
  });

  it("shows an error state preserving backend detail on a generic API failure", async () => {
    server.use(
      http.get("http://localhost:8000/facilities/fac-1", () =>
        HttpResponse.json(
          { detail: "Layanan fasilitas sedang tidak tersedia." },
          { status: 500 },
        ),
      ),
    );

    renderAsStudent("/student/facilities/fac-1");

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/layanan fasilitas sedang tidak tersedia/i);
  });

  it("does not render public calendar entries on the detail page", async () => {
    let calendarCalled = false;
    server.use(
      http.get("http://localhost:8000/facilities/fac-1", () =>
        HttpResponse.json(fullDetail),
      ),
      http.get("http://localhost:8000/facilities/fac-1/calendar", () => {
        calendarCalled = true;
        return HttpResponse.json([]);
      }),
    );

    renderAsStudent("/student/facilities/fac-1");

    await screen.findByRole("heading", {
      name: /auditorium andi hakim nasoetion/i,
    });

    expect(calendarCalled).toBe(false);
    expect(screen.queryByText(/jadwal terblokir|kalender|reserved slot/i)).toBeNull();
  });
});
