import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ScriptsEmptyState from "./ScriptsEmptyState";
import { REMOTE_SCRIPT_EXECUTION_DOCUMENTATION_URL } from "./constants";

describe("Scripts Empty State", () => {
  const user = userEvent.setup();

  it("should show correct information for empty state", async () => {
    renderWithProviders(<ScriptsEmptyState />);

    const emptyStateTitle = screen.getByText(/No scripts found/i);
    const emptyStateBody = screen.getByText(
      /You haven’t added any scripts yet/i,
    );
    const emptyStateLink = screen.getByRole("link", {
      name: /How to use remote script execution in Landscape/i,
    });
    const emptyStateButton = screen.getByRole("button", {
      name: /Add script/i,
    });

    expect(emptyStateTitle).toBeInTheDocument();
    expect(emptyStateBody).toBeInTheDocument();
    expect(emptyStateLink).toBeInTheDocument();
    expect(emptyStateButton).toBeInTheDocument();
    expect(emptyStateLink).toHaveAttribute(
      "href",
      REMOTE_SCRIPT_EXECUTION_DOCUMENTATION_URL,
    );
  });

  it("should open side panel when button is clicked", async () => {
    renderWithProviders(<ScriptsEmptyState />);

    const emptyStateButton = screen.getByRole("button", {
      name: /Add script/i,
    });

    await user.click(emptyStateButton);

    const sidePanelTitle = screen.getByRole("heading", {
      name: /Add script/i,
    });
    expect(sidePanelTitle).toBeInTheDocument();
  });
});
