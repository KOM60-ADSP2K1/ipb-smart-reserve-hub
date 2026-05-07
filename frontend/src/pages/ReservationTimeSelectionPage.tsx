import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost, type ApiError } from "../lib/api-client";
import type { FacilityDetail } from "../lib/types";

interface ReservationTimeSelectionResult {
  available: boolean;
  errors: { reason: string; message: string }[];
}

interface FacilityCalendarEntry {
  facility_name: string;
  activity_title: string;
  organization_unit: string;
  starts_at: string;
  ends_at: string;
}

const JAKARTA_OFFSET = "+07:00";

function dayBoundsIso(date: string): { start: string; end: string } {
  return {
    start: `${date}T00:00:00${JAKARTA_OFFSET}`,
    end: `${date}T23:59:59${JAKARTA_OFFSET}`,
  };
}

function formatJakartaTime(iso: string): string {
  const match = iso.match(/T(\d{2}):(\d{2})/);
  return match ? `${match[1]}:${match[2]}` : iso;
}

export function ReservationTimeSelectionPage() {
  const { facilityId } = useParams<{ facilityId: string }>();
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const validateMutation = useMutation<
    ReservationTimeSelectionResult,
    ApiError,
    { startsAt: string; endsAt: string }
  >({
    mutationFn: ({ startsAt, endsAt }) =>
      apiPost<ReservationTimeSelectionResult>(
        `/facilities/${facilityId}/reservation-time-selection`,
        { starts_at: startsAt, ends_at: endsAt },
      ),
  });

  const {
    data: facility,
    isPending: facilityPending,
    error: facilityError,
  } = useQuery<FacilityDetail, ApiError>({
    queryKey: ["facility-detail", facilityId],
    queryFn: () => apiGet<FacilityDetail>(`/facilities/${facilityId}`),
    retry: false,
    enabled: Boolean(facilityId),
  });

  const { data: calendarEntries } = useQuery<FacilityCalendarEntry[], ApiError>({
    queryKey: ["facility-calendar", facilityId, date],
    queryFn: () => {
      const { start, end } = dayBoundsIso(date);
      const params = new URLSearchParams({ start, end });
      return apiGet<FacilityCalendarEntry[]>(
        `/facilities/${facilityId}/calendar?${params.toString()}`,
      );
    },
    retry: false,
    enabled: Boolean(facilityId) && Boolean(date),
  });

  if (facilityError) {
    return (
      <p
        role="alert"
        className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800"
      >
        {facilityError.detail || "Gagal memuat detail fasilitas."}
      </p>
    );
  }

  return (
    <article className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Pilih Waktu Reservasi</h2>
        {facilityPending ? (
          <p className="text-text-secondary">Memuat detail fasilitas…</p>
        ) : facility ? (
          <p className="text-text-secondary">{facility.name}</p>
        ) : null}
      </header>

      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!date || !startTime || !endTime) return;
          const startsAt = `${date}T${startTime}:00${JAKARTA_OFFSET}`;
          const endsAt = `${date}T${endTime}:00${JAKARTA_OFFSET}`;
          validateMutation.mutate(
            { startsAt, endsAt },
            {
              onSuccess: (result) => {
                if (result.available) {
                  const params = new URLSearchParams({
                    startsAt,
                    endsAt,
                  });
                  navigate(
                    `/student/facilities/${facilityId}/reserve/details?${params.toString()}`,
                  );
                }
              },
            },
          );
        }}
      >
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium">Tanggal</span>
          <input
            type="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded border border-border px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Waktu mulai</span>
            <input
              type="time"
              name="startTime"
              step={300}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="rounded border border-border px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium">Waktu selesai</span>
            <input
              type="time"
              name="endTime"
              step={300}
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="rounded border border-border px-3 py-2 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </label>
        </div>

        <div>
          <button
            type="submit"
            disabled={validateMutation.isPending}
            className="rounded bg-primary px-6 py-3 font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-60"
          >
            {validateMutation.isPending ? "Memvalidasi…" : "Lanjutkan"}
          </button>
        </div>

        {validateMutation.data && !validateMutation.data.available && (
          <div
            role="alert"
            className="rounded border border-red-300 bg-red-50 p-3 text-sm text-red-800"
          >
            {validateMutation.data.errors.length > 0 ? (
              <ul className="flex flex-col gap-1">
                {validateMutation.data.errors.map((err) => (
                  <li key={err.reason}>{err.message}</li>
                ))}
              </ul>
            ) : (
              <p>Waktu yang dipilih tidak valid.</p>
            )}
          </div>
        )}
      </form>

      {calendarEntries && (
        <section className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold" id="reserved-slots-heading">
            Jadwal yang sudah dipesan
          </h3>
          {calendarEntries.length === 0 ? (
            <p className="text-text-secondary">
              Belum ada jadwal yang dipesan pada tanggal ini.
            </p>
          ) : (
            <ul
              aria-labelledby="reserved-slots-heading"
              className="flex flex-col gap-2"
            >
              {calendarEntries.map((entry) => (
                <li
                  key={`${entry.starts_at}-${entry.activity_title}`}
                  className="rounded border border-border p-3 text-sm"
                >
                  <p className="font-medium">{entry.activity_title}</p>
                  <p className="text-text-secondary">
                    {entry.organization_unit}
                  </p>
                  <p className="text-text-secondary">
                    {formatJakartaTime(entry.starts_at)}–
                    {formatJakartaTime(entry.ends_at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </article>
  );
}
