import { availableSnapInfo, installedSnaps } from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import { ICONS } from "@canonical/react-components";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { assert, beforeEach, describe, expect, it, vi } from "vitest";
import SnapChangeChannelItem from "./SnapChangeChannelItem";
import server from "@/tests/server";
import { http, HttpResponse } from "msw";
import { API_URL } from "@/constants";

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

const props: ComponentProps<typeof SnapChangeChannelItem> = {
  instanceIds: [1],
  selectedSnap: snapWithChannels,
  onDelete: vi.fn(),
  mode: "channel",
  value: "",
  onChange: vi.fn(),
  onModeChange: vi.fn(),
};

describe("SnapChangeChannelItem", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the snap name, current channel, delete button, and Change to label", async () => {
    renderWithProviders(<SnapChangeChannelItem {...props} />);

    await screen.findByLabelText(
      `Snap channel or revision for ${snapWithChannels.snap.name}`,
    );

    expect(screen.getByText(snapWithChannels.snap.name)).toBeInTheDocument();
    expect(
      screen.getByText(
        `Installed on ${snapWithChannels.computerCount} of 1 instance`,
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Change to")).toBeInTheDocument();
    expect(
      screen.getByLabelText(
        `Snap channel or revision for ${snapWithChannels.snap.name}`,
      ),
    ).toBeInTheDocument();

    const deleteButton = screen.getByRole("button", {
      name: `Delete ${snapWithChannels.snap.name}`,
    });
    expect(deleteButton).toHaveIcon(ICONS.delete);
  });

  it("renders a mode dropdown with Channel and Revision options defaulting to Channel", async () => {
    renderWithProviders(<SnapChangeChannelItem {...props} />);

    const modeSelect = await screen.findByLabelText(
      `Snap channel or revision for ${snapWithChannels.snap.name}`,
    );
    const options = within(modeSelect).getAllByRole("option");

    expect(options).toHaveLength(2);
    expect(options[0]).toHaveValue("channel");
    expect(options[0]).toHaveTextContent("Channel");
    expect(options[1]).toHaveValue("revision");
    expect(options[1]).toHaveTextContent("Revision");
    expect(modeSelect).toHaveValue("channel");
  });

  it("calls onModeChange when the mode dropdown is changed", async () => {
    const onModeChange = vi.fn();
    renderWithProviders(
      <SnapChangeChannelItem {...props} onModeChange={onModeChange} />,
    );

    const modeSelect = await screen.findByLabelText(
      `Snap channel or revision for ${snapWithChannels.snap.name}`,
    );
    await user.selectOptions(modeSelect, "revision");

    expect(onModeChange).toHaveBeenCalledWith("revision");
  });

  it("shows a channel dropdown when mode is channel", async () => {
    renderWithProviders(<SnapChangeChannelItem {...props} />);

    const channelSelect = await screen.findByLabelText(
      `Channel for ${snapWithChannels.snap.name}`,
    );

    await waitFor(() => {
      expect(within(channelSelect).getAllByRole("option")).toHaveLength(4);
    });
    expect(channelSelect).not.toBeDisabled();
  });

  it("shows a revision input when mode is revision", async () => {
    renderWithProviders(<SnapChangeChannelItem {...props} mode="revision" />);

    await waitFor(() => {
      expect(
        screen.queryByLabelText(`Channel for ${snapWithChannels.snap.name}`),
      ).not.toBeInTheDocument();
    });

    const revisionInput = screen.getByRole("spinbutton", {
      name: `Revision for ${snapWithChannels.snap.name}`,
    });
    expect(revisionInput).toBeInTheDocument();
  });

  it("populates the channel dropdown and auto-selects the first channel", async () => {
    renderWithProviders(<SnapChangeChannelItem {...props} />);

    const channelSelect = await screen.findByLabelText(
      `Channel for ${snapWithChannels.snap.name}`,
    );

    await waitFor(() => {
      expect(within(channelSelect).getAllByRole("option")).toHaveLength(4);
    });

    await waitFor(() => {
      expect(props.onChange).toHaveBeenCalledWith(
        "latest/stable",
        "latest/stable",
        "strict",
      );
    });
  });

  it("calls onChange when a channel is selected", async () => {
    const onChange = vi.fn();
    renderWithProviders(
      <SnapChangeChannelItem {...props} onChange={onChange} />,
    );

    const channelSelect = await screen.findByLabelText(
      `Channel for ${snapWithChannels.snap.name}`,
    );
    await waitFor(() => {
      expect(within(channelSelect).getAllByRole("option")).toHaveLength(4);
    });

    await user.selectOptions(channelSelect, "latest/candidate");

    expect(onChange).toHaveBeenCalledWith(
      "latest/candidate",
      "latest/candidate",
      "strict",
    );
  });

  it("calls onChange when a revision is entered", async () => {
    const onChange = vi.fn();
    renderWithProviders(
      <SnapChangeChannelItem {...props} mode="revision" onChange={onChange} />,
    );

    const revisionInput = await screen.findByRole("spinbutton", {
      name: `Revision for ${snapWithChannels.snap.name}`,
    });
    await user.click(revisionInput);
    await user.keyboard("123");
    await user.tab();
    expect(onChange).toHaveBeenLastCalledWith("123", undefined, "strict");
  });

  it("shows an unchecked 'Use classic confinement' checkbox in revision mode", async () => {
    renderWithProviders(<SnapChangeChannelItem {...props} mode="revision" />);

    const checkbox = await screen.findByRole("checkbox", {
      name: "Use classic confinement",
    });
    expect(checkbox).not.toBeChecked();
  });

  it("calls onChange with classic confinement when the checkbox is checked", async () => {
    const onChange = vi.fn();
    renderWithProviders(
      <SnapChangeChannelItem
        {...props}
        mode="revision"
        value="123"
        onChange={onChange}
      />,
    );

    const checkbox = await screen.findByRole("checkbox", {
      name: "Use classic confinement",
    });
    await user.click(checkbox);

    expect(checkbox).toBeChecked();
    expect(onChange).toHaveBeenLastCalledWith("123", undefined, "classic");
  });

  it("uses the latest typed revision when the checkbox is toggled without blurring first", async () => {
    const onChange = vi.fn();
    renderWithProviders(
      <SnapChangeChannelItem
        {...props}
        mode="revision"
        value="123"
        onChange={onChange}
      />,
    );

    const revisionInput = await screen.findByRole("spinbutton", {
      name: `Revision for ${snapWithChannels.snap.name}`,
    });
    await user.click(revisionInput);
    await user.clear(revisionInput);
    await user.keyboard("456");

    const checkbox = screen.getByRole("checkbox", {
      name: "Use classic confinement",
    });
    await user.click(checkbox);

    expect(onChange).toHaveBeenLastCalledWith("456", undefined, "classic");
  });

  it("shows an error for a non-positive-integer revision after submit is attempted", async () => {
    renderWithProviders(
      <SnapChangeChannelItem
        {...props}
        mode="revision"
        value="0"
        hasAttemptedSubmit
      />,
    );

    await screen.findByLabelText(
      `Snap channel or revision for ${snapWithChannels.snap.name}`,
    );

    expect(
      screen.getByText("Revision must be a positive whole number"),
    ).toBeInTheDocument();
  });

  it("displays Default channel as disabled with help text when the snap has no available channels", async () => {
    renderWithProviders(
      <SnapChangeChannelItem {...props} selectedSnap={snapWithNoChannels} />,
    );

    const channelSelect = await screen.findByLabelText(
      `Channel for ${snapWithNoChannels.snap.name}`,
    );
    await waitFor(() => {
      expect(channelSelect).toBeDisabled();
    });
    expect(
      within(channelSelect).getByText("Default channel"),
    ).toBeInTheDocument();
    expect(screen.getByText("No channels were found")).toBeInTheDocument();
  });

  it("does not show 'No channels were found' alongside the load error", async () => {
    server.use(
      http.get(
        `${API_URL}computers/:computerId/snaps/:name/info`,
        () =>
          HttpResponse.json(
            { error: "InternalServerError", message: "Error response" },
            { status: 500 },
          ),
      ),
    );

    renderWithProviders(<SnapChangeChannelItem {...props} />);

    expect(
      await screen.findByText("Failed to load channels for this snap"),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("No channels were found"),
    ).not.toBeInTheDocument();
  });

  it("calls onDelete when the delete button is clicked", async () => {
    renderWithProviders(<SnapChangeChannelItem {...props} />);

    await screen.findByLabelText(
      `Snap channel or revision for ${snapWithChannels.snap.name}`,
    );

    await user.click(
      screen.getByRole("button", {
        name: `Delete ${snapWithChannels.snap.name}`,
      }),
    );

    expect(props.onDelete).toHaveBeenCalled();
  });
});
