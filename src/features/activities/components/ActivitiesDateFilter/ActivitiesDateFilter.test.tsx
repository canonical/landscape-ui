import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ActivitiesDateFilter from "./ActivitiesDateFilter";
import { ROUTES } from "@/libs/routes";

const fromDate = "2024-01-01T10:00";
const toDate = "2024-12-31T18:00";

describe("ActivitiesDateFilter", () => {
  const user = userEvent.setup();

  it("renders the date range filter button", () => {
    renderWithProviders(<ActivitiesDateFilter />);

    expect(
      screen.getByRole("button", { name: /date range/i }),
    ).toBeInTheDocument();
  });

  it("opens the filter menu and displays date inputs", async () => {
    renderWithProviders(<ActivitiesDateFilter />);

    const filterButton = screen.getByRole("button", { name: /date range/i });
    await user.click(filterButton);

    expect(screen.getByLabelText(/from/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/to/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /apply/i })).toBeInTheDocument();
  });

  it("resets the date range filter", async () => {
    renderWithProviders(
      <ActivitiesDateFilter />,
      undefined,
      ROUTES.activities.root({
        fromDate,
        toDate,
      }),
    );
    const filterButton = screen.getByRole("button", { name: /date range/i });
    await user.click(filterButton);
    const fromInput = screen.getByDisplayValue(fromDate);
    expect(fromInput).toBeInTheDocument();
    const toInput = screen.getByDisplayValue(toDate);
    expect(toInput).toBeInTheDocument();

    const resetButton = screen.getByRole("button", { name: /reset/i });
    await user.click(resetButton);

    await user.click(filterButton);

    expect(screen.queryByDisplayValue(fromDate)).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue(toDate)).not.toBeInTheDocument();
  });

  it("displays badge when one filter is active", () => {
    renderWithProviders(
      <ActivitiesDateFilter />,
      undefined,
      ROUTES.activities.root({ fromDate }),
    );

    const badge = screen.getByText("1");
    expect(badge).toBeInTheDocument();
  });

  it("displays badge with value 2 when both filters are active", () => {
    renderWithProviders(
      <ActivitiesDateFilter />,
      undefined,
      ROUTES.activities.root({ fromDate, toDate }),
    );

    const badge = screen.getByText("2");
    expect(badge).toBeInTheDocument();
  });

  it("does not display badge when no filters are active", () => {
    renderWithProviders(<ActivitiesDateFilter />);

    expect(screen.queryByText("1")).not.toBeInTheDocument();
    expect(screen.queryByText("2")).not.toBeInTheDocument();
  });

  it("closes menu after clicking reset", async () => {
    renderWithProviders(
      <ActivitiesDateFilter />,
      undefined,
      ROUTES.activities.root({ fromDate }),
    );

    const filterButton = screen.getByRole("button", { name: /date range/i });
    await user.click(filterButton);

    expect(screen.getByLabelText(/from/i)).toBeInTheDocument();

    const resetButton = screen.getByRole("button", { name: /reset/i });
    await user.click(resetButton);

    await waitFor(() => {
      expect(screen.queryByLabelText(/from/i)).not.toBeInTheDocument();
    });
  });
});
