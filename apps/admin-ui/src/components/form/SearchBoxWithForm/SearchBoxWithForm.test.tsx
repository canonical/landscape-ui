import { describe, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBoxWithForm from "./SearchBoxWithForm";

const onSearch = vi.fn();

describe("SearchBoxWithForm", () => {
  it("should render a SearchBoxWithForm component", async () => {
    render(<SearchBoxWithForm onSearch={onSearch} />);

    await userEvent.type(screen.getByRole("searchbox"), "search");

    expect(screen.getByRole("searchbox")).toHaveValue("search");

    await userEvent.click(screen.getByRole("button", { name: "Search" }));

    expect(onSearch).toHaveBeenCalledWith("search");

    await userEvent.click(
      screen.getByRole("button", { name: "Clear search field" }),
    );

    expect(screen.getByRole("searchbox")).toHaveValue("");

    await userEvent.type(screen.getByRole("searchbox"), "test");
    await userEvent.keyboard("{Enter}");

    expect(onSearch).toHaveBeenCalledWith("test");
  });
});
