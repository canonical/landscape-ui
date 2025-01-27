import { describe } from "vitest";
import SidePanelTablePagination from "./SidePanelTablePagination";
import { render } from "@testing-library/react";

describe("TablePaginationBase", () => {
  it("should render", () => {
    render(
      <SidePanelTablePagination
        currentPage={1}
        pageSize={20}
        paginate={vi.fn()}
        setPageSize={vi.fn()}
        totalItems={1}
      />,
    );
  });
});
