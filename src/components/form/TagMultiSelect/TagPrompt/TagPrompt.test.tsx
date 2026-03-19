import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, vi } from "vitest";
import TagPrompt from "./TagPrompt";

describe("TagPrompt", () => {
  it("renders search prompt and adds tag when clicked", async () => {
    const user = userEvent.setup();
    const onTagAdd = vi.fn();

    render(<TagPrompt onTagAdd={onTagAdd} search="infra" />);

    expect(screen.getByText("Search for")).toBeInTheDocument();
    expect(screen.getByText("infra")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Add tag" }));

    expect(onTagAdd).toHaveBeenCalled();
  });

  it("renders nothing when search value is empty", () => {
    render(<TagPrompt onTagAdd={vi.fn()} search="" />);

    expect(
      screen.queryByRole("button", { name: "Add tag" }),
    ).not.toBeInTheDocument();
  });
});
