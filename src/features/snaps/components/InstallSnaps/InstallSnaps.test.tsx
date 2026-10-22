import { API_URL } from "@/constants";
import { PATHS } from "@/libs/routes";
import {
  availableSnapInfo,
  bulkAvailableSnaps,
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
import InstallSnaps from "./InstallSnaps";

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

const renderInstallSnaps = () =>
  renderWithProviders(
    <InstallSnaps />,
    {},
    `/instances/${INSTANCE_ID}`,
    `/${PATHS.instances.root}/${PATHS.instances.single}`,
  );

describe("InstallSnaps", () => {
  const user = userEvent.setup();

  const selectSnap = async () => {
    await user.type(screen.getByRole("searchbox"), snapToInstall.snap.name);
    await user.click(
      await screen.findByRole("option", {
        name: `${snapToInstall.snap.name} ${snapToInstall.snap.publisher.username}`,
      }),
    );
  };

  it("renders the bulk install form", () => {
    renderInstallSnaps();

    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Install snaps" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("shows channel and revision fields for a selected snap", async () => {
    renderInstallSnaps();

    await selectSnap();

    expect(
      screen.getByRole("combobox", {
        name: `Snap channel or revision for ${snapToInstall.snap.name}`,
      }),
    ).toBeInTheDocument();
  });

  it("installs the selected channel on the instance from the URL", async () => {
    let requestBody: SnapActionParams | null = null;

    server.use(
      http.post(`${API_URL}snaps`, async ({ request }) => {
        requestBody = (await request.json()) as SnapActionParams;
        return HttpResponse.json(successfulSnapInstallResponse);
      }),
    );

    renderInstallSnaps();

    await selectSnap();

    await waitFor(() => {
      expect(
        screen.getByRole("combobox", {
          name: `Channel for ${snapToInstall.snap.name}`,
        }),
      ).toHaveValue(firstChannel.value);
    });

    await user.click(screen.getByRole("button", { name: "Install 1 snap" }));
    const modal = await screen.findByRole("dialog");
    await user.click(
      within(modal).getByRole("button", { name: "Install 1 snap" }),
    );

    expect(
      await screen.findByText("Snaps successfully queued to install"),
    ).toBeInTheDocument();
    expect(requestBody).toEqual({
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
    let requestBody: SnapActionParams | null = null;

    server.use(
      http.post(`${API_URL}snaps`, async ({ request }) => {
        requestBody = (await request.json()) as SnapActionParams;
        return HttpResponse.json(successfulSnapInstallResponse);
      }),
    );

    renderInstallSnaps();

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

    await user.click(screen.getByRole("button", { name: "Install 1 snap" }));
    const modal = await screen.findByRole("dialog");
    await user.click(
      within(modal).getByRole("button", { name: "Install 1 snap" }),
    );

    expect(
      await screen.findByText("Snaps successfully queued to install"),
    ).toBeInTheDocument();
    expect(requestBody).toEqual({
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
