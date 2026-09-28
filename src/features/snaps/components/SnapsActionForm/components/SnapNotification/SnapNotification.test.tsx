import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SnapNotification from "./SnapNotification";

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

  it("renders the install notification", () => {
    renderWithProviders(<SnapNotification action="install" />);

    expect(
      screen.getByText("Instances of multiple architectures selected"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/will only be installed on compatible instances/i),
    ).toBeInTheDocument();
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
        action="hold"
        snapChangeConfigs={{
          snap1: { mode: "revision", value: "123" },
        }}
      />,
    );

    const holdIndex = container.textContent?.indexOf(
      "Landscape holds snaps indefinitely",
    );
    const revisionIndex = container.textContent?.indexOf(revisionTitle);

    expect(holdIndex).toBeGreaterThanOrEqual(0);
    expect(revisionIndex).toBeGreaterThan(holdIndex);
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
