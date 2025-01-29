import { describe } from "vitest";
import TablePaginationBase from "./TablePaginationBase";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { ComponentProps } from "react";
import { PAGE_SIZE_OPTIONS } from "./constants";

describe("TablePaginationBase", () => {
  const paginate = vi.fn();
  const setPageSize = vi.fn();

  const props: ComponentProps<typeof TablePaginationBase> = {
    currentItemCount: 20,
    currentPage: 1,
    pageSize: 20,
    paginate,
    setPageSize,
    totalItems: 21,
  };

  beforeEach(() => {
    paginate.mockClear();
    setPageSize.mockClear();
  });

  it("should not render if there are no items", () => {
    render(
      <TablePaginationBase {...props} currentItemCount={0} totalItems={0} />,
    );

    expect(
      screen.queryByText("Showing 0 of 0 results"),
    ).not.toBeInTheDocument();
  });

  describe("results", () => {
    it('should say "result" when there is one item', () => {
      render(
        <TablePaginationBase {...props} currentItemCount={1} totalItems={1} />,
      );

      expect(screen.getByText("Showing 1 of 1 result")).toBeInTheDocument();
    });

    it('should say "results" when there are many items', () => {
      render(
        <TablePaginationBase {...props} currentItemCount={2} totalItems={2} />,
      );

      expect(screen.getByText("Showing 2 of 2 results")).toBeInTheDocument();
    });
  });

  describe("controls", () => {
    it("should not render controls when there is only one page", () => {
      render(<TablePaginationBase {...props} totalItems={20} />);

      expect(screen.queryByText("Page")).not.toBeInTheDocument();
    });

    it("should render controls when there are many pages", () => {
      render(<TablePaginationBase {...props} />);

      expect(screen.queryByText("Page")).toBeInTheDocument();
    });
  });

  it("should change the page size", async () => {
    render(<TablePaginationBase {...props} currentPage={2} />);

    const pageSizeOption = PAGE_SIZE_OPTIONS[1];

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Instances per page" }),
      pageSizeOption.label,
    );

    expect(paginate).toHaveBeenLastCalledWith(1);
    expect(setPageSize).toHaveBeenLastCalledWith(pageSizeOption.value);
  });

  describe("paginate", () => {
    it("should go to the next page", async () => {
      render(<TablePaginationBase {...props} />);

      await userEvent.click(screen.getByRole("button", { name: "Next page" }));

      expect(paginate).toHaveBeenLastCalledWith(2);
    });

    it("should go to the previous page", async () => {
      render(<TablePaginationBase {...props} currentPage={2} />);

      await userEvent.click(
        screen.getByRole("button", { name: "Previous page" }),
      );

      expect(paginate).toHaveBeenLastCalledWith(1);
    });
  });
});
