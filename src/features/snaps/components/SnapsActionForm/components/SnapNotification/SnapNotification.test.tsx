import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SnapNotification from "./SnapNotification";

const changeChannelRevisionMessage =
  "Specifying a revision doesn't change the tracked channel, so future updates may replace it with that channel's latest revision.";

describe("SnapNotification", () => {
  it("renders the hold notification", () => {
    renderWithProviders(<SnapNotification action="hold" />);

    expect(
      screen.getByText("Landscape holds snaps indefinitely"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /held indefinitely from the moment the client executes/i,
      ),
    ).toBeInTheDocument();
  });

  it("renders the install revision notification", () => {
    renderWithProviders(
      <SnapNotification
        action="install"
        snapChangeConfigs={{
          snap1: { mode: "revision", value: "123" },
        }}
      />,
    );

    expect(
      screen.getByText(/revision doesn't set a tracked channel/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Visit Snapd documentation")).toBeInTheDocument();
  });

  it("renders the revision notification when a snap is in revision mode", () => {
    renderWithProviders(
      <SnapNotification
        action="change channel"
        snapModeConfigs={{
          snap1: { mode: "revision", value: "123" },
        }}
      />,
    );

    expect(screen.getByText(changeChannelRevisionMessage)).toBeInTheDocument();
    expect(screen.getByText("Visit Snapd documentation")).toBeInTheDocument();
  });

  it("does not render the revision notification when no snap is in revision mode", () => {
    renderWithProviders(
      <SnapNotification
        action="change channel"
        snapModeConfigs={{
          snap1: { mode: "channel", value: "latest/stable" },
        }}
      />,
    );

    expect(
      screen.queryByText(changeChannelRevisionMessage),
    ).not.toBeInTheDocument();
  });
});
