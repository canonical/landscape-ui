import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SnapNotification from "./SnapNotification";

const architectureTitle = "Instance architecture compatibility";
const architectureBody = (action: string, target: string) =>
  `The ${action} action will only be applied to instances whose architecture is supported by ${target}.`;
const revisionTitle =
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

  it("renders the architecture notification for install without referring to a channel", () => {
    renderWithProviders(<SnapNotification action="install" />);

    expect(screen.getByText(architectureTitle)).toBeInTheDocument();
    expect(
      screen.getByText(architectureBody("install", "the snap")),
    ).toBeInTheDocument();
  });

  it("renders the architecture notification for change channel", () => {
    renderWithProviders(<SnapNotification action="change channel" />);

    expect(screen.getByText(architectureTitle)).toBeInTheDocument();
    expect(
      screen.getByText(/revision doesn't change the tracked channel/i),
    ).toBeInTheDocument();
  });

  it("dismisses the architecture notification without dismissing the revision notification", async () => {
    renderWithProviders(
      <SnapNotification
        action="change channel"
        snapChangeConfigs={{
          snap1: { mode: "revision", value: "123" },
        }}
      />,
    );

    expect(screen.getByText(architectureTitle)).toBeInTheDocument();
    expect(screen.getByText(revisionTitle)).toBeInTheDocument();

    const dismissButton = screen.getByRole("button", {
      name: /Close notification/i,
    });
    await userEvent.click(dismissButton);

    await waitFor(() => {
      expect(screen.queryByText(architectureTitle)).not.toBeInTheDocument();
    });
    expect(screen.getByText(revisionTitle)).toBeInTheDocument();
  });

  it("renders the revision notification when a snap is in revision mode", () => {
    renderWithProviders(
      <SnapNotification
        action="change channel"
        snapChangeConfigs={{
          snap1: { mode: "revision", value: "123" },
        }}
      />,
    );

    expect(screen.getByText(revisionTitle)).toBeInTheDocument();
    expect(screen.getByText("Visit Snapd documentation")).toBeInTheDocument();
  });

  it("renders the revision notification below the action notification", () => {
    const { container } = renderWithProviders(
      <SnapNotification
        action="change channel"
        snapChangeConfigs={{
          snap1: { mode: "revision", value: "123" },
        }}
      />,
    );

    const architectureIndex = container.textContent?.indexOf(architectureTitle);
    const revisionIndex = container.textContent?.indexOf(revisionTitle);

    expect(architectureIndex).toBeGreaterThanOrEqual(0);
    expect(revisionIndex).toBeGreaterThan(architectureIndex);
  });

  it("does not render the revision notification when no snap is in revision mode", () => {
    renderWithProviders(
      <SnapNotification
        action="change channel"
        snapChangeConfigs={{
          snap1: { mode: "channel", value: "latest/stable" },
        }}
      />,
    );

    expect(screen.queryByText(revisionTitle)).not.toBeInTheDocument();
  });
});
