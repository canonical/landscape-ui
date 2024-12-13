import { accessGroups } from "@/tests/mocks/accessGroup";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import AccessGroupList from "./AccessGroupList";

describe("AccessGroupList", () => {
  beforeEach(() => {
    renderWithProviders(<AccessGroupList accessGroups={accessGroups} />);
  });

  it("renders a list of access groups", async () => {
    for (const accessGroup of accessGroups) {
      screen.getByRole("rowheader", {
        name: accessGroup.title,
      });
    }
  });

  describe("Remove Access Group", () => {
    it("opens confirmation modal when delete button is clicked", async () => {
      const groupToDelete = accessGroups[1]; // Developers
      const deleteButton = screen.getByLabelText(
        `Remove ${groupToDelete.name} access group`,
      );
      expect(deleteButton).toBeInTheDocument();

      await userEvent.click(deleteButton);

      const confirmationTitle = await screen.findByText(
        `Deleting ${groupToDelete.name} access group`,
      );
      expect(confirmationTitle).toBeInTheDocument();

      const confirmationMessage = screen.getByText(/are you sure\?/i);
      expect(confirmationMessage).toBeInTheDocument();

      const confirmButton = screen.getByRole("button", { name: /delete/i });
      expect(confirmButton).toBeInTheDocument();
    });
  });
});
