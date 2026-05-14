import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, vi } from "vitest";
import TagList from "./TagList";

describe("TagList", () => {
  it("renders all tags and calls onTagClick when selecting one", async () => {
    const user = userEvent.setup();
    const onTagClick = vi.fn();

    render(<TagList onTagClick={onTagClick} tags={["tag-1", "tag-2"]} />);

    await user.click(screen.getByRole("button", { name: "tag-2" }));

    expect(onTagClick).toHaveBeenCalledWith("tag-2");
  });

  it("renders nothing when tags are empty", () => {
    render(<TagList onTagClick={vi.fn()} tags={[]} />);

    expect(screen.queryByText("Tags")).not.toBeInTheDocument();
  });
});
