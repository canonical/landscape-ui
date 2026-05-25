import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PATHS, ROUTES } from "@/libs/routes";
import { renderWithProviders } from "@/tests/render";
import AlertsPage from "./AlertsPage";

describe("AlertsPage", () => {
  it("renders alerts table content", async () => {
    renderWithProviders(
      <AlertsPage />,
      undefined,
      ROUTES.account.alerts(),
      `/${PATHS.account.root}/${PATHS.account.alerts}`,
    );

    expect(screen.getByRole("heading", { name: "Alerts" })).toBeInTheDocument();
    expect(
      await screen.findByText("Computer Duplicate Alert"),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("switch").length).toBeGreaterThan(0);
    expect(
      screen.getAllByRole("combobox", { name: "Select tags" }).length,
    ).toBeGreaterThan(0);
    expect(screen.queryByText("License Seats Alert")).not.toBeInTheDocument();
  });
});
