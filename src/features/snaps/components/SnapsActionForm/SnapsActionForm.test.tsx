import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import SnapsActionForm from "./SnapsActionForm";
import {
  installedSnaps,
  successfulSnapInstallResponse,
} from "@/tests/mocks/snap";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import server from "@/tests/server";
import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";
import type { SnapActionParams } from "../../types";

const instanceId = 1;
const [{ snap }] = installedSnaps;
const snapTitle = `${snap.name} ${snap.publisher.username}`;

describe("SnapsActionForm", () => {
  const user = userEvent.setup();

  describe("Form rendering", () => {
    it("renders form with searchbox, text, and buttons", async () => {
      renderWithProviders(
        <SnapsActionForm selectedInstances={[instanceId]} action="unhold" />,
      );

      expect(screen.getByRole("searchbox")).toBeInTheDocument();

      expect(screen.getByText(/Snaps to unhold/i)).toBeInTheDocument();
      expect(
        screen.getByText(/No snaps have been added yet/i),
      ).toBeInTheDocument();

      expect(
        screen.getByRole("button", { name: "Unhold snaps" }),
      ).not.toHaveAttribute("aria-disabled");

      expect(
        screen.getByRole("button", { name: "Cancel" }),
      ).not.toHaveAttribute("aria-disabled");
    });

    it("includes count in submit button when snaps are selected", async () => {
      renderWithProviders(
        <SnapsActionForm selectedInstances={[instanceId]} action="install" />,
      );

      await user.click(screen.getByRole("searchbox"));
      await user.click(screen.getByRole("option", { name: snapTitle }));

      const submitButton = screen.getByRole("button", {
        name: "Install 1 snap",
      });
      expect(submitButton).toHaveClass("p-button--negative");
    });
  });

  it("removes package when delete button is clicked", async () => {
    renderWithProviders(
      <SnapsActionForm selectedInstances={[instanceId]} action="refresh" />,
    );

    await user.click(screen.getByRole("searchbox"));
    await user.click(screen.getByRole("option", { name: snapTitle }));

    const deleteButton = await screen.findByRole("button", {
      name: `Delete ${snap.name}`,
    });
    await user.click(deleteButton);

    expect(
      screen.queryByRole("button", { name: `Delete ${snap.name}` }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/No snaps have been added yet/i),
    ).toBeInTheDocument();
  });

  it("shows error notification", async () => {
    renderWithProviders(
      <SnapsActionForm selectedInstances={[instanceId]} action="hold" />,
    );

    await user.click(screen.getByRole("searchbox"));
    await user.click(screen.getByRole("option", { name: snapTitle }));

    setEndpointStatus({ path: "snaps", status: "error" });

    await user.click(screen.getByRole("button", { name: "Hold 1 snap" }));

    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
  });

  it("shows success notification", async () => {
    renderWithProviders(
      <SnapsActionForm
        selectedInstances={[instanceId]}
        action="change channel"
      />,
    );

    await user.click(screen.getByRole("searchbox"));
    await user.click(screen.getByRole("option", { name: snapTitle }));

    await user.click(screen.getByRole("button", { name: "Change channel" }));

    expect(
      await screen.findByText("Snaps successfully set to change channel"),
    ).toBeInTheDocument();
  });

  it("maps the 'uninstall' action to a 'remove' request", async () => {
    let requestBody: SnapActionParams | null = null;
    server.use(
      http.post(`${API_URL}snaps`, async ({ request }) => {
        requestBody = (await request.json()) as SnapActionParams;
        return HttpResponse.json(successfulSnapInstallResponse);
      }),
    );

    renderWithProviders(
      <SnapsActionForm selectedInstances={[instanceId]} action="uninstall" />,
    );

    await user.click(screen.getByRole("searchbox"));
    await user.click(screen.getByRole("option", { name: snapTitle }));

    await user.click(screen.getByRole("button", { name: "Uninstall 1 snap" }));

    const modal = await screen.findByRole("dialog");
    await user.click(
      within(modal).getByRole("button", { name: "Uninstall 1 snap" }),
    );

    expect(
      await screen.findByText("Snaps successfully set to uninstall"),
    ).toBeInTheDocument();
    expect(requestBody).toMatchObject({
      action: "remove",
      computer_ids: [instanceId],
      snaps: [{ name: snap.name }],
    });
  });
});
