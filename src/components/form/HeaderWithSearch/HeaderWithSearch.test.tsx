import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import HeaderWithSearch from "./HeaderWithSearch";

describe("HeaderWithSearch", () => {
  const user = userEvent.setup();

  it("renders the search box", () => {
    renderWithProviders(<HeaderWithSearch />);

    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("renders with a placeholder", () => {
    renderWithProviders(<HeaderWithSearch placeholder="Search instances..." />);

    expect(
      screen.getByPlaceholderText("Search instances..."),
    ).toBeInTheDocument();
  });

  it("calls onSearch with the typed text when submitted", async () => {
    const onSearch = vi.fn();

    renderWithProviders(<HeaderWithSearch onSearch={onSearch} searchText="" />);

    const searchBox = screen.getByRole("searchbox");
    await user.type(searchBox, "ubuntu");
    await user.keyboard("{Enter}");

    expect(onSearch).toHaveBeenCalledWith("ubuntu");
  });

  it("calls onSearch with empty string when cleared", async () => {
    const onSearch = vi.fn();

    renderWithProviders(
      <HeaderWithSearch onSearch={onSearch} searchText="ubuntu" />,
    );

    await user.click(screen.getByRole("button", { name: /clear/i }));

    expect(onSearch).toHaveBeenCalledWith("");
  });

  it("renders actions when provided", () => {
    renderWithProviders(
      <HeaderWithSearch actions={<button>Add new</button>} />,
    );

    expect(screen.getByRole("button", { name: "Add new" })).toBeInTheDocument();
  });
});
