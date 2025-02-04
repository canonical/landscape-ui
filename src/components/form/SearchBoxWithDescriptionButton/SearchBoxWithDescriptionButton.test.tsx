import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { vi } from "vitest";
import SearchBoxWithDescriptionButton from "./SearchBoxWithDescriptionButton";

const props: ComponentProps<typeof SearchBoxWithDescriptionButton> = {
  inputValue: "",
  onInputChange: vi.fn(),
  onSearchClick: vi.fn(),
  onDescriptionClick: vi.fn(),
  onClear: vi.fn(),
};

describe("SearchBoxWithDescriptionButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the search box with the provided input value", () => {
    render(
      <SearchBoxWithDescriptionButton {...props} inputValue="initial value" />,
    );

    const searchInput = screen.getByRole("searchbox") as HTMLInputElement;

    expect(searchInput.value).toBe("initial value");
  });

  it("calls onInputChange when the input value changes", async () => {
    const onInputChange = vi.fn();
    render(
      <SearchBoxWithDescriptionButton
        {...props}
        onInputChange={onInputChange}
      />,
    );

    const searchInput = screen.getByRole("searchbox");
    await userEvent.type(searchInput, "abc");

    expect(onInputChange).toHaveBeenCalledTimes(3);
  });

  it("calls onSearchClick when the form is submitted", async () => {
    const onSearchClick = vi.fn();
    render(
      <SearchBoxWithDescriptionButton
        {...props}
        onSearchClick={onSearchClick}
      />,
    );

    const searchInput = screen.getByRole("searchbox");
    await userEvent.type(searchInput, "{enter}");

    expect(onSearchClick).toHaveBeenCalled();
  });

  it("calls onClear when clear is triggered", async () => {
    const onClear = vi.fn();
    render(
      <SearchBoxWithDescriptionButton
        {...props}
        inputValue="something"
        onClear={onClear}
      />,
    );

    const clearButton = screen.getByRole("button", { name: /clear/i });
    await userEvent.click(clearButton);

    expect(onClear).toHaveBeenCalled();
  });

  it("calls onDescriptionClick when the help button is clicked", async () => {
    const onDescriptionClick = vi.fn();
    render(
      <SearchBoxWithDescriptionButton
        {...props}
        onDescriptionClick={onDescriptionClick}
      />,
    );

    const helpButton = screen.getByRole("button", { name: /help/i });
    await userEvent.click(helpButton);

    expect(onDescriptionClick).toHaveBeenCalled();
  });
});
