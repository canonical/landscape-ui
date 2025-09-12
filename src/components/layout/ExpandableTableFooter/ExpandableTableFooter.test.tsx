import type { ComponentProps } from "react";
import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ExpandableTableFooter from "./ExpandableTableFooter";

const itemCount = 5;
const onLimitChange = vi.fn();
const totalCount = 12;

const props: ComponentProps<typeof ExpandableTableFooter> = {
  itemNames: {
    singular: "item",
    plural: "items",
  },
  itemCount,
  onLimitChange,
  totalCount,
};

describe("ExpandableTableFooter", () => {
  it("should render footer with show more button", async () => {
    const { rerender } = render(<ExpandableTableFooter {...props} />);

    expect(
      screen.getByText(`Showing ${itemCount} of ${totalCount} items.`),
    ).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent(
      `Show ${Math.min(totalCount - itemCount, 5)} more`,
    );

    const newLimit = 10;
    onLimitChange.mockImplementationOnce(() => {
      rerender(<ExpandableTableFooter {...props} itemCount={newLimit} />);
    });

    await userEvent.click(screen.getByRole("button"));

    expect(
      screen.getByText(`Showing ${newLimit} of ${totalCount} items.`),
    ).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent(
      `Show ${Math.min(totalCount - newLimit, 5)} more`,
    );

    onLimitChange.mockImplementationOnce(() => {
      rerender(<ExpandableTableFooter {...props} itemCount={totalCount} />);
    });

    await userEvent.click(screen.getByRole("button"));

    expect(
      screen.getByText(`Showing ${totalCount} of ${totalCount} items.`),
    ).toBeInTheDocument();
    expect(screen.queryByText("button")).not.toBeInTheDocument();
  });

  it("should render footer with additional CTA", () => {
    render(
      <ExpandableTableFooter
        {...props}
        additionalCta={<button>Additional CTA</button>}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Additional CTA" }),
    ).toBeInTheDocument();
  });

  it("should render footer with view all button", () => {
    render(<ExpandableTableFooter {...props} viewAll />);

    expect(
      screen.getByRole("button", { name: "View all" }),
    ).toBeInTheDocument();
  });
});
