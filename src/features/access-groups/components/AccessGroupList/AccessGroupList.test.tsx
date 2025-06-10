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
      const [, groupToDelete] = accessGroups; // Developers

      await userEvent.click(
        screen.getByLabelText(`${groupToDelete.title} access group actions`),
      );

      await userEvent.click(
        screen.getByLabelText(`Delete "${groupToDelete.title}" access group`),
      );

      const confirmationTitle = await screen.findByText(
        `Deleting ${groupToDelete.title} access group`,
      );
      expect(confirmationTitle).toBeInTheDocument();

      const confirmationMessage = screen.getByText(/irreversible/i);
      expect(confirmationMessage).toBeInTheDocument();

      const confirmButton = screen.getByRole("button", { name: /delete/i });
      expect(confirmButton).toBeInTheDocument();
    });
  });
});
