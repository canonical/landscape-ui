import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { SNAPD_REST_API_DOCUMENTATION_URL } from "@/constants";
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
        snapModeConfigs={{
          snap1: { mode: "revision", value: "123" },
        }}
      />,
    );

    expect(screen.getByText(/revision tracks/i)).toBeInTheDocument();
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

  it("opens the snapd documentation URL when the documentation link is clicked", async () => {
    const user = userEvent.setup();
    global.window.open = vi.fn();

    renderWithProviders(
      <SnapNotification
        action="install"
        snapModeConfigs={{
          snap1: { mode: "revision", value: "123" },
        }}
      />,
    );

    const docsLink = screen.getByText("Visit Snapd documentation");
    await user.click(docsLink);

    expect(window.open).toHaveBeenCalledWith(
      SNAPD_REST_API_DOCUMENTATION_URL,
      "_blank",
      "noopener,noreferrer",
    );
  });
});
