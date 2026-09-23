import { installedSnaps } from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import { ICONS } from "@canonical/react-components";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import SnapChangeChannelItem from "./SnapChangeChannelItem";

const [snapWithNoChannels, snapWithChannels] = installedSnaps;

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

    await screen.findByLabelText("Change to");

    expect(
      screen.getByText(
        `${snapWithChannels.snap.name} ${snapWithChannels.tracking_channel}`,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `Installed on ${snapWithChannels.computerCount} instances`,
      ),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Change to")).toBeInTheDocument();

    const deleteButton = screen.getByRole("button", {
      name: `Delete ${snapWithChannels.snap.name}`,
    });
    expect(deleteButton).toHaveIcon(ICONS.delete);
  });

  it("renders a mode dropdown with Channel and Revision options defaulting to Channel", async () => {
    renderWithProviders(<SnapChangeChannelItem {...props} />);

    const modeSelect = await screen.findByLabelText("Change to");
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

    const modeSelect = await screen.findByLabelText("Change to");
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

    const revisionInput = screen.getByRole("textbox", {
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
      expect(props.onChange).toHaveBeenCalledWith("latest/stable");
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

    expect(onChange).toHaveBeenCalledWith("latest/candidate");
  });

  it("calls onChange when a revision is entered", async () => {
    const onChange = vi.fn();
    renderWithProviders(
      <SnapChangeChannelItem {...props} mode="revision" onChange={onChange} />,
    );

    const revisionInput = await screen.findByRole("textbox", {
      name: `Revision for ${snapWithChannels.snap.name}`,
    });
    await user.click(revisionInput);
    await user.keyboard("123");
    await user.tab();
    expect(onChange).toHaveBeenLastCalledWith("123");
  });

  it("disables the channel dropdown when the snap has no available channels", async () => {
    renderWithProviders(
      <SnapChangeChannelItem {...props} selectedSnap={snapWithNoChannels} />,
    );

    const channelSelect = await screen.findByLabelText(
      `Channel for ${snapWithNoChannels.snap.name}`,
    );
    expect(channelSelect).toBeDisabled();
    expect(
      within(channelSelect).getByText("No channels available"),
    ).toBeInTheDocument();
  });

  it("calls onDelete when the delete button is clicked", async () => {
    renderWithProviders(<SnapChangeChannelItem {...props} />);

    await screen.findByLabelText("Change to");

    await user.click(
      screen.getByRole("button", {
        name: `Delete ${snapWithChannels.snap.name}`,
      }),
    );

    expect(props.onDelete).toHaveBeenCalled();
  });
});
