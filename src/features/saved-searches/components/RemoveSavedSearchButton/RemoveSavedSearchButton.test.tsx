import { savedSearch } from "@/tests/mocks/savedSearches";
import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import RemoveSavedSearchButton from "./RemoveSavedSearchButton";

describe("RemoveSavedSearchButton", () => {
  const user = userEvent.setup();

  const defaultProps: ComponentProps<typeof RemoveSavedSearchButton> = {
    savedSearch,
  };

  it("should render remove button", () => {
    renderWithProviders(<RemoveSavedSearchButton {...defaultProps} />);

    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  it("should show confirmation modal when clicked", async () => {
    renderWithProviders(<RemoveSavedSearchButton {...defaultProps} />);

    const button = screen.getByRole("button");
    await user.click(button);

    const modal = screen.getByRole("dialog");
    expect(within(modal).getByText("Remove saved search")).toBeInTheDocument();
    expect(
      within(modal).getByText(
        `This will remove the saved search "${savedSearch.title}".`,
      ),
    ).toBeInTheDocument();
  });

  it("should call onSavedSearchRemove callback after successful deletion", async () => {
    const onSavedSearchRemove = vi.fn();

    renderWithProviders(
      <RemoveSavedSearchButton
        {...defaultProps}
        onSavedSearchRemove={onSavedSearchRemove}
      />,
    );

    const button = screen.getByRole("button");
    await user.click(button);

    const modal = screen.getByRole("dialog");
    const removeButton = within(modal).getByRole("button", { name: "Remove" });

    await user.click(removeButton);

    expect(
      await screen.findByText(
        `Saved search ${savedSearch.name} successfully removed`,
      ),
    ).toBeInTheDocument();

    expect(onSavedSearchRemove).toHaveBeenCalled();
  });
});
