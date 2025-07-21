import { renderWithProviders } from "@/tests/render";
import type { TagsAddPaginationProps } from "./TagsAddPagination";
import TagsAddPagination from "./TagsAddPagination";
import { beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const onNext = vi.fn();
const onPrev = vi.fn();

const props: TagsAddPaginationProps = {
  max: 50,
  current: 2,
  onNext,
  onPrev,
};

describe("TagsAddPagination", () => {
  beforeEach(() => {
    renderWithProviders(<TagsAddPagination {...props} />);
  });

  it("should render correctly", () => {
    expect(
      screen.getByText(`Page ${props.current} of ${props.max}`),
    ).toBeInTheDocument();
  });

  it("should click next", async () => {
    const nextButton = screen.getByRole("button", {
      name: /next page/i,
    });

    await userEvent.click(nextButton);

    expect(onNext).toHaveBeenCalled();
  });

  it("should click previous", async () => {
    const previousButton = screen.getByRole("button", {
      name: /previous page/i,
    });

    await userEvent.click(previousButton);

    expect(onPrev).toHaveBeenCalled();
  });
});
