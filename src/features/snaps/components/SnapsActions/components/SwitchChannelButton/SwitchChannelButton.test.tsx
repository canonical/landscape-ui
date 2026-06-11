import { PATHS, ROUTES } from "@/libs/routes";
import { availableSnapInfo, installedSnaps } from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { assert, describe, expect, it } from "vitest";
import SwitchChannelButton from "./SwitchChannelButton";

const INSTANCE_ID = 11;

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

const renderSwitchChannelButton = (
  snap = snapWithChannels,
  selectedSnaps = [snap],
) =>
  renderWithProviders(
    <SwitchChannelButton snap={snap} selectedSnaps={selectedSnaps} />,
    undefined,
    ROUTES.instances.details.single(INSTANCE_ID),
    `/${PATHS.instances.root}/${PATHS.instances.single}`,
  );

describe("SwitchChannelButton", () => {
  it("renders the switch channel button", () => {
    renderSwitchChannelButton();

    expect(
      screen.getByRole("button", { name: "Switch channel" }),
    ).toBeInTheDocument();
  });

  it("enables the button once channels are fetched", async () => {
    renderSwitchChannelButton();

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Switch channel" }),
      ).toBeEnabled();
    });
  });

  it("disables the button with a tooltip when no channels are available", async () => {
    const user = userEvent.setup();
    renderSwitchChannelButton(snapWithNoChannels);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Switch channel" }),
      ).toHaveAttribute("aria-disabled");
    });

    await user.hover(screen.getByText("Switch channel"));

    expect(
      await screen.findByText("No available channels to switch to."),
    ).toBeVisible();
  });

  it("opens the switch snap form side panel when clicked", async () => {
    const user = userEvent.setup();
    assert(snapWithChannels);
    renderSwitchChannelButton(snapWithChannels);

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Switch channel" }),
      ).not.toHaveAttribute("aria-disabled");
    });

    await user.click(screen.getByRole("button", { name: "Switch channel" }));

    expect(
      await screen.findByRole("heading", {
        name: /Switch .*'s channel/i,
      }),
    ).toBeInTheDocument();
  });
});
