import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import SnapsActionForm from "./SnapsActionForm";
import { installedSnaps } from "@/tests/mocks/snap";
import type { SnapAction } from "../../types";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";

const instanceId = 1;
const [firstSnap] = installedSnaps;

describe("SnapsActionForm", () => {
  const user = userEvent.setup();

  describe("Form rendering", () => {
    it("renders form with searchbox, text, and buttons", () => {
      renderWithProviders(
        <SnapsActionForm selectedInstances={[instanceId]} action="install" />,
      );

      screen.getByRole("searchbox");

      screen.getByText(/Snaps to install/i);
      screen.getByText(/No snaps have been added yet/i);

      expect(
        screen.getByRole("button", { name: "Install snaps" }),
      ).not.toHaveAttribute("aria-disabled");

      expect(
        screen.getByRole("button", { name: "Cancel" }),
      ).not.toHaveAttribute("aria-disabled");
    });

    it("includes count in submit button when snaps are selected", async () => {
      renderWithProviders(
        <SnapsActionForm selectedInstances={[instanceId]} action="install" />,
      );

      const searchBox = screen.getByRole("searchbox");
      await user.click(searchBox);
      await user.click(
        screen.getByRole("option", {
          name: `${firstSnap.snap.name} ${firstSnap.snap.publisher.username}`,
        }),
      );

      const nextButton = screen.getByRole("button", { name: "Install 1 snap" });
      expect(nextButton).not.toHaveAttribute("aria-disabled");
    });
  });

  it("removes package when delete button is clicked", async () => {
    renderWithProviders(
      <SnapsActionForm selectedInstances={[instanceId]} action="unhold" />,
    );

    const searchBox = screen.getByRole("searchbox");
    await user.click(searchBox);

    await user.click(
      screen.getByRole("option", {
        name: `${firstSnap.snap.name} ${firstSnap.snap.publisher.username}`,
      }),
    );

    const deleteButton = await screen.findByRole("button", {
      name: `Delete ${firstSnap.snap.name}`,
    });
    await user.click(deleteButton);

    expect(
      screen.queryByRole("button", {
        name: `Delete ${firstSnap.snap.name}`,
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/No snaps have been added yet/i),
    ).toBeInTheDocument();
  });

  it("shows error notification", async () => {
    setEndpointStatus({ path: "snaps/action", status: "error" });
    renderWithProviders(
      <SnapsActionForm selectedInstances={[instanceId]} action="install" />,
    );

    const searchBox = screen.getByRole("searchbox");
    await user.click(searchBox);
    await user.click(
      await screen.findByRole("option", {
        name: `${firstSnap.snap.name} ${firstSnap.snap.publisher.username}`,
      }),
    );

    await user.click(screen.getByRole("button", { name: "Install 1 snap" }));

    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
  });

  it("shows success notification", async () => {
    renderWithProviders(
      <SnapsActionForm selectedInstances={[instanceId]} action="install" />,
    );

    const searchBox = screen.getByRole("searchbox");
    await user.click(searchBox);
    await user.click(
      await screen.findByRole("option", {
        name: `${firstSnap.snap.name} ${firstSnap.snap.publisher.username}`,
      }),
    );

    await user.click(screen.getByRole("button", { name: "Install 1 snap" }));

    expect(
      await screen.findByText("Snaps successfully set to install"),
    ).toBeInTheDocument();
  });

  it.each([
    { action: "install", header: "Snaps to install" },
    { action: "remove", header: "Snaps to uninstall" },
    { action: "hold", header: "Snaps to hold" },
    { action: "unhold", header: "Snaps to unhold" },
    { action: "refresh", header: "Snaps to refresh" },
    { action: "changeChannel", header: "Snaps to change channel" },
  ])("shows the right header for $action", ({ action, header }) => {
    renderWithProviders(
      <SnapsActionForm
        selectedInstances={[instanceId]}
        action={action as SnapAction}
      />,
    );

    screen.getByText(new RegExp(header, "i"));
  });
});
