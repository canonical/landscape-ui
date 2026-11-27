import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import ModalTablePagination from "./ModalTablePagination";
import type { ModalTablePaginationProps } from "./ModalTablePagination";

const defaultProps: ModalTablePaginationProps = {
  max: 5,
  current: 3,
  onNext: vi.fn(),
  onPrev: vi.fn(),
};

describe("ModalTablePagination", () => {
  it("does not render when there is 1 page", () => {
    renderWithProviders(<ModalTablePagination {...defaultProps} max={1} />);

    expect(screen.queryByText(/Page/)).not.toBeInTheDocument();
  });

  it("shows 'Page X of Y'", () => {
    renderWithProviders(<ModalTablePagination {...defaultProps} />);

    expect(screen.getByText("Page 3 of 5")).toBeInTheDocument();
  });

  it("disables prev button when current is 1", () => {
    const warnSpy = vi.spyOn(console, "warn").mockReturnValue(undefined);
    renderWithProviders(<ModalTablePagination {...defaultProps} current={1} />);

    const prevButton = screen.getByRole("button", { name: /previous page/i });
    const nextButton = screen.getByRole("button", { name: /next page/i });
    expect(prevButton).toBeDisabled();
    expect(prevButton).toHaveClass("ds", "button", "tertiary");
    expect(prevButton).toHaveIcon("chevron-left");
    expect(nextButton).toBeEnabled();
    expect(nextButton).toHaveIcon("chevron-right");
    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("disables next button when current equals max", () => {
    renderWithProviders(<ModalTablePagination {...defaultProps} current={5} />);

    expect(screen.getByRole("button", { name: /next page/i })).toBeDisabled();
    expect(
      screen.getByRole("button", { name: /previous page/i }),
    ).toBeEnabled();
  });

  it("calls onNext when next button is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(<ModalTablePagination {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: /next page/i }));
    expect(defaultProps.onNext).toHaveBeenCalled();
  });

  it("calls onPrev when prev button is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(<ModalTablePagination {...defaultProps} />);

    await user.click(screen.getByRole("button", { name: /previous page/i }));
    expect(defaultProps.onPrev).toHaveBeenCalled();
  });
});
