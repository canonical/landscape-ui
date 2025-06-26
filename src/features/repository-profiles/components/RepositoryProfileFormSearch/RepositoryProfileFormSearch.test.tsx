import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import RepositoryProfileFormSearch from "./RepositoryProfileFormSearch";

describe("RepositoryProfileFormSearch", () => {
  const user = userEvent.setup();

  it("emits search text on button click and clears on reset", async () => {
    const onSearchChange = vi.fn();

    renderWithProviders(
      <RepositoryProfileFormSearch
        label="Search"
        onSearchChange={onSearchChange}
      />,
    );

    const input = screen.getByRole("searchbox");

    await user.type(input, "nginx");
    await user.click(screen.getByRole("button", { name: "Search" }));
    expect(onSearchChange).toHaveBeenCalledWith("nginx");

    await user.click(screen.getByRole("button", { name: "Reset search" }));
    expect(onSearchChange).toHaveBeenCalledWith("");
  });
});
