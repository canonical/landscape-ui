import { setEndpointStatus } from "@/tests/controllers/controller";
import { setHealthFixture } from "@/tests/mocks/health";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import FleetHealthTrend from "./FleetHealthTrend";

const MOST_OF_A_MONTH = 20;

afterEach(() => {
  setHealthFixture("mixedFleet");
  setEndpointStatus("default");
});

describe("FleetHealthTrend", () => {
  it("draws the average score and the change over the last week", async () => {
    renderWithProviders(<FleetHealthTrend />);

    const table = await screen.findByRole("table", {
      name: "Average score by day",
    });
    // 31 days in the window, less the night the archive did not run.
    expect(within(table).getAllByRole("row").length).toBeGreaterThan(
      MOST_OF_A_MONTH,
    );
    expect(
      screen.getByText(/^(Up|Down) \d+ points?$|^No change$/),
    ).toBeVisible();
    expect(screen.getByText("Rules changed")).toBeInTheDocument();
  });

  it("says the comparison is not like for like across a rules change", async () => {
    renderWithProviders(<FleetHealthTrend />);
    await screen.findByRole("table");
    // The mocked rules changed 12 days ago, outside the week compared.
    expect(
      screen.queryByText(/were not scored the same way/),
    ).not.toBeInTheDocument();
  });

  it("switches the range", async () => {
    const user = userEvent.setup();
    renderWithProviders(<FleetHealthTrend />);
    await screen.findByRole("table");

    const year = screen.getByRole("radio", { name: "1 year" });
    await user.click(year);

    expect(year).toBeChecked();
    expect(screen.getByRole("radio", { name: "30 days" })).not.toBeChecked();
  });

  it("explains an empty history", async () => {
    setHealthFixture("emptyFleet");
    renderWithProviders(<FleetHealthTrend />);
    expect(await screen.findByText(/No history yet/)).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("reports a failed request", async () => {
    setEndpointStatus("error");
    renderWithProviders(<FleetHealthTrend />);
    expect(
      await screen.findByText("The fleet health history could not be loaded."),
    ).toBeInTheDocument();
  });
});
