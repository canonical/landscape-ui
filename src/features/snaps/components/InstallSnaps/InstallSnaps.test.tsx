import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect } from "vitest";
import InstallSnaps from "./InstallSnaps";

describe("InstallSnaps", () => {
  beforeEach(async () => {
    renderWithProviders(
      <InstallSnaps />,
      {},
      `/instances/1`,
      "/instances/:instanceId",
    );
  });

  it("renders form correctly", () => {
    const searchBox = screen.getByRole("searchbox");
    const installButton = screen.getByRole("button", {
      name: /install/i,
    });
    const cancelButton = screen.getByRole("button", {
      name: /cancel/i,
    });

    expect(searchBox).toBeInTheDocument();
    expect(installButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  describe("Snap selection form flow", () => {
    it("select snap after searching", async () => {
      const searchBox = screen.getByRole("searchbox");
      await userEvent.type(searchBox, "Snap 2");
      expect(searchBox).toHaveValue("Snap 2");

      const snap = await screen.findByText("Snap 2");
      expect(snap).toBeInTheDocument();
      await userEvent.click(snap);
      const addButton = await screen.findByRole("button", {
        name: /add/i,
      });
      expect(addButton).toBeInTheDocument();

      await userEvent.click(addButton);
      expect(screen.getByText(/min 3. characters/i)).toBeInTheDocument();
      expect(screen.getByText("Snap 2")).toBeInTheDocument();
    });
  });

  describe("Selected snaps list actions", () => {
    it("removes snaps from list after installing", async () => {
      const searchBox = screen.getByRole("searchbox");
      const installButton = screen.getByRole("button", {
        name: /install/i,
      });
      expect(installButton).toBeDisabled();

      await userEvent.type(searchBox, "Snap 2");
      const matchingSnap = await screen.findByText("Snap 2");
      await userEvent.click(matchingSnap);
      await userEvent.click(screen.getByRole("button", { name: /add/i }));

      expect(installButton).toBeEnabled();

      await userEvent.click(installButton);

      expect(screen.queryByText("Snap 2")).not.toBeInTheDocument();
    });

    it("delete a snap from list after adding it", async () => {
      const searchBox = screen.getByRole("searchbox");
      const installButton = screen.getByRole("button", {
        name: /install/i,
      });

      expect(installButton).toBeDisabled();

      await userEvent.type(searchBox, "Snap 2");
      const firstMatchingSnap = await screen.findByText("Snap 2");
      await userEvent.click(firstMatchingSnap);
      const firstButton = await screen.findByRole("button", { name: /add/i });
      await userEvent.click(firstButton);

      await userEvent.type(searchBox, "Snap 3");
      const secondMatchingSnap = await screen.findByText("Snap 3");
      await userEvent.click(secondMatchingSnap);
      const secondButton = await screen.findByRole("button", { name: /add/i });
      await userEvent.click(secondButton);

      const listItems = screen.getAllByRole("listitem");
      const deleteButton = within(listItems[0]).getByRole("button");
      expect(deleteButton).toBeInTheDocument();

      await userEvent.click(deleteButton);
      expect(screen.queryByText("Snap 2")).not.toBeInTheDocument();
      expect(screen.getByText("Snap 3")).toBeInTheDocument();
    });
  });
});
