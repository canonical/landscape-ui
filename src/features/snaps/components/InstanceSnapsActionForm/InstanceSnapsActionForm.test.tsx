import { API_URL } from "@/constants";
import { PATHS } from "@/libs/routes";
import {
  availableSnapInfo,
  bulkAvailableSnaps,
  installedSnaps,
  successfulSnapInstallResponse,
} from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { assert, describe, expect, it } from "vitest";
import { getChannelConfinement, getChannelOptions } from "../../helpers";
import type { SnapActionParams } from "../../types";
import InstanceSnapsActionForm from "./InstanceSnapsActionForm";
import type { ComponentProps } from "react";

const INSTANCE_ID = 1;

const snapToInstall = bulkAvailableSnaps.find(({ snap }) =>
  availableSnapInfo.some(
    (info) => info.name === snap.name && info["channel-map"].length > 0,
  ),
);
assert(snapToInstall, "No available snap has channels to install from.");

const snapToInstallInfo = availableSnapInfo.find(
  (info) => info.name === snapToInstall.snap.name,
);
const [firstChannel] = getChannelOptions(snapToInstallInfo?.["channel-map"]);
assert(firstChannel);

const unheldSnap = installedSnaps.find((snap) => snap.held_until === null);
const heldSnap = installedSnaps.find((snap) => snap.held_until !== null);
assert(unheldSnap);
assert(heldSnap);

const snapWithNoChannels = installedSnaps.find((snap) =>
  availableSnapInfo.some(
    (info) => info.name === snap.snap.name && info["channel-map"].length === 0,
  ),
);
assert(snapWithNoChannels, "No installed snap has zero available channels.");

const renderForm = (props: ComponentProps<typeof InstanceSnapsActionForm>) =>
  renderWithProviders(
    <InstanceSnapsActionForm {...props} />,
    {},
    `/instances/${INSTANCE_ID}`,
    `/${PATHS.instances.root}/${PATHS.instances.single}`,
  );

const captureRequest = () => {
  let requestBody: SnapActionParams | null = null;
  server.use(
    http.post(`${API_URL}snaps`, async ({ request }) => {
      requestBody = (await request.json()) as SnapActionParams;
      return HttpResponse.json(successfulSnapInstallResponse);
    }),
  );
  return () => requestBody;
};

describe("InstanceSnapsActionForm", () => {
  const user = userEvent.setup();

  const submitAndConfirm = async (buttonName: string | RegExp) => {
    await user.click(screen.getByRole("button", { name: buttonName }));
    const modal = await screen.findByRole("dialog");
    await user.click(within(modal).getByRole("button", { name: buttonName }));
  };

  describe("install", () => {
    const selectSnap = async () => {
      await user.type(screen.getByRole("searchbox"), snapToInstall.snap.name);
      await user.click(
        await screen.findByRole("option", {
          name: `${snapToInstall.snap.name} ${snapToInstall.snap.publisher.username}`,
        }),
      );
    };

    it("renders the bulk install form without delivery scheduling", () => {
      renderForm({ action: "install" });

      expect(screen.getByRole("searchbox")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Install snaps" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Cancel" }),
      ).toBeInTheDocument();
      expect(screen.queryByText("Delivery time")).not.toBeInTheDocument();
    });

    it("shows channel and revision fields for a selected snap", async () => {
      renderForm({ action: "install" });

      await selectSnap();

      expect(
        screen.getByRole("combobox", {
          name: `Snap channel or revision for ${snapToInstall.snap.name}`,
        }),
      ).toBeInTheDocument();
    });

    it("installs the selected channel on the instance from the URL", async () => {
      const getRequestBody = captureRequest();

      renderForm({ action: "install" });

      await selectSnap();

      await waitFor(() => {
        expect(
          screen.getByRole("combobox", {
            name: `Channel for ${snapToInstall.snap.name}`,
          }),
        ).toHaveValue(firstChannel.value);
      });

      await submitAndConfirm("Install 1 snap");

      expect(
        await screen.findByText("Snaps successfully queued to install"),
      ).toBeInTheDocument();
      expect(getRequestBody()).toEqual({
        action: "install",
        computer_ids: [INSTANCE_ID],
        snaps: [
          {
            name: snapToInstall.snap.name,
            args: {
              channel: firstChannel.value,
              classic:
                getChannelConfinement(
                  snapToInstallInfo?.["channel-map"],
                  firstChannel.value,
                ) === "classic",
            },
          },
        ],
      });
    });

    it("installs a specific revision", async () => {
      const getRequestBody = captureRequest();

      renderForm({ action: "install" });

      await selectSnap();

      await user.selectOptions(
        screen.getByRole("combobox", {
          name: `Snap channel or revision for ${snapToInstall.snap.name}`,
        }),
        "revision",
      );
      await user.type(
        screen.getByRole("textbox", {
          name: `Revision for ${snapToInstall.snap.name}`,
        }),
        "42",
      );

      await submitAndConfirm("Install 1 snap");

      expect(
        await screen.findByText("Snaps successfully queued to install"),
      ).toBeInTheDocument();
      expect(getRequestBody()).toEqual({
        action: "install",
        computer_ids: [INSTANCE_ID],
        snaps: [
          {
            name: snapToInstall.snap.name,
            args: { revision: "42", classic: false },
          },
        ],
      });
    });
  });

  describe("actions on installed snaps", () => {
    it("lists the given snaps with no search box and no delete buttons", () => {
      renderForm({ action: "refresh", installedSnaps: [unheldSnap, heldSnap] });

      expect(screen.queryByRole("searchbox")).not.toBeInTheDocument();
      expect(screen.getByText("Snaps to refresh")).toBeInTheDocument();
      expect(screen.getByText(unheldSnap.snap.name)).toBeInTheDocument();
      expect(screen.getByText(heldSnap.snap.name)).toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /^Delete / }),
      ).not.toBeInTheDocument();
      expect(screen.queryByText(/Installed on/)).not.toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Refresh 2 snaps" }),
      ).toBeInTheDocument();
    });

    it("offers delivery scheduling", () => {
      renderForm({ action: "refresh", installedSnaps: [unheldSnap] });

      expect(screen.getByText("Delivery time")).toBeInTheDocument();
      expect(
        screen.getByText("Randomize delivery over a time window"),
      ).toBeInTheDocument();
    });

    it("confirms before sending and shows the bulk success notification", async () => {
      const getRequestBody = captureRequest();

      renderForm({ action: "uninstall", installedSnaps: [unheldSnap] });

      await user.click(
        screen.getByRole("button", { name: "Uninstall 1 snap" }),
      );

      expect(getRequestBody()).toBeNull();
      const modal = await screen.findByRole("dialog", {
        name: "Uninstall 1 snap from 1 instance",
      });
      await user.click(
        within(modal).getByRole("button", { name: "Uninstall 1 snap" }),
      );

      expect(
        await screen.findByText("Snaps successfully queued to uninstall"),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "View details" }),
      ).toBeInTheDocument();
      expect(getRequestBody()).toEqual({
        action: "remove",
        computer_ids: [INSTANCE_ID],
        snaps: [{ name: unheldSnap.snap.name }],
      });
    });

    it("holds indefinitely with no time argument and shows the hold notice", async () => {
      const getRequestBody = captureRequest();

      renderForm({ action: "hold", installedSnaps: [unheldSnap] });

      expect(
        screen.getByText("Landscape holds snaps indefinitely"),
      ).toBeInTheDocument();
      expect(screen.queryByLabelText("Select date")).not.toBeInTheDocument();

      await submitAndConfirm("Hold 1 snap");

      expect(
        await screen.findByText("Snaps successfully queued to hold"),
      ).toBeInTheDocument();
      expect(getRequestBody()).toEqual({
        action: "hold",
        computer_ids: [INSTANCE_ID],
        snaps: [{ name: unheldSnap.snap.name }],
      });
    });

    it("sends a scheduled delivery", async () => {
      const getRequestBody = captureRequest();

      renderForm({ action: "unhold", installedSnaps: [heldSnap] });

      await user.click(screen.getByLabelText("Scheduled"));
      await user.click(screen.getByLabelText("Yes"));
      const delayWindowInput = screen.getByLabelText("Delivery delay window");
      await user.clear(delayWindowInput);
      await user.type(delayWindowInput, "30");

      await submitAndConfirm("Unhold 1 snap");

      expect(
        await screen.findByText("Snaps successfully queued to unhold"),
      ).toBeInTheDocument();
      expect(getRequestBody()).toMatchObject({
        action: "unhold",
        deliver_after: expect.stringMatching(/^\d{4}-\d{2}-\d{2}T/),
        deliver_after_window: 30,
      });
    });
  });

  describe("change channel", () => {
    it("changes to the selected channel with the bulk confirmation and notification", async () => {
      const getRequestBody = captureRequest();

      const snapWithChannels = installedSnaps.find((snap) =>
        availableSnapInfo.some(
          (info) =>
            info.name === snap.snap.name && info["channel-map"].length > 0,
        ),
      );
      assert(snapWithChannels);
      const snapInfo = availableSnapInfo.find(
        (info) => info.name === snapWithChannels.snap.name,
      );
      const [channel] = getChannelOptions(snapInfo?.["channel-map"]);
      assert(channel);

      renderForm({
        action: "change channel",
        installedSnaps: [snapWithChannels],
      });

      expect(screen.getByText("Change to")).toBeInTheDocument();
      await waitFor(() => {
        expect(
          screen.getByRole("combobox", {
            name: `Channel for ${snapWithChannels.snap.name}`,
          }),
        ).toHaveValue(channel.value);
      });

      await user.click(screen.getByRole("button", { name: "Change channel" }));
      const modal = await screen.findByRole("dialog", {
        name: "Change channel of 1 snap on 1 instance",
      });
      await user.click(
        within(modal).getByRole("button", { name: "Change channel" }),
      );

      expect(
        await screen.findByText("Snaps successfully queued to change channel"),
      ).toBeInTheDocument();
      expect(getRequestBody()).toMatchObject({
        action: "refresh",
        computer_ids: [INSTANCE_ID],
        snaps: [
          {
            name: snapWithChannels.snap.name,
            args: { channel: channel.value },
          },
        ],
      });
    });

    it("shows the revision notice and sends the revision", async () => {
      const getRequestBody = captureRequest();

      renderForm({
        action: "change channel",
        installedSnaps: [snapWithNoChannels],
      });

      expect(
        await screen.findByText("No channels were found"),
      ).toBeInTheDocument();

      await user.selectOptions(
        screen.getByRole("combobox", {
          name: `Snap channel or revision for ${snapWithNoChannels.snap.name}`,
        }),
        "revision",
      );

      expect(
        screen.getByText(/Specifying a revision doesn't change the tracked/),
      ).toBeInTheDocument();

      await user.type(
        screen.getByRole("textbox", {
          name: `Revision for ${snapWithNoChannels.snap.name}`,
        }),
        "7",
      );

      await user.click(screen.getByRole("button", { name: "Change channel" }));
      const modal = await screen.findByRole("dialog", {
        name: "Change revision of 1 snap on 1 instance",
      });
      await user.click(
        within(modal).getByRole("button", { name: "Change channel" }),
      );

      expect(
        await screen.findByText("Snaps successfully queued to change revision"),
      ).toBeInTheDocument();
      expect(getRequestBody()).toMatchObject({
        action: "refresh",
        snaps: [
          {
            name: snapWithNoChannels.snap.name,
            args: { revision: "7", classic: false },
          },
        ],
      });
    });
  });
});
