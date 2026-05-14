import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ModalTablePagination from "./ModalTablePagination";
import type { ModalTablePaginationProps } from "./ModalTablePagination";

const onNext = vi.fn();
const onPrev = vi.fn();

const defaultProps: ModalTablePaginationProps = {
  max: 5,
  current: 3,
  onNext,
  onPrev,
};

describe("ModalTablePagination", () => {
  const user = userEvent.setup();

  it("returns null when max <= 1", () => {
    renderWithProviders(<ModalTablePagination {...defaultProps} max={1} />);
    expect(screen.queryByText(/Page/)).not.toBeInTheDocument();
  });

  it("shows 'Page X of Y'", () => {
    renderWithProviders(<ModalTablePagination {...defaultProps} />);
    expect(screen.getByText("Page 3 of 5")).toBeInTheDocument();
  });

  it("disables prev button when current is 1", () => {
    renderWithProviders(<ModalTablePagination {...defaultProps} current={1} />);
    expect(
      screen.getByRole("button", { name: /previous page/i }),
    ).toHaveAttribute("aria-disabled", "true");
    expect(
      screen.getByRole("button", { name: /next page/i }),
    ).not.toHaveAttribute("aria-disabled", "true");
  });

  it("disables next button when current equals max", () => {
    renderWithProviders(<ModalTablePagination {...defaultProps} current={5} />);
    expect(screen.getByRole("button", { name: /next page/i })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(
      screen.getByRole("button", { name: /previous page/i }),
    ).not.toHaveAttribute("aria-disabled", "true");
  });

  it("calls onNext when next button is clicked", async () => {
    renderWithProviders(<ModalTablePagination {...defaultProps} />);
    await user.click(screen.getByRole("button", { name: /next page/i }));
    expect(onNext).toHaveBeenCalled();
  });

  it("calls onPrev when prev button is clicked", async () => {
    renderWithProviders(<ModalTablePagination {...defaultProps} />);
    await user.click(screen.getByRole("button", { name: /previous page/i }));
    expect(onPrev).toHaveBeenCalled();
  });
});
