/* eslint-disable @typescript-eslint/no-magic-numbers */
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import TokenBasedTablePagination from "./TokenBasedTablePagination";

const defaultProps = {
  currentItemCount: 10,
  totalItemCount: 15,
  isTotalExact: true,
  hasNextPage: true,
  hasPreviousPage: true,
  goToNextPage: vi.fn(),
  goToPreviousPage: vi.fn(),
  pageSizeControl: {
    pageSize: 50,
    setPageSize: vi.fn(),
  },
};

describe("TokenBasedTablePagination", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("does not render when there is exactly 0 items", () => {
    renderWithProviders(
      <TokenBasedTablePagination {...defaultProps} totalItemCount={0} />,
    );

    expect(screen.queryByText(/Advance by:/)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("combobox", { name: /items per page/i }),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/Showing/)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /previous page/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /next page/i }),
    ).not.toBeInTheDocument();
  });

  it("renders controls when there are no items but total is not exact", () => {
    renderWithProviders(
      <TokenBasedTablePagination
        {...defaultProps}
        totalItemCount={0}
        isTotalExact={false}
      />,
    );

    expect(screen.queryByText(/Showing/)).not.toBeInTheDocument();

    expect(screen.getByText(/Advance by:/)).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /items per page/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /previous page/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /next page/i }),
    ).toBeInTheDocument();
  });

  it("shows exact count information and no page size controls", () => {
    renderWithProviders(
      <TokenBasedTablePagination
        {...defaultProps}
        pageSizeControl={undefined}
      />,
    );

    expect(screen.queryByText(/Advance by:/)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("combobox", { name: /items per page/i }),
    ).not.toBeInTheDocument();

    expect(screen.getByText("Showing 10 of 15 items")).toBeInTheDocument();
  });

  it("shows approximate count information", () => {
    renderWithProviders(
      <TokenBasedTablePagination {...defaultProps} isTotalExact={false} />,
    );

    expect(
      screen.getByText("Showing 10 of more than 15 items"),
    ).toBeInTheDocument();
  });

  it("changes the page size", async () => {
    const user = userEvent.setup();

    renderWithProviders(<TokenBasedTablePagination {...defaultProps} />);

    const select = screen.getByRole("combobox", { name: /items per page/i });
    expect(select).toHaveValue("50");

    await user.selectOptions(select, "20");
    expect(defaultProps.pageSizeControl.setPageSize).toHaveBeenCalledWith(20);
  });

  it("disables pagination buttons when there is only 1 page", () => {
    renderWithProviders(
      <TokenBasedTablePagination
        {...defaultProps}
        hasPreviousPage={false}
        hasNextPage={false}
      />,
    );

    expect(
      screen.getByRole("button", { name: /previous page/i }),
    ).toHaveAttribute("aria-disabled", "true");

    expect(screen.getByRole("button", { name: /next page/i })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("switches pages when pagination buttons are clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(<TokenBasedTablePagination {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: /next page/i }));
    expect(defaultProps.goToNextPage).toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: /previous page/i }));
    expect(defaultProps.goToPreviousPage).toHaveBeenCalled();
  });
});
