import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { http, HttpResponse } from "msw";
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

const facilityDetail = {
  id: "fac-1",
  name: "Auditorium Andi Hakim Nasoetion",
  location: "Kampus Dramaga",
  capacity: 500,
  category: "Auditorium",
  description: "Auditorium serbaguna untuk acara akademik dan kemahasiswaan.",
  contact: { name: "Pak Budi", phone: "08123456789", email: null },
  images: [],
  price: { is_free: false, amount_rupiah: 5000000, summary: "Rp 5.000.000" },
  open_hours_summary: "Senin–Jumat, 08:00–17:00",
  review_summary: { rating_average: null, review_count: 0 },
  reviews: [],
};

describe("Student Reservation Time Selection", () => {
  it("renders the page heading with the facility name and date/time controls", async () => {
    server.use(
      http.get("http://localhost:8000/facilities/fac-1", () =>
        HttpResponse.json(facilityDetail),
      ),
      http.get("http://localhost:8000/facilities/fac-1/calendar", () =>
        HttpResponse.json([]),
      ),
    );

    renderAsStudent("/student/facilities/fac-1/reserve/time");

    expect(
      await screen.findByRole("heading", { name: /pilih waktu reservasi/i }),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/auditorium andi hakim nasoetion/i),
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/tanggal/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/waktu mulai/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/waktu selesai/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /lanjutkan/i }),
    ).toBeInTheDocument();
  });

  it("renders reserved slots for the selected date from the public calendar", async () => {
    let observedStart: string | null = null;
    let observedEnd: string | null = null;
    server.use(
      http.get("http://localhost:8000/facilities/fac-1", () =>
        HttpResponse.json(facilityDetail),
      ),
      http.get(
        "http://localhost:8000/facilities/fac-1/calendar",
        ({ request }) => {
          const url = new URL(request.url);
          observedStart = url.searchParams.get("start");
          observedEnd = url.searchParams.get("end");
          return HttpResponse.json([
            {
              facility_name: "Auditorium Andi Hakim Nasoetion",
              activity_title: "Seminar Nasional Pertanian",
              organization_unit: "Fakultas Pertanian",
              starts_at: "2026-06-15T09:00:00+07:00",
              ends_at: "2026-06-15T12:00:00+07:00",
            },
            {
              facility_name: "Auditorium Andi Hakim Nasoetion",
              activity_title: "Workshop Mahasiswa",
              organization_unit: "BEM KM IPB",
              starts_at: "2026-06-15T14:00:00+07:00",
              ends_at: "2026-06-15T16:00:00+07:00",
            },
          ]);
        },
      ),
    );

    const user = userEvent.setup();
    renderAsStudent("/student/facilities/fac-1/reserve/time");

    const dateInput = await screen.findByLabelText(/tanggal/i);
    await user.type(dateInput, "2026-06-15");

    const slots = await screen.findByRole("list", {
      name: /jadwal yang sudah dipesan/i,
    });
    const items = within(slots).getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent(/seminar nasional pertanian/i);
    expect(items[0]).toHaveTextContent(/09:00/);
    expect(items[0]).toHaveTextContent(/12:00/);
    expect(items[1]).toHaveTextContent(/workshop mahasiswa/i);

    expect(observedStart).toBe("2026-06-15T00:00:00+07:00");
    expect(observedEnd).toBe("2026-06-15T23:59:59+07:00");
  });

  it("validates the selected time and navigates to the details step on success", async () => {
    const observed: { startsAt?: string; endsAt?: string } = {};
    server.use(
      http.get("http://localhost:8000/facilities/fac-1", () =>
        HttpResponse.json(facilityDetail),
      ),
      http.get("http://localhost:8000/facilities/fac-1/calendar", () =>
        HttpResponse.json([]),
      ),
      http.post(
        "http://localhost:8000/facilities/fac-1/reservation-time-selection",
        async ({ request }) => {
          const body = (await request.json()) as {
            starts_at: string;
            ends_at: string;
          };
          observed.startsAt = body.starts_at;
          observed.endsAt = body.ends_at;
          return HttpResponse.json({ available: true, errors: [] });
        },
      ),
    );

    const user = userEvent.setup();
    renderAsStudent("/student/facilities/fac-1/reserve/time");

    await user.type(await screen.findByLabelText(/tanggal/i), "2026-06-15");
    await user.type(screen.getByLabelText(/waktu mulai/i), "09:00");
    await user.type(screen.getByLabelText(/waktu selesai/i), "11:00");
    await user.click(screen.getByRole("button", { name: /lanjutkan/i }));

    expect(
      await screen.findByText(/^detail reservasi$/i),
    ).toBeInTheDocument();
    expect(observed.startsAt).toBe("2026-06-15T09:00:00+07:00");
    expect(observed.endsAt).toBe("2026-06-15T11:00:00+07:00");
  });

  it("shows backend validation messages when the time is rejected", async () => {
    server.use(
      http.get("http://localhost:8000/facilities/fac-1", () =>
        HttpResponse.json(facilityDetail),
      ),
      http.get("http://localhost:8000/facilities/fac-1/calendar", () =>
        HttpResponse.json([]),
      ),
      http.post(
        "http://localhost:8000/facilities/fac-1/reservation-time-selection",
        () =>
          HttpResponse.json({
            available: false,
            errors: [
              {
                reason: "outside_open_hours",
                message: "Waktu yang dipilih di luar jam operasional fasilitas.",
              },
            ],
          }),
      ),
    );

    const user = userEvent.setup();
    renderAsStudent("/student/facilities/fac-1/reserve/time");

    await user.type(await screen.findByLabelText(/tanggal/i), "2026-06-15");
    await user.type(screen.getByLabelText(/waktu mulai/i), "06:00");
    await user.type(screen.getByLabelText(/waktu selesai/i), "07:00");
    await user.click(screen.getByRole("button", { name: /lanjutkan/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(
      /waktu yang dipilih di luar jam operasional fasilitas/i,
    );
    expect(screen.queryByText(/^detail reservasi$/i)).toBeNull();
  });

  it("falls back to a generic Bahasa Indonesia message when validation returns no detail", async () => {
    server.use(
      http.get("http://localhost:8000/facilities/fac-1", () =>
        HttpResponse.json(facilityDetail),
      ),
      http.get("http://localhost:8000/facilities/fac-1/calendar", () =>
        HttpResponse.json([]),
      ),
      http.post(
        "http://localhost:8000/facilities/fac-1/reservation-time-selection",
        () => HttpResponse.json({ available: false, errors: [] }),
      ),
    );

    const user = userEvent.setup();
    renderAsStudent("/student/facilities/fac-1/reserve/time");

    await user.type(await screen.findByLabelText(/tanggal/i), "2026-06-15");
    await user.type(screen.getByLabelText(/waktu mulai/i), "09:00");
    await user.type(screen.getByLabelText(/waktu selesai/i), "11:00");
    await user.click(screen.getByRole("button", { name: /lanjutkan/i }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/waktu yang dipilih tidak valid/i);
  });

  it("shows an error alert when the facility fetch fails", async () => {
    server.use(
      http.get("http://localhost:8000/facilities/fac-1", () =>
        HttpResponse.json(
          { detail: "Layanan fasilitas sedang tidak tersedia." },
          { status: 500 },
        ),
      ),
    );

    renderAsStudent("/student/facilities/fac-1/reserve/time");

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(
      /layanan fasilitas sedang tidak tersedia/i,
    );
  });
});
