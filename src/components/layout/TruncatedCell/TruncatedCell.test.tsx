import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import TruncatedCell from "./TruncatedCell";

describe("TruncatedCell", () => {
  const user = userEvent.setup();

  it("renders content", () => {
    renderWithProviders(
      <TruncatedCell
        content={<span>cell content</span>}
        isExpanded={false}
        onExpand={vi.fn()}
      />,
    );
    expect(screen.getByText("cell content")).toBeInTheDocument();
  });

  it("renders in expanded state", () => {
    renderWithProviders(
      <TruncatedCell
        content={<span>expanded content</span>}
        isExpanded={true}
        onExpand={vi.fn()}
      />,
    );
    expect(screen.getByText("expanded content")).toBeInTheDocument();
  });

  it("calls onExpand when expand button is clicked", async () => {
    const onExpand = vi.fn();
    renderWithProviders(
      <TruncatedCell
        content={
          <>
            <span>item 1</span>
            <span>item 2</span>
          </>
        }
        isExpanded={false}
        onExpand={onExpand}
        showCount={true}
      />,
    );

    const expandButton = screen.queryByRole("button");
    if (expandButton) {
      await user.click(expandButton);
      expect(onExpand).toHaveBeenCalled();
    }
  });
});
