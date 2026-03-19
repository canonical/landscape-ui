import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, it, vi } from "vitest";
import TagChips from "./TagChips";

describe("TagChips", () => {
  it("reports overflowing chips count", () => {
    const onOverflowingItemsAmountChange = vi.fn();
    const containerRef = createRef<HTMLDivElement>();

    containerRef.current = {
      querySelectorAll: vi.fn(
        () =>
          [
            { offsetHeight: 20, offsetTop: 20 },
            { offsetHeight: 20, offsetTop: 25 },
            { offsetHeight: 20, offsetTop: 30 },
          ] as unknown as NodeListOf<HTMLSpanElement>,
      ),
    } as unknown as HTMLDivElement;

    render(
      <TagChips
        containerRef={containerRef}
        onDismiss={vi.fn()}
        onOverflowingItemsAmountChange={onOverflowingItemsAmountChange}
        tagData={["tag-1", "tag-2", "tag-3"]}
      />,
    );

    expect(onOverflowingItemsAmountChange).toHaveBeenCalledWith(2);
  });

  it("calls onDismiss with the dismissed chip value", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();

    render(
      <TagChips
        containerRef={createRef<HTMLDivElement>()}
        onDismiss={onDismiss}
        onOverflowingItemsAmountChange={vi.fn()}
        tagData={["tag-1", "tag-2"]}
      />,
    );

    const dismissButtons = screen.getAllByRole("button", { name: "Dismiss" });
    const secondDismissButton = dismissButtons.at(1);

    assert(secondDismissButton);

    await user.click(secondDismissButton);

    expect(onDismiss).toHaveBeenCalledWith("tag-2");
  });
});
