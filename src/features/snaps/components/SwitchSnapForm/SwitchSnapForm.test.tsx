import { API_URL } from "@/constants";
import { PATHS } from "@/libs/routes";
import { SNAP_ACTION_ACTIVITY } from "@/tests/mocks/activity";
import {
  availableSnapInfo,
  installedSnaps,
  successfulSnapInstallResponse,
} from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { assert, describe, expect, it, beforeEach } from "vitest";
import type {
  AvailableSnapInfo,
  InstalledSnap,
  SnapActionParams,
} from "../../types";
import SwitchSnapForm from "./SwitchSnapForm";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";

const snapWithChannels = installedSnaps.find((snap) => {
  const snapInfo = availableSnapInfo.find(
    (info) => info.name === snap.snap.name,
  );
  return snapInfo && snapInfo["channel-map"].length > 0;
});

const snapWithNoChannels = installedSnaps.find((snap) => {
  const snapInfo = availableSnapInfo.find(
    (info) => info.name === snap.snap.name,
  );
  return snapInfo && snapInfo["channel-map"].length === 0;
});

assert(
  snapWithChannels,
  "No installed snap has available channels to switch to.",
);
assert(snapWithNoChannels, "No installed snap has zero available channels.");

const snapInfoWithChannels =
  availableSnapInfo.find((info) => info.name === snapWithChannels.snap.name) ??
  null;

const snapInfoWithNoChannels =
  availableSnapInfo.find(
    (info) => info.name === snapWithNoChannels.snap.name,
  ) ?? null;

const renderSwitchSnapForm = (
  snap: InstalledSnap = snapWithChannels,
  snapInfo = snapInfoWithChannels,
) =>
  renderWithProviders(
    <SwitchSnapForm snap={snap} snapInfo={snapInfo} />,
    {},
    "/instances/1",
    `/${PATHS.instances.root}/${PATHS.instances.single}`,
  );

const captureRequest = () => {
  const captured: { body: SnapActionParams | null } = { body: null };
  server.use(
    http.post(`${API_URL}snaps`, async ({ request }) => {
      captured.body = (await request.json()) as SnapActionParams;
      return HttpResponse.json(successfulSnapInstallResponse);
    }),
  );
  return captured;
};

const getModeSelect = (snap: InstalledSnap = snapWithChannels) =>
  screen.getByRole("combobox", {
    name: `Snap channel or revision for ${snap.snap.name}`,
  });

const getChannelSelect = (snap: InstalledSnap = snapWithChannels) =>
  screen.getByRole("combobox", { name: `Channel for ${snap.snap.name}` });

// SnapChannelRevisionFields fetches snap info itself; in the app it is already
// cached by SwitchChannelButton, but tests must wait for the channels to load.
const waitForChannels = async () =>
  waitFor(() => {
    expect(getChannelSelect()).toBeEnabled();
  });

const getRevisionInput = (snap: InstalledSnap = snapWithChannels) =>
  screen.getByRole("textbox", { name: `Revision for ${snap.snap.name}` });

describe("SwitchSnapForm", () => {
  describe("rendering", () => {
    it("renders the channel or revision fields and submit button", () => {
      renderSwitchSnapForm();

      expect(getModeSelect()).toHaveValue("channel");
      expect(getChannelSelect()).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /switch/i }),
      ).toBeInTheDocument();
    });

    it("renders delivery scheduling blocks", () => {
      renderSwitchSnapForm();

      expect(screen.getByLabelText("As soon as possible")).toBeInTheDocument();
      expect(screen.getByLabelText("No")).toBeInTheDocument();
    });

    it("populates channel options from snap info", async () => {
      renderSwitchSnapForm();
      await waitForChannels();

      const options = within(getChannelSelect()).getAllByRole("option");
      expect(options.length).toBeGreaterThan(0);
    });

    it("pre-selects the first available channel", async () => {
      renderSwitchSnapForm();
      await waitForChannels();

      const select = getChannelSelect();
      const options = within(select).getAllByRole("option");

      expect(select).toHaveValue(options[0]?.getAttribute("value") ?? "");
    });
  });

  describe("no available channels", () => {
    it("defaults to revision mode when no channels are available", () => {
      renderSwitchSnapForm(snapWithNoChannels, snapInfoWithNoChannels);

      expect(getModeSelect(snapWithNoChannels)).toHaveValue("revision");
      expect(getRevisionInput(snapWithNoChannels)).toBeInTheDocument();
    });

    it("requires a revision when submitting without one", async () => {
      const captured = captureRequest();
      renderSwitchSnapForm(snapWithNoChannels, snapInfoWithNoChannels);

      await userEvent.click(screen.getByRole("button", { name: /switch/i }));

      expect(
        await screen.findByText("This field is required"),
      ).toBeInTheDocument();
      expect(captured.body).toBeNull();
    });

    it("requires a channel or revision when switching to channel mode", async () => {
      const captured = captureRequest();
      renderSwitchSnapForm(snapWithNoChannels, snapInfoWithNoChannels);

      await userEvent.selectOptions(
        getModeSelect(snapWithNoChannels),
        "channel",
      );
      await userEvent.click(screen.getByRole("button", { name: /switch/i }));

      expect(
        await screen.findByText(
          "Select a channel or specify a revision to switch to",
        ),
      ).toBeInTheDocument();
      expect(captured.body).toBeNull();
    });
  });

  describe("channel selection", () => {
    beforeEach(async () => {
      renderSwitchSnapForm();
      await waitForChannels();
    });

    it("allows switching between channel options", async () => {
      const releaseSelect = getChannelSelect();
      const options: HTMLOptionElement[] =
        within(releaseSelect).getAllByRole("option");

      assert(options[0]);
      assert(options[1]);

      await userEvent.selectOptions(releaseSelect, options[1]);
      expect(options[0].selected).toBeFalsy();
      expect(options[1].selected).toBeTruthy();
    });
  });

  describe("form submission", () => {
    const channelMap = snapInfoWithChannels?.["channel-map"] ?? [];
    const strictChannel = channelMap.find(
      (channel) => channel.confinement === "strict",
    );
    const classicChannel = channelMap.find(
      (channel) => channel.confinement === "classic",
    );
    assert(strictChannel, "No strict release available to switch to.");
    assert(classicChannel, "No classic release available to switch to.");

    const releaseValue = (channel: AvailableSnapInfo["channel-map"][number]) =>
      channel.channel.name;

    it("submits successfully and shows success notification", async () => {
      renderSwitchSnapForm();

      await userEvent.click(screen.getByRole("button", { name: /switch/i }));

      expect(await screen.findByText(/you queued/i)).toBeInTheDocument();
      expect(await screen.findByText(/to be switched/i)).toBeInTheDocument();
    });

    it("shows a View details action that opens the activity details side panel", async () => {
      renderSwitchSnapForm();

      await userEvent.click(screen.getByRole("button", { name: /switch/i }));

      const viewDetailsButton = await screen.findByRole("button", {
        name: /view details/i,
      });
      await userEvent.click(viewDetailsButton);

      expect(
        await screen.findByText(SNAP_ACTION_ACTIVITY.summary),
      ).toBeInTheDocument();
    });

    it("sends classic: false when switching to a strict release", async () => {
      const captured = captureRequest();
      renderSwitchSnapForm({ ...snapWithChannels, confinement: "classic" });

      await waitForChannels();
      await userEvent.selectOptions(
        getChannelSelect(),
        releaseValue(strictChannel),
      );
      await userEvent.click(screen.getByRole("button", { name: /switch/i }));

      expect(await screen.findByText(/you queued/i)).toBeInTheDocument();
      expect(captured.body?.snaps).toEqual([
        {
          name: snapWithChannels.snap.name,
          args: {
            channel: strictChannel.channel.name,
            classic: false,
          },
        },
      ]);
    });

    it("sends the classic flag when switching to a classic release", async () => {
      const captured = captureRequest();
      renderSwitchSnapForm({ ...snapWithChannels, confinement: "strict" });

      await waitForChannels();
      await userEvent.selectOptions(
        getChannelSelect(),
        releaseValue(classicChannel),
      );
      await userEvent.click(screen.getByRole("button", { name: /switch/i }));

      expect(await screen.findByText(/you queued/i)).toBeInTheDocument();
      expect(captured.body?.snaps).toEqual([
        {
          name: snapWithChannels.snap.name,
          args: {
            channel: classicChannel.channel.name,
            classic: true,
          },
        },
      ]);
    });

    it("sends the revision when switching to a specific revision", async () => {
      const captured = captureRequest();
      renderSwitchSnapForm();

      await userEvent.selectOptions(getModeSelect(), "revision");
      await userEvent.type(getRevisionInput(), "42");
      await userEvent.click(screen.getByRole("button", { name: /switch/i }));

      expect(await screen.findByText(/you queued/i)).toBeInTheDocument();
      expect(captured.body?.snaps).toEqual([
        {
          name: snapWithChannels.snap.name,
          args: { revision: "42", classic: false },
        },
      ]);
    });

    it("submits with scheduled delivery and shows success notification", async () => {
      renderSwitchSnapForm();

      await userEvent.click(screen.getByLabelText("Scheduled"));
      const deliverAfterInput = await screen.findByLabelText(/deliver after/i);
      fireEvent.change(deliverAfterInput, {
        target: { value: "2026-12-31T12:00" },
      });

      await userEvent.click(screen.getByRole("button", { name: /switch/i }));

      expect(await screen.findByText(/you queued/i)).toBeInTheDocument();
    });

    it("submits with randomize delivery enabled and shows success notification", async () => {
      renderSwitchSnapForm();

      await userEvent.click(screen.getByLabelText("Yes"));
      await userEvent.click(screen.getByRole("button", { name: /switch/i }));

      expect(await screen.findByText(/you queued/i)).toBeInTheDocument();
    });

    it("blocks a channel switch when channel info fails to load", async () => {
      const captured = captureRequest();
      setEndpointStatus({
        path: "computers/:computerId/snaps/:name/info",
        status: "error",
      });
      renderSwitchSnapForm();

      expect(
        await screen.findByText("Failed to load channels for this snap"),
      ).toBeInTheDocument();
      await userEvent.click(screen.getByRole("button", { name: /switch/i }));

      expect(screen.queryByText(/you queued/i)).not.toBeInTheDocument();
      expect(captured.body).toBeNull();
    });

    it("allows a revision switch when channel info fails to load", async () => {
      const captured = captureRequest();
      setEndpointStatus({
        path: "computers/:computerId/snaps/:name/info",
        status: "error",
      });
      renderSwitchSnapForm();

      await userEvent.selectOptions(getModeSelect(), "revision");
      await userEvent.type(getRevisionInput(), "42");
      await userEvent.click(screen.getByRole("button", { name: /switch/i }));

      expect(await screen.findByText(/you queued/i)).toBeInTheDocument();
      expect(captured.body?.snaps).toEqual([
        {
          name: snapWithChannels.snap.name,
          args: { revision: "42", classic: false },
        },
      ]);
    });

    it("shows an error notification on API failure", async () => {
      setEndpointStatus("error");
      renderSwitchSnapForm();

      await userEvent.click(screen.getByRole("button", { name: /switch/i }));

      expect(
        await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
      ).toBeInTheDocument();
    });
  });
});
