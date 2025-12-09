import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import SearchInfoBox from "./SearchInfoBox";

describe("SearchInfoBox", () => {
  const user = userEvent.setup();

  const defaultProps: ComponentProps<typeof SearchInfoBox> = {
    onHelpButtonClick: vi.fn(),
  };

  it("should render help button", () => {
    renderWithProviders(<SearchInfoBox {...defaultProps} />);

    const helpButton = screen.getByRole("button", { name: "Search help" });
    expect(helpButton).toBeInTheDocument();
  });

  it("should call onHelpButtonClick when help button is clicked", async () => {
    const onHelpButtonClick = vi.fn();

    renderWithProviders(
      <SearchInfoBox {...defaultProps} onHelpButtonClick={onHelpButtonClick} />,
    );

    const helpButton = screen.getByRole("button", { name: "Search help" });
    await user.click(helpButton);

    expect(onHelpButtonClick).toHaveBeenCalled();
  });

  it("should render with base appearance", () => {
    renderWithProviders(<SearchInfoBox {...defaultProps} />);

    const helpButton = screen.getByRole("button", { name: "Search help" });
    expect(helpButton).toBeInTheDocument();
  });
});
