import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ActivitiesDateFilter from "./ActivitiesDateFilter";

const fromDate = "2024-01-01T10:00";
const toDate = "2024-12-31T18:00";
const emptyValues = { fromDate: "", toDate: "" };
const props = { ...emptyValues, onChange: vi.fn() };

describe("ActivitiesDateFilter", () => {
  const user = userEvent.setup();

  it("renders the date range filter button", () => {
    renderWithProviders(<ActivitiesDateFilter {...props} />);

    expect(
      screen.getByRole("button", { name: /date range/i }),
    ).toBeInTheDocument();
  });

  it("opens the filter menu and displays date inputs", async () => {
    renderWithProviders(<ActivitiesDateFilter {...props} />);

    const filterButton = screen.getByRole("button", { name: /date range/i });
    await user.click(filterButton);

    expect(screen.getByLabelText(/from/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/to/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /reset/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /apply/i })).toBeInTheDocument();
  });

  it("resets the date range filter", async () => {
    renderWithProviders(
      <ActivitiesDateFilter {...props} fromDate={fromDate} toDate={toDate} />,
    );
    const filterButton = screen.getByRole("button", { name: /date range/i });
    await user.click(filterButton);
    const fromInput = screen.getByDisplayValue(fromDate);
    expect(fromInput).toBeInTheDocument();
    const toInput = screen.getByDisplayValue(toDate);
    expect(toInput).toBeInTheDocument();

    const resetButton = screen.getByRole("button", { name: /reset/i });
    await user.click(resetButton);

    expect(props.onChange).toHaveBeenCalledWith(emptyValues);
  });

  it("displays badge when one filter is active", () => {
    renderWithProviders(
      <ActivitiesDateFilter {...props} fromDate={fromDate} />,
    );

    const badge = screen.getByText("1");
    expect(badge).toBeInTheDocument();
  });

  it("displays badge with value 2 when both filters are active", () => {
    renderWithProviders(
      <ActivitiesDateFilter {...props} fromDate={fromDate} toDate={toDate} />,
    );

    const badge = screen.getByText("2");
    expect(badge).toBeInTheDocument();
  });

  it("does not display badge when no filters are active", () => {
    renderWithProviders(<ActivitiesDateFilter {...props} />);

    expect(screen.queryByText("1")).not.toBeInTheDocument();
    expect(screen.queryByText("2")).not.toBeInTheDocument();
  });

  it("closes menu after clicking reset", async () => {
    renderWithProviders(
      <ActivitiesDateFilter {...props} fromDate={fromDate} />,
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

  it("submits the form with date values when Apply is clicked", async () => {
    renderWithProviders(<ActivitiesDateFilter {...props} />);

    const filterButton = screen.getByRole("button", { name: /date range/i });
    await user.click(filterButton);

    const fromInput = screen.getByLabelText(/from/i);
    const toInput = screen.getByLabelText(/to/i);

    await user.type(fromInput, fromDate);
    await user.type(toInput, toDate);

    const applyButton = screen.getByRole("button", { name: /apply/i });
    await user.click(applyButton);

    // Menu closes after successful submit
    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /apply/i }),
      ).not.toBeInTheDocument();
    });
  });
});
