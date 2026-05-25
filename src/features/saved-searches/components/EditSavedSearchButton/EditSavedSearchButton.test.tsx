import { savedSearch } from "@/tests/mocks/savedSearches";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it, vi } from "vitest";
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

  it("should open side panel with form when clicked", async () => {
    renderWithProviders(<EditSavedSearchButton {...defaultProps} />);

    const button = screen.getByRole("button");
    await user.click(button);

    expect(
      await screen.findByRole("heading", {
        name: `Edit "${savedSearch.title}" saved search`,
      }),
    ).toBeInTheDocument();
  });

  it("should open side panel with correct size when onBackButtonPress is provided", async () => {
    const onBackButtonPress = vi.fn();
    renderWithProviders(
      <EditSavedSearchButton
        {...defaultProps}
        onBackButtonPress={onBackButtonPress}
      />,
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(
      await screen.findByRole("heading", {
        name: `Edit "${savedSearch.title}" saved search`,
      }),
    ).toBeInTheDocument();
  });

  it("should successfully submit the edit form", async () => {
    renderWithProviders(<EditSavedSearchButton {...defaultProps} />);

    const button = screen.getByRole("button");
    await user.click(button);

    await screen.findByRole("heading", {
      name: `Edit "${savedSearch.title}" saved search`,
    });

    const saveButton = await screen.findByRole("button", {
      name: "Save changes",
    });
    await user.click(saveButton);

    await waitFor(() => {
      expect(
        screen.queryByRole("heading", {
          name: `Edit "${savedSearch.title}" saved search`,
        }),
      ).not.toBeInTheDocument();
    });
  });
});
