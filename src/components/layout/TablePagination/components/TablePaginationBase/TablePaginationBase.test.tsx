import { describe } from "vitest";
import TablePaginationBase from "./TablePaginationBase";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";

describe("TablePaginationBase", () => {
  it("should not render if there are no items", () => {
    const paginate = vi.fn();
    const setPageSize = vi.fn();

    render(
      <TablePaginationBase
        currentPage={1}
        pageSize={20}
        paginate={paginate}
        setPageSize={setPageSize}
      />,
    );

    expect(screen.queryByText("Showing")).not.toBeInTheDocument();
  });

  describe("results", () => {
    it('should say "result" when there is one item', () => {
      const paginate = vi.fn();
      const setPageSize = vi.fn();

      render(
        <TablePaginationBase
          currentItemCount={1}
          currentPage={1}
          pageSize={20}
          paginate={paginate}
          setPageSize={setPageSize}
          totalItems={1}
        />,
      );

      expect(screen.getByText("Showing 1 of 1 result")).toBeInTheDocument();
      expect(screen.queryByText("results")).not.toBeInTheDocument();
    });

    it('should say "results" when there are many items', () => {
      const paginate = vi.fn();
      const setPageSize = vi.fn();

      render(
        <TablePaginationBase
          currentItemCount={2}
          currentPage={1}
          pageSize={20}
          paginate={paginate}
          setPageSize={setPageSize}
          totalItems={2}
        />,
      );

      expect(screen.getByText("Showing 2 of 2 results")).toBeInTheDocument();
    });
  });

  describe("controls", () => {
    it("should not render controls when there is only one page", () => {
      const paginate = vi.fn();
      const setPageSize = vi.fn();

      render(
        <TablePaginationBase
          currentItemCount={1}
          currentPage={1}
          pageSize={20}
          paginate={paginate}
          setPageSize={setPageSize}
          totalItems={1}
        />,
      );

      expect(screen.queryByText("Page")).not.toBeInTheDocument();
    });

    it("should render controls when there are many pages", () => {
      const paginate = vi.fn();
      const setPageSize = vi.fn();

      render(
        <TablePaginationBase
          currentItemCount={20}
          currentPage={1}
          pageSize={20}
          paginate={paginate}
          setPageSize={setPageSize}
          totalItems={21}
        />,
      );

      expect(screen.queryByText("Page")).toBeInTheDocument();
    });
  });

  describe("pageSize", () => {
    it("should change the page size", async () => {
      const paginate = vi.fn();
      const setPageSize = vi.fn();

      render(
        <TablePaginationBase
          currentItemCount={1}
          currentPage={2}
          pageSize={20}
          paginate={paginate}
          setPageSize={setPageSize}
          totalItems={21}
        />,
      );

      await userEvent.selectOptions(
        screen.getByRole("combobox", { name: "Instances per page" }),
        "50 / page",
      );

      expect(paginate).toHaveBeenLastCalledWith(1);
      expect(setPageSize).toHaveBeenLastCalledWith(50);
    });
  });

  describe("paginate", () => {
    it("should go to the next page", async () => {
      const paginate = vi.fn();
      const setPageSize = vi.fn();

      render(
        <TablePaginationBase
          currentItemCount={20}
          currentPage={1}
          pageSize={20}
          paginate={paginate}
          setPageSize={setPageSize}
          totalItems={21}
        />,
      );

      await userEvent.click(screen.getByRole("button", { name: "Next page" }));

      expect(paginate).toHaveBeenLastCalledWith(2);
    });

    it("should go to the previous page", async () => {
      const paginate = vi.fn();
      const setPageSize = vi.fn();

      render(
        <TablePaginationBase
          currentItemCount={1}
          currentPage={2}
          pageSize={20}
          paginate={paginate}
          setPageSize={setPageSize}
          totalItems={21}
        />,
      );

      await userEvent.click(
        screen.getByRole("button", { name: "Previous page" }),
      );

      expect(paginate).toHaveBeenLastCalledWith(1);
    });
  });
});
