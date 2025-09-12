import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ModalTablePaginationProps } from "./ModalTablePagination";
import ModalTablePagination from "./ModalTablePagination";

const onNext = vi.fn();
const onPrev = vi.fn();

const props: ModalTablePaginationProps = {
  max: 50,
  current: 2,
  onNext,
  onPrev,
};

describe("ModalTablePagination", () => {
  it("paginates", async () => {
    renderWithProviders(<ModalTablePagination {...props} />);

    expect(
      screen.getByText(`Page ${props.current} of ${props.max}`),
    ).toBeInTheDocument();

    const nextButton = screen.getByRole("button", {
      name: /next page/i,
    });
    const previousButton = screen.getByRole("button", {
      name: /previous page/i,
    });

    const user = userEvent.setup();
    await user.click(nextButton);
    expect(onNext).toHaveBeenCalled();
    await user.click(previousButton);
    expect(onPrev).toHaveBeenCalled();
  });

  it("doesn't render when there is only one page", () => {
    renderWithProviders(<ModalTablePagination {...props} max={1} />);

    expect(
      screen.queryByText(`Page ${props.current} of ${props.max}`),
    ).not.toBeInTheDocument();
  });
});
