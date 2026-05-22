import { savedSearch } from "@/tests/mocks/savedSearches";
import { renderWithProviders } from "@/tests/render";
import LocationDisplay from "@/tests/LocationDisplay";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import EditSavedSearchButton from "./EditSavedSearchButton";

describe("EditSavedSearchButton", () => {
  const user = userEvent.setup();

  const defaultProps: ComponentProps<typeof EditSavedSearchButton> = {
    savedSearch,
  };

  it("should render edit button with tooltip", async () => {
    renderWithProviders(<EditSavedSearchButton {...defaultProps} />);

    const button = screen.getByRole("button", {
      name: /edit/i,
    });
    expect(button).toBeInTheDocument();
  });

  it("should update URL with sidePath and name when clicked", async () => {
    renderWithProviders(
      <>
        <EditSavedSearchButton {...defaultProps} />
        <LocationDisplay />
      </>
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(screen.getByTestId("location")).toHaveTextContent("sidePath=edit-saved-search");
    expect(screen.getByTestId("location")).toHaveTextContent(`name=${savedSearch.name}`);
  });
});
