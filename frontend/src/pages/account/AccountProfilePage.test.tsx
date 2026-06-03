import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SESSION_TOKEN_KEY } from "../../auth/session";
import { renderWithProviders } from "../../test/render";
import { StaffProfilePage, SuperAdminProfilePage } from "./AccountProfilePage";

function jsonResponse(body: unknown, status = 200) {
  return Promise.resolve(
    new Response(JSON.stringify(body), {
      headers: { "Content-Type": "application/json" },
      status,
    }),
  );
}

describe("account profile pages", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    sessionStorage.clear();
  });

  it("shows only staff account fields on the staff profile page", async () => {
    sessionStorage.setItem(SESSION_TOKEN_KEY, "staff-token");
    vi.spyOn(globalThis, "fetch").mockImplementation((input) => {
      const url = String(input);

      if (url === "http://localhost:8000/auth/me") {
        return jsonResponse({
          academic_profile: null,
          email: "staff@apps.ipb.ac.id",
          faculty: "Fakultas Matematika dan Ilmu Pengetahuan Alam",
          full_name: "Bagus Saputra",
          id: "staff-1",
          is_active: true,
          nip: "1987654321",
          phone: "081234567890",
          role: "staff",
        });
      }

      return jsonResponse({ detail: `Unhandled ${url}` }, 404);
    });

    renderWithProviders(<StaffProfilePage />, { initialEntries: ["/staff/profile"] });

    expect(await screen.findByRole("heading", { name: "Profil Akun" })).toBeVisible();
    expect(screen.getByText("Staff")).toBeVisible();
    expect(screen.getByText("staff@apps.ipb.ac.id")).toBeVisible();
    expect(screen.getByText("081234567890")).toBeVisible();
    expect(screen.getByText("1987654321")).toBeVisible();
    expect(screen.getByText("Fakultas Matematika dan Ilmu Pengetahuan Alam")).toBeVisible();
    expect(screen.queryByText("NIM")).not.toBeInTheDocument();
    expect(screen.queryByText("Program Studi")).not.toBeInTheDocument();
    expect(screen.queryByText("Tahun Masuk")).not.toBeInTheDocument();
    expect(screen.queryByText("Strata")).not.toBeInTheDocument();
  });

  it("shows only role and email on the super admin profile page", async () => {
    sessionStorage.setItem(SESSION_TOKEN_KEY, "admin-token");
    vi.spyOn(globalThis, "fetch").mockImplementation((input) => {
      const url = String(input);

      if (url === "http://localhost:8000/auth/me") {
        return jsonResponse({
          academic_profile: null,
          email: "super@apps.ipb.ac.id",
          full_name: "Super Admin",
          id: "admin-1",
          is_active: true,
          phone: "081234567890",
          role: "super_admin",
        });
      }

      return jsonResponse({ detail: `Unhandled ${url}` }, 404);
    });

    renderWithProviders(<SuperAdminProfilePage />, { initialEntries: ["/super-admin/profile"] });

    expect(await screen.findByRole("heading", { name: "Profil Akun" })).toBeVisible();
    expect(screen.getByText("Super Admin")).toBeVisible();
    expect(screen.getByText("super@apps.ipb.ac.id")).toBeVisible();
    expect(screen.getByText("Role")).toBeVisible();
    expect(screen.getByText("Email")).toBeVisible();
    expect(screen.queryByText("Nomor Telepon")).not.toBeInTheDocument();
    expect(screen.queryByText("NIP")).not.toBeInTheDocument();
    expect(screen.queryByText("Fakultas")).not.toBeInTheDocument();
    expect(screen.queryByText("NIM")).not.toBeInTheDocument();
  });
});
