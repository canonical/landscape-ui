import { renderWithProviders } from "@/tests/render";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import SnapsActionForm from "./SnapsActionForm";
import { SNAP_ACTION_ACTIVITY } from "@/tests/mocks/activity";
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
const [firstSnap, secondSnap, , , , classicSnap] = installedSnaps;
const firstSnapOptionTitle = `${firstSnap.snap.name} ${firstSnap.snap.publisher.username}`;
const secondSnapOptionTitle = `${secondSnap.snap.name} ${secondSnap.snap.publisher.username}`;
const classicSnapOptionTitle = `${classicSnap.snap.name} ${classicSnap.snap.publisher.username}`;

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
        <SnapsActionForm selectedInstances={[instanceId]} action="uninstall" />,
      );

      await user.click(screen.getByRole("searchbox"));
      await user.click(
        screen.getByRole("option", { name: firstSnapOptionTitle }),
      );

      const submitButton = screen.getByRole("button", {
        name: "Uninstall 1 snap",
      });
      expect(submitButton).toHaveClass("p-button--negative");
    });
  });

  it("shows a form error when submitting without selecting a snap", async () => {
    renderWithProviders(
      <SnapsActionForm selectedInstances={[instanceId]} action="install" />,
    );

    await user.click(
      await screen.findByRole("button", { name: "Install snaps" }),
    );

    expect(
      await screen.findByText("You must add at least one snap to continue"),
    ).toBeInTheDocument();
  });

  it("removes package when delete button is clicked", async () => {
    renderWithProviders(
      <SnapsActionForm selectedInstances={[instanceId]} action="refresh" />,
    );

    await user.click(screen.getByRole("searchbox"));
    await user.click(
      screen.getByRole("option", { name: firstSnapOptionTitle }),
    );

    const deleteButton = await screen.findByRole("button", {
      name: `Delete ${firstSnap.snap.name}`,
    });
    await user.click(deleteButton);

    expect(
      screen.queryByRole("button", { name: `Delete ${firstSnap.snap.name}` }),
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
    await user.click(
      screen.getByRole("option", { name: firstSnapOptionTitle }),
    );

    setEndpointStatus({ path: "snaps", status: "error" });

    await user.click(screen.getByRole("button", { name: "Hold 1 snap" }));

    const modal = await screen.findByRole("dialog");
    await user.click(
      within(modal).getByRole("button", { name: "Hold 1 snap" }),
    );

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

    await user.click(await screen.findByRole("searchbox"));
    await user.click(
      await screen.findByRole("option", {
        name: secondSnapOptionTitle,
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("combobox", {
          name: `Channel for ${secondSnap.snap.name}`,
        }),
      ).not.toBeDisabled();
    });

    await user.click(screen.getByRole("button", { name: "Change channel" }));

    const modal = await screen.findByRole("dialog");
    await user.click(
      within(modal).getByRole("button", { name: "Change channel" }),
    );

    expect(
      await screen.findByText("Snaps successfully queued to change channel"),
    ).toBeInTheDocument();
  });

  it("shows a View details action that opens the activity details side panel", async () => {
    renderWithProviders(
      <SnapsActionForm
        selectedInstances={[instanceId]}
        action="change channel"
      />,
    );

    await user.click(await screen.findByRole("searchbox"));
    await user.click(
      await screen.findByRole("option", {
        name: secondSnapOptionTitle,
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("combobox", {
          name: `Channel for ${secondSnap.snap.name}`,
        }),
      ).not.toBeDisabled();
    });

    await user.click(screen.getByRole("button", { name: "Change channel" }));

    const modal = await screen.findByRole("dialog");
    await user.click(
      within(modal).getByRole("button", { name: "Change channel" }),
    );

    const viewDetailsButton = await screen.findByRole("button", {
      name: /view details/i,
    });
    await user.click(viewDetailsButton);

    expect(
      await screen.findByText(SNAP_ACTION_ACTIVITY.summary),
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
    await user.click(
      screen.getByRole("option", { name: firstSnapOptionTitle }),
    );

    await user.click(screen.getByRole("button", { name: "Uninstall 1 snap" }));

    const modal = await screen.findByRole("dialog");
    await user.click(
      within(modal).getByRole("button", { name: "Uninstall 1 snap" }),
    );

    expect(
      await screen.findByText("Snaps successfully queued to uninstall"),
    ).toBeInTheDocument();
    expect(requestBody).toMatchObject({
      action: "remove",
      computer_ids: [instanceId],
      snaps: [{ name: firstSnap.snap.name }],
    });
  });

  it("shows validation error when a change-channel snap has no revision", async () => {
    renderWithProviders(
      <SnapsActionForm
        selectedInstances={[instanceId]}
        action="change channel"
      />,
    );

    await user.click(await screen.findByRole("searchbox"));
    await user.click(
      await screen.findByRole("option", {
        name: secondSnapOptionTitle,
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("combobox", {
          name: `Channel for ${secondSnap.snap.name}`,
        }),
      ).not.toBeDisabled();
    });

    const modeSelect = screen.getByLabelText(
      `Snap channel or revision for ${secondSnap.snap.name}`,
    );
    await user.selectOptions(modeSelect, "revision");

    await user.click(screen.getByRole("button", { name: "Change channel" }));

    expect(
      await screen.findByText("Select a revision for this snap to continue"),
    ).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not open confirmation modal when channel info is still loading", async () => {
    let releaseInfoRequest: (() => void) | undefined;
    const requestStarted = new Promise<void>((resolveStarted) => {
      server.use(
        http.get(
          `${API_URL}computers/:computerId/snaps/:name/info`,
          async () => {
            resolveStarted();
            await new Promise<void>((resolveRequest) => {
              releaseInfoRequest = resolveRequest;
            });
            return HttpResponse.json(null);
          },
        ),
      );
    });

    renderWithProviders(
      <SnapsActionForm
        selectedInstances={[instanceId]}
        action="change channel"
      />,
    );

    await user.click(await screen.findByRole("searchbox"));
    await user.click(
      await screen.findByRole("option", {
        name: secondSnapOptionTitle,
      }),
    );

    await requestStarted;

    await user.click(screen.getByRole("button", { name: "Change channel" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    releaseInfoRequest?.();
  });

  it("shows an error and blocks confirmation modal when channel info fails to load in channel mode", async () => {
    server.use(
      http.get(`${API_URL}computers/:computerId/snaps/:name/info`, () =>
        HttpResponse.json(
          {
            error: "InternalServerError",
            message: "Failed to fetch snap info",
          },
          { status: 500 },
        ),
      ),
    );

    renderWithProviders(
      <SnapsActionForm
        selectedInstances={[instanceId]}
        action="change channel"
      />,
    );

    await user.click(await screen.findByRole("searchbox"));
    await user.click(
      await screen.findByRole("option", {
        name: secondSnapOptionTitle,
      }),
    );

    expect(
      await screen.findByText("Failed to load channels for this snap"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Change channel" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("submits when a change-channel snap has no channel selected", async () => {
    let requestBody: SnapActionParams | null = null;
    server.use(
      http.post(`${API_URL}snaps`, async ({ request }) => {
        requestBody = (await request.json()) as SnapActionParams;
        return HttpResponse.json(successfulSnapInstallResponse);
      }),
    );

    renderWithProviders(
      <SnapsActionForm
        selectedInstances={[instanceId]}
        action="change channel"
      />,
    );

    await user.click(await screen.findByRole("searchbox"));
    await user.click(
      await screen.findByRole("option", {
        name: secondSnapOptionTitle,
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("combobox", {
          name: `Channel for ${secondSnap.snap.name}`,
        }),
      ).not.toBeDisabled();
    });

    await user.click(screen.getByRole("button", { name: "Change channel" }));
    const modal = await screen.findByRole("dialog");
    await user.click(
      within(modal).getByRole("button", { name: "Change channel" }),
    );

    expect(
      await screen.findByText("Snaps successfully queued to change channel"),
    ).toBeInTheDocument();
    expect(requestBody).toMatchObject({
      action: "refresh",
      computer_ids: [instanceId],
      snaps: [
        { name: secondSnap.snap.name, args: { channel: "latest/stable" } },
      ],
    });
  });

  it("omits channel from the payload when a snap has no channel options", async () => {
    let requestBody: SnapActionParams | null = null;
    server.use(
      http.post(`${API_URL}snaps`, async ({ request }) => {
        requestBody = (await request.json()) as SnapActionParams;
        return HttpResponse.json(successfulSnapInstallResponse);
      }),
    );

    renderWithProviders(
      <SnapsActionForm
        selectedInstances={[instanceId]}
        action="change channel"
      />,
    );

    await user.click(await screen.findByRole("searchbox"));
    await user.click(
      await screen.findByRole("option", {
        name: firstSnapOptionTitle,
      }),
    );

    const channelSelect = await screen.findByRole("combobox", {
      name: `Channel for ${firstSnap.snap.name}`,
    });
    expect(channelSelect).toBeDisabled();
    expect(
      within(channelSelect).getByText("Default channel"),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Change channel" }));
    const modal = await screen.findByRole("dialog");
    await user.click(
      within(modal).getByRole("button", { name: "Change channel" }),
    );

    expect(
      await screen.findByText("Snaps successfully queued to change channel"),
    ).toBeInTheDocument();
    expect(
      (requestBody as unknown as SnapActionParams).snaps[0]?.args?.channel,
    ).toBeUndefined();
  });

  it("sends the 'refresh' action with the selected channel for 'change channel'", async () => {
    let requestBody: SnapActionParams | null = null;
    server.use(
      http.post(`${API_URL}snaps`, async ({ request }) => {
        requestBody = (await request.json()) as SnapActionParams;
        return HttpResponse.json(successfulSnapInstallResponse);
      }),
    );

    renderWithProviders(
      <SnapsActionForm
        selectedInstances={[instanceId]}
        action="change channel"
      />,
    );

    await user.click(await screen.findByRole("searchbox"));
    await user.click(
      await screen.findByRole("option", {
        name: secondSnapOptionTitle,
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("combobox", {
          name: `Channel for ${secondSnap.snap.name}`,
        }),
      ).not.toBeDisabled();
    });

    await user.click(screen.getByRole("button", { name: "Change channel" }));
    const modal = await screen.findByRole("dialog");
    await user.click(
      within(modal).getByRole("button", { name: "Change channel" }),
    );

    expect(
      await screen.findByText("Snaps successfully queued to change channel"),
    ).toBeInTheDocument();
    expect(requestBody).toMatchObject({
      action: "refresh",
      computer_ids: [instanceId],
      snaps: [
        { name: secondSnap.snap.name, args: { channel: "latest/stable" } },
      ],
    });
  });

  it("sends classic: true when a classic channel is selected for 'change channel'", async () => {
    let requestBody: SnapActionParams | null = null;
    server.use(
      http.post(`${API_URL}snaps`, async ({ request }) => {
        requestBody = (await request.json()) as SnapActionParams;
        return HttpResponse.json(successfulSnapInstallResponse);
      }),
    );

    renderWithProviders(
      <SnapsActionForm
        selectedInstances={[instanceId]}
        action="change channel"
      />,
    );

    await user.click(await screen.findByRole("searchbox"));
    await user.click(
      await screen.findByRole("option", {
        name: secondSnapOptionTitle,
      }),
    );

    const channelSelect = await screen.findByRole("combobox", {
      name: `Channel for ${secondSnap.snap.name}`,
    });
    await waitFor(() => {
      expect(channelSelect).not.toBeDisabled();
    });

    await user.selectOptions(channelSelect, "latest/edge");

    await user.click(screen.getByRole("button", { name: "Change channel" }));
    const modal = await screen.findByRole("dialog");
    await user.click(
      within(modal).getByRole("button", { name: "Change channel" }),
    );

    expect(
      await screen.findByText("Snaps successfully queued to change channel"),
    ).toBeInTheDocument();
    expect(requestBody).toMatchObject({
      action: "refresh",
      computer_ids: [instanceId],
      snaps: [
        {
          name: secondSnap.snap.name,
          args: { channel: "latest/edge", classic: true },
        },
      ],
    });
  });

  it("blocks submit and shows an error when the revision is not a positive integer", async () => {
    renderWithProviders(
      <SnapsActionForm
        selectedInstances={[instanceId]}
        action="change channel"
      />,
    );

    await user.click(await screen.findByRole("searchbox"));
    await user.click(
      await screen.findByRole("option", {
        name: secondSnapOptionTitle,
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("combobox", {
          name: `Channel for ${secondSnap.snap.name}`,
        }),
      ).not.toBeDisabled();
    });

    const modeSelect = screen.getByLabelText(
      `Snap channel or revision for ${secondSnap.snap.name}`,
    );
    await user.selectOptions(modeSelect, "revision");

    const revisionInput = screen.getByRole("spinbutton", {
      name: `Revision for ${secondSnap.snap.name}`,
    });
    await user.type(revisionInput, "0");
    await user.tab();

    await user.click(screen.getByRole("button", { name: "Change channel" }));

    expect(
      await screen.findByText("Revision must be a positive whole number"),
    ).toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("sends the 'refresh' action with the selected revision when mode is revision", async () => {
    let requestBody: SnapActionParams | null = null;
    server.use(
      http.post(`${API_URL}snaps`, async ({ request }) => {
        requestBody = (await request.json()) as SnapActionParams;
        return HttpResponse.json(successfulSnapInstallResponse);
      }),
    );

    renderWithProviders(
      <SnapsActionForm
        selectedInstances={[instanceId]}
        action="change channel"
      />,
    );

    await user.click(await screen.findByRole("searchbox"));
    await user.click(
      await screen.findByRole("option", {
        name: secondSnapOptionTitle,
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("combobox", {
          name: `Channel for ${secondSnap.snap.name}`,
        }),
      ).not.toBeDisabled();
    });

    const modeSelect = screen.getByLabelText(
      `Snap channel or revision for ${secondSnap.snap.name}`,
    );
    await user.selectOptions(modeSelect, "revision");

    const revisionInput = screen.getByRole("spinbutton", {
      name: `Revision for ${secondSnap.snap.name}`,
    });
    await user.type(revisionInput, "123");

    await user.click(screen.getByRole("button", { name: "Change channel" }));
    const modal = await screen.findByRole("dialog");
    await user.click(
      within(modal).getByRole("button", { name: "Change channel" }),
    );

    expect(
      await screen.findByText("Snaps successfully queued to change channel"),
    ).toBeInTheDocument();
    expect(requestBody).toMatchObject({
      action: "refresh",
      computer_ids: [instanceId],
      snaps: [{ name: secondSnap.snap.name, args: { revision: "123" } }],
    });
  });

  it("sends classic: true for a classic snap when mode is revision", async () => {
    let requestBody: SnapActionParams | null = null;
    server.use(
      http.post(`${API_URL}snaps`, async ({ request }) => {
        requestBody = (await request.json()) as SnapActionParams;
        return HttpResponse.json(successfulSnapInstallResponse);
      }),
    );

    renderWithProviders(
      <SnapsActionForm
        selectedInstances={[instanceId]}
        action="change channel"
      />,
    );

    await user.type(
      await screen.findByRole("searchbox"),
      classicSnap.snap.name,
    );
    await user.click(
      await screen.findByRole("option", { name: classicSnapOptionTitle }),
    );

    await user.selectOptions(
      screen.getByLabelText(
        `Snap channel or revision for ${classicSnap.snap.name}`,
      ),
      "revision",
    );
    await user.type(
      screen.getByRole("spinbutton", {
        name: `Revision for ${classicSnap.snap.name}`,
      }),
      "123",
    );

    await user.click(screen.getByRole("button", { name: "Change channel" }));
    const modal = await screen.findByRole("dialog");
    await user.click(
      within(modal).getByRole("button", { name: "Change channel" }),
    );

    expect(
      await screen.findByText("Snaps successfully queued to change channel"),
    ).toBeInTheDocument();
    expect(requestBody).toMatchObject({
      snaps: [
        {
          name: classicSnap.snap.name,
          args: { revision: "123", classic: true },
        },
      ],
    });
  });

  it("shows revision-specific copy in the confirmation modal when mode is revision", async () => {
    renderWithProviders(
      <SnapsActionForm
        selectedInstances={[instanceId]}
        action="change channel"
      />,
    );

    await user.click(await screen.findByRole("searchbox"));
    await user.click(
      await screen.findByRole("option", {
        name: secondSnapOptionTitle,
      }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("combobox", {
          name: `Channel for ${secondSnap.snap.name}`,
        }),
      ).not.toBeDisabled();
    });

    const modeSelect = screen.getByLabelText(
      `Snap channel or revision for ${secondSnap.snap.name}`,
    );
    await user.selectOptions(modeSelect, "revision");

    const revisionInput = screen.getByRole("spinbutton", {
      name: `Revision for ${secondSnap.snap.name}`,
    });
    await user.type(revisionInput, "123");

    await user.click(screen.getByRole("button", { name: "Change channel" }));
    const modal = await screen.findByRole("dialog");

    expect(
      within(modal).getByRole("heading", {
        name: "Change revision of 1 snap on 1 instance",
      }),
    ).toBeInTheDocument();
    expect(
      within(modal).getByText(
        "The following snaps have been selected to change revision:",
      ),
    ).toBeInTheDocument();
    expect(
      within(modal).getByText(/will not change the snap's tracked channel/i),
    ).toBeInTheDocument();
    expect(
      within(modal).queryByText(/latest revision on the new channel/i),
    ).not.toBeInTheDocument();
  });

  it("renders a notification when installing classic snaps", async () => {
    renderWithProviders(
      <SnapsActionForm selectedInstances={[instanceId]} action="install" />,
    );

    await user.click(await screen.findByRole("searchbox"));
    await user.click(
      await screen.findByRole("option", {
        name: classicSnapOptionTitle,
      }),
    );

    expect(
      await screen.findByText("This snap requires classic confinement"),
    ).toBeInTheDocument();
  });

  it("doesn't render a notification when installing strict snaps", async () => {
    renderWithProviders(
      <SnapsActionForm selectedInstances={[instanceId]} action="install" />,
    );

    await user.click(await screen.findByRole("searchbox"));
    await user.click(
      await screen.findByRole("option", {
        name: firstSnapOptionTitle,
      }),
    );

    expect(
      screen.queryByText("This snap requires classic confinement"),
    ).not.toBeInTheDocument();
  });
});
