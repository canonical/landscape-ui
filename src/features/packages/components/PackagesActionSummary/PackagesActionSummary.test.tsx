import { API_URL } from "@/constants";
import { http, HttpResponse } from "msw";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PackagesActionSummary from "./PackagesActionSummary";

describe("PackagesActionSummary", () => {
  it("renders an empty state when the package change plan has no actions", async () => {
    server.use(
      http.get(`${API_URL}package-change-plans/:id/summary`, () =>
        HttpResponse.json({ actions: [], exclusions: [] }),
      ),
    );

    renderWithProviders(
      <PackagesActionSummary
        actionType="unhold"
        onBackButtonPress={() => undefined}
        packageChangePlanId={1}
      />,
    );

    expect(await screen.findByText("No items")).toBeInTheDocument();
    expect(
      screen.getByText("The package change plan is empty."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("listitem")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Unhold 0 packages" }),
    ).toHaveAttribute("aria-disabled", "true");
  });
});
