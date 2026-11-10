import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SearchHelpPopup from "./SearchHelpPopup";

describe("SearchHelpPopup", () => {
  it("shows updated rows when data changes", () => {
    const onClose = vi.fn();
    const { rerender } = render(
      <SearchHelpPopup
        open
        onClose={onClose}
        data={[{ term: "status:online", description: "Online instances" }]}
      />,
    );

    rerender(
      <SearchHelpPopup
        open
        onClose={onClose}
        data={[
          { term: "needs:reboot", description: "Instances needing a reboot" },
        ]}
      />,
    );

    const dialog = screen.getByRole("dialog", { name: "Search help" });
    expect(within(dialog).getByText("needs:reboot")).toBeInTheDocument();
    expect(within(dialog).queryByText("status:online")).not.toBeInTheDocument();
  });

  it("preserves table rows when closed and reopened", () => {
    const props = {
      onClose: vi.fn(),
      data: [{ term: "status:online", description: "Online instances" }],
    };
    const { rerender } = render(<SearchHelpPopup open {...props} />);

    expect(
      within(screen.getByRole("dialog", { name: "Search help" })).getByText(
        "status:online",
      ),
    ).toBeInTheDocument();

    rerender(<SearchHelpPopup open={false} {...props} />);
    expect(screen.queryByRole("dialog", { name: "Search help" })).toBeNull();

    rerender(<SearchHelpPopup open {...props} />);
    expect(
      within(screen.getByRole("dialog", { name: "Search help" })).getByText(
        "status:online",
      ),
    ).toBeInTheDocument();
  });
});
