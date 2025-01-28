import { describe, expect } from "vitest";
import TablePagination from "./TablePagination";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/tests/render";

describe("TablePagination", () => {
  describe("currentPage", () => {
    it("should change the page number", async () => {
      const clearSelection = vi.fn();

      renderWithProviders(
        <TablePagination
          currentItemCount={1}
          handleClearSelection={clearSelection}
          totalItems={21}
        />,
        undefined,
        "?currentPage=1",
      );

      await userEvent.click(screen.getByRole("button", { name: "Next page" }));

      expect(clearSelection).toHaveBeenLastCalledWith();

      expect(screen.getByRole<HTMLInputElement>("spinbutton")).toHaveValue(2);
    });

    it("should use searchParams", async () => {
      const clearSelection = vi.fn();

      renderWithProviders(
        <TablePagination
          currentItemCount={1}
          handleClearSelection={clearSelection}
          totalItems={21}
        />,
        undefined,
        "?currentPage=2",
      );

      expect(screen.getByRole<HTMLInputElement>("spinbutton")).toHaveValue(2);
    });
  });

  describe("pageSize", () => {
    it("should change the page size", async () => {
      renderWithProviders(
        <TablePagination currentItemCount={1} totalItems={21} />,
      );

      await userEvent.selectOptions(
        screen.getByRole("combobox", { name: "Instances per page" }),
        "50 / page",
      );

      expect(
        screen.queryByRole<HTMLInputElement>("spinbutton"),
      ).not.toBeInTheDocument();
    });

    it("should use searchParams", async () => {
      const clearSelection = vi.fn();

      renderWithProviders(
        <TablePagination
          currentItemCount={1}
          handleClearSelection={clearSelection}
          totalItems={21}
        />,
        undefined,
        "?pageSize=50",
      );

      expect(
        screen.queryByRole<HTMLInputElement>("spinbutton"),
      ).not.toBeInTheDocument();
    });
  });
});
