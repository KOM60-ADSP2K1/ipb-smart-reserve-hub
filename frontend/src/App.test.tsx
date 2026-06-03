import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "./App";
import { renderWithProviders } from "./test/render";

describe("App routing", () => {
  it("shows the login page at the base route", async () => {
    renderWithProviders(<App />, { initialEntries: ["/"] });

    expect(await screen.findByRole("heading", { name: "Masuk" })).toBeVisible();
  });

  it("shows a not found page for unknown routes instead of the smoke harness", async () => {
    renderWithProviders(<App />, { initialEntries: ["/docs"] });

    expect(await screen.findByRole("heading", { name: "Halaman tidak ditemukan" })).toBeVisible();
    expect(screen.queryByText(/Rute smoke non-produk/i)).not.toBeInTheDocument();
  });
});
