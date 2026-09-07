import { API_URL } from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, it } from "vitest";
import LicensesPage from "./LicensesPage";
import { ROUTES } from "@/libs/routes";

describe("LicensesPage", () => {
  it("renders the loading state while fetching licenses", () => {
    setEndpointStatus({ status: "loading", path: "legacy-licenses" });

    renderWithProviders(<LicensesPage />);

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("renders the licenses table", async () => {
    renderWithProviders(<LicensesPage />);

    expect(
      await screen.findByRole("columnheader", { name: "Seats free" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Add license" })).toHaveAttribute(
      "href",
      expect.stringContaining("ubuntu.com/pro"),
    );
    expect(
      screen.getByRole("link", {
        name: /instances without a Landscape license/i,
      }),
    ).toHaveAttribute(
      "href",
      ROUTES.instances.root({ query: "license-id:none" }),
    );
  });

  it("renders the empty state when there are no licenses", async () => {
    server.use(
      http.get(`${API_URL}legacy-licenses`, () => HttpResponse.json([])),
    );

    renderWithProviders(<LicensesPage />);

    expect(await screen.findByText("No licenses found")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Add license" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", {
        name: /instances without a Landscape license/i,
      }),
    ).toBeInTheDocument();
  });
});
