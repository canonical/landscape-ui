import { describe, expect } from "vitest";
import TablePagination from "./TablePagination";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/tests/render";
import type { ComponentProps } from "react";
import { PAGE_SIZE_OPTIONS } from "../TablePaginationBase/constants";

const props: ComponentProps<typeof TablePagination> = {
  currentItemCount: 1,
  totalItems: 21,
};

describe("TablePagination", () => {
  describe("currentPage", () => {
    it("should change the page number", async () => {
      const clearSelection = vi.fn();

      renderWithProviders(
        <TablePagination {...props} handleClearSelection={clearSelection} />,
      );

      await userEvent.click(screen.getByRole("button", { name: "Next page" }));

      expect(clearSelection).toHaveBeenLastCalledWith();

      expect(screen.getByRole<HTMLInputElement>("spinbutton")).toHaveValue(2);
    });

    it("should use searchParams", async () => {
      renderWithProviders(
        <TablePagination {...props} />,
        undefined,
        "?currentPage=2",
      );

      expect(screen.getByRole<HTMLInputElement>("spinbutton")).toHaveValue(2);
    });
  });

  describe("pageSize", () => {
    it("should change the page size", async () => {
      renderWithProviders(<TablePagination {...props} />);

      await userEvent.selectOptions(
        screen.getByRole("combobox", { name: "Instances per page" }),
        PAGE_SIZE_OPTIONS[1].label,
      );

      expect(
        screen.queryByRole<HTMLInputElement>("spinbutton"),
      ).not.toBeInTheDocument();
    });

    it("should use searchParams", async () => {
      renderWithProviders(
        <TablePagination {...props} />,
        undefined,
        "?pageSize=50",
      );

      expect(
        screen.queryByRole<HTMLInputElement>("spinbutton"),
      ).not.toBeInTheDocument();
    });
  });
});
