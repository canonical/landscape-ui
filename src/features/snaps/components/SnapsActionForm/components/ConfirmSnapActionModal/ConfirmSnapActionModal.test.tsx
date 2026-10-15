import { installedSnaps } from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ConfirmSnapActionModal from "./ConfirmSnapActionModal";

const [firstSnap, secondSnap, , , , classicSnap] = installedSnaps;

const props: ComponentProps<typeof ConfirmSnapActionModal> = {
  actionVerb: "refresh",
  snaps: [firstSnap, secondSnap],
  instancesCount: 3,
  onClose: vi.fn(),
  onConfirm: vi.fn(),
  isSubmitting: false,
  submitText: "Act on 2 snaps",
};

describe("ConfirmSnapActionModal", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the title, content, and buttons", () => {
    renderWithProviders(<ConfirmSnapActionModal {...props} />);

    expect(
      screen.getByRole("heading", { name: "Refresh 2 snaps on 3 instances" }),
    ).toBeInTheDocument();

    expect(
      screen.getByText("The following snaps have been selected to refresh:"),
    ).toBeInTheDocument();
    expect(screen.getByText(firstSnap.snap.name)).toBeInTheDocument();
    expect(screen.getByText(secondSnap.snap.name)).toBeInTheDocument();
    expect(
      screen.getByText(
        /check .* selected instances for a newer revision on the channel/i,
      ),
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: props.submitText }),
    ).toBeInTheDocument();
  });

  it("uses the singular form for a single snap and instance", () => {
    renderWithProviders(
      <ConfirmSnapActionModal
        {...props}
        snaps={[firstSnap]}
        instancesCount={1}
        actionVerb="unhold"
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Unhold 1 snap on 1 instance" }),
    ).toBeInTheDocument();
  });

  it("uses singular 'has' phrasing for a single snap", () => {
    renderWithProviders(
      <ConfirmSnapActionModal {...props} snaps={[firstSnap]} />,
    );

    expect(
      screen.getByText("The following snap has been selected to refresh:"),
    ).toBeInTheDocument();
  });

  it("uses specific phrasing and negative confirm button for uninstall", () => {
    renderWithProviders(
      <ConfirmSnapActionModal {...props} actionVerb="uninstall" />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Uninstall 2 snaps from 3 instances",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: props.submitText })).toHaveClass(
      "p-button--negative",
    );
    expect(
      screen.getByText(/will be queued to uninstall/i),
    ).toBeInTheDocument();
  });

  it("renders the hold warning text", () => {
    renderWithProviders(
      <ConfirmSnapActionModal {...props} actionVerb="hold" />,
    );

    expect(
      screen.getByText(
        /hold all refreshes from the moment the client executes the activity/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/will replace the existing hold/i),
    ).toBeInTheDocument();
  });

  it("calls onConfirm when the confirm button is clicked", async () => {
    renderWithProviders(<ConfirmSnapActionModal {...props} />);

    await user.click(screen.getByRole("button", { name: props.submitText }));

    expect(props.onConfirm).toHaveBeenCalledOnce();
  });

  it("calls onClose when the cancel button is clicked", async () => {
    renderWithProviders(<ConfirmSnapActionModal {...props} />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(props.onClose).toHaveBeenCalledOnce();
  });

  it("uses channel-specific copy for change channel when only channel mode is selected", () => {
    renderWithProviders(
      <ConfirmSnapActionModal
        {...props}
        actionVerb="change channel"
        snapModes={["channel"]}
        snapModeConfigs={{
          [firstSnap.snap.id]: {
            mode: "channel",
            value: "",
            channel: "latest/stable",
          },
          [secondSnap.snap.id]: {
            mode: "channel",
            value: "",
            channel: "latest/stable",
          },
        }}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Change channel of 2 snaps on 3 instances",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "The following snaps have been selected to change channel:",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /will update the snap to the latest revision on the new channel/i,
      ),
    ).toBeInTheDocument();
  });

  it("uses revision-specific copy for change channel when only revision mode is selected", () => {
    renderWithProviders(
      <ConfirmSnapActionModal
        {...props}
        actionVerb="change channel"
        snapModes={["revision"]}
        snapModeConfigs={{
          [firstSnap.snap.id]: { mode: "revision", value: "123" },
          [secondSnap.snap.id]: { mode: "revision", value: "456" },
        }}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Change revision of 2 snaps on 3 instances",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "The following snaps have been selected to change revision:",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/will not change the snap's tracked channel/i),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(/latest revision on the new channel/i),
    ).not.toBeInTheDocument();
  });

  it("uses mixed copy for change channel when both channel and revision modes are selected", () => {
    renderWithProviders(
      <ConfirmSnapActionModal
        {...props}
        actionVerb="change channel"
        snapModes={["channel", "revision"]}
        snapModeConfigs={{
          [firstSnap.snap.id]: {
            mode: "channel",
            value: "",
            channel: "latest/stable",
          },
          [secondSnap.snap.id]: { mode: "revision", value: "123" },
        }}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Change channel or revision of 2 snaps on 3 instances",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "The following snaps have been selected to change channel or revision:",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/snaps set to a channel will update/i),
    ).toBeInTheDocument();
  });

  it("renders the install warning text when installing a classic snap", () => {
    const snaps = installedSnaps.slice(0, 6);
    renderWithProviders(
      <ConfirmSnapActionModal
        {...props}
        snaps={snaps}
        actionVerb="install"
        snapModeConfigs={Object.fromEntries(
          snaps.map(({ snap }) => [
            snap.id,
            { mode: "channel" as const, value: "", confinement: "classic" },
          ]),
        )}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "6 of 6 snaps require classic confinement",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/may have access to your files and system/i),
    ).toBeInTheDocument();
  });

  it("uses singular 'requires' phrasing for installing a single classic snap", () => {
    renderWithProviders(
      <ConfirmSnapActionModal
        {...props}
        snaps={[classicSnap]}
        actionVerb="install"
        snapModeConfigs={{
          [classicSnap.snap.id]: {
            mode: "channel",
            value: "",
            channel: "latest/edge",
            confinement: "classic",
          },
        }}
      />,
    );

    expect(
      screen.getByText(
        "The following snap you selected requires classic confinement:",
      ),
    ).toBeInTheDocument();
  });

  it("filters the list down to only classic snaps for change channel, dropping the rest of the batch", () => {
    renderWithProviders(
      <ConfirmSnapActionModal
        {...props}
        snaps={[firstSnap, secondSnap, classicSnap]}
        actionVerb="change channel"
        snapModes={["channel"]}
        snapModeConfigs={{
          [firstSnap.snap.id]: {
            mode: "channel",
            value: "",
            channel: "latest/stable",
          },
          [secondSnap.snap.id]: {
            mode: "channel",
            value: "",
            channel: "latest/stable",
          },
          [classicSnap.snap.id]: {
            mode: "channel",
            value: "",
            channel: "latest/edge",
            confinement: "classic",
          },
        }}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "1 of 3 snaps requires classic confinement",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "The following snap you selected requires classic confinement:",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText(firstSnap.snap.name)).not.toBeInTheDocument();
    expect(screen.queryByText(secondSnap.snap.name)).not.toBeInTheDocument();
    expect(screen.getByText(classicSnap.snap.name)).toBeInTheDocument();
    expect(
      screen.getByText(/only use classic confinement if you trust/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /will update the snap to the latest revision on the new channel/i,
      ),
    ).toBeInTheDocument();
  });

  it("keeps the mixed-mode guidance below the classic-confinement warning when some snaps also require classic confinement", () => {
    renderWithProviders(
      <ConfirmSnapActionModal
        {...props}
        snaps={[firstSnap, secondSnap, classicSnap]}
        actionVerb="change channel"
        snapModes={["channel", "revision"]}
        snapModeConfigs={{
          [firstSnap.snap.id]: {
            mode: "channel",
            value: "",
            channel: "latest/stable",
          },
          [secondSnap.snap.id]: { mode: "revision", value: "123" },
          [classicSnap.snap.id]: {
            mode: "channel",
            value: "",
            channel: "latest/edge",
            confinement: "classic",
          },
        }}
      />,
    );

    expect(
      screen.getByText(/snaps set to a channel will update/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: "1 of 3 snaps requires classic confinement",
      }),
    ).toBeInTheDocument();
  });

  it("does not require classic confinement for a snap left on its default channel when the classic checkbox is left unchecked", () => {
    renderWithProviders(
      <ConfirmSnapActionModal
        {...props}
        snaps={[firstSnap, secondSnap]}
        actionVerb="change channel"
        snapModes={["channel"]}
        snapModeConfigs={{
          [firstSnap.snap.id]: { mode: "channel", value: "", channel: "" },
          [secondSnap.snap.id]: {
            mode: "channel",
            value: "",
            channel: "latest/stable",
          },
        }}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Change channel of 2 snaps on 3 instances",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(firstSnap.snap.name)).toBeInTheDocument();
    expect(screen.getByText(secondSnap.snap.name)).toBeInTheDocument();
    expect(
      screen.queryByText(/requires classic confinement/i),
    ).not.toBeInTheDocument();
  });

  it("treats a snap left on its default channel as requiring classic confinement once the classic checkbox is checked", () => {
    renderWithProviders(
      <ConfirmSnapActionModal
        {...props}
        snaps={[firstSnap, secondSnap]}
        actionVerb="change channel"
        snapModes={["channel"]}
        snapModeConfigs={{
          [firstSnap.snap.id]: {
            mode: "channel",
            value: "",
            channel: "",
            confinement: "classic",
          },
          [secondSnap.snap.id]: {
            mode: "channel",
            value: "",
            channel: "latest/stable",
          },
        }}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "1 of 2 snaps requires classic confinement",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(firstSnap.snap.name)).toBeInTheDocument();
    expect(screen.queryByText(secondSnap.snap.name)).not.toBeInTheDocument();
  });

  it("does not treat a snap with no config entry at all (never touched by the user) as requiring classic confinement", () => {
    renderWithProviders(
      <ConfirmSnapActionModal
        {...props}
        snaps={[firstSnap, secondSnap]}
        actionVerb="change channel"
        snapModes={["channel"]}
        snapModeConfigs={{
          [secondSnap.snap.id]: {
            mode: "channel",
            value: "",
            channel: "latest/stable",
          },
        }}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Change channel of 2 snaps on 3 instances",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(firstSnap.snap.name)).toBeInTheDocument();
    expect(screen.getByText(secondSnap.snap.name)).toBeInTheDocument();
    expect(
      screen.queryByText(/requires classic confinement/i),
    ).not.toBeInTheDocument();
  });

  it("does not call out classic confinement for change channel when no snaps resolved to classic confinement", () => {
    renderWithProviders(
      <ConfirmSnapActionModal
        {...props}
        actionVerb="change channel"
        snapModes={["channel"]}
        snapModeConfigs={{
          [firstSnap.snap.id]: {
            mode: "channel",
            value: "",
            channel: "latest/stable",
          },
          [secondSnap.snap.id]: {
            mode: "channel",
            value: "",
            channel: "latest/stable",
          },
        }}
      />,
    );

    expect(
      screen.getByRole("heading", {
        name: "Change channel of 2 snaps on 3 instances",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText(firstSnap.snap.name)).toBeInTheDocument();
    expect(screen.getByText(secondSnap.snap.name)).toBeInTheDocument();
    expect(
      screen.queryByText(/requires classic confinement/i),
    ).not.toBeInTheDocument();
  });

  it("shows the chosen revision next to each snap in revision mode", () => {
    renderWithProviders(
      <ConfirmSnapActionModal
        {...props}
        actionVerb="install"
        snapModes={["revision"]}
        snapModeConfigs={{
          [firstSnap.snap.id]: { mode: "revision", value: "123" },
          [secondSnap.snap.id]: { mode: "revision", value: "456" },
        }}
      />,
    );

    expect(screen.getByText("(revision 123)")).toBeInTheDocument();
    expect(screen.getByText("(revision 456)")).toBeInTheDocument();
  });

  it("shows the chosen revision or channel per snap in mixed mode and a default label when no channel was found", () => {
    renderWithProviders(
      <ConfirmSnapActionModal
        {...props}
        snaps={[firstSnap, secondSnap, classicSnap]}
        actionVerb="change channel"
        snapModes={["channel", "revision"]}
        snapModeConfigs={{
          [firstSnap.snap.id]: {
            mode: "channel",
            value: "latest/edge",
            channel: "latest/edge",
          },
          [secondSnap.snap.id]: { mode: "revision", value: "123" },
          [classicSnap.snap.id]: { mode: "channel", value: "", channel: "" },
        }}
      />,
    );

    expect(screen.getByText("(latest/edge)")).toBeInTheDocument();
    expect(screen.getByText("(revision 123)")).toBeInTheDocument();

    const classicSnapItem = screen
      .getByText(classicSnap.snap.name)
      .closest("li");
    expect(classicSnapItem?.textContent).toBe(
      `${classicSnap.snap.name} (default)`,
    );
  });

  it("shows a default label only for a snap with no channels found, not for latest/stable", () => {
    renderWithProviders(
      <ConfirmSnapActionModal
        {...props}
        actionVerb="install"
        snapModes={["channel"]}
        snapModeConfigs={{
          [firstSnap.snap.id]: { mode: "channel", value: "", channel: "" },
          [secondSnap.snap.id]: {
            mode: "channel",
            value: "latest/stable",
            channel: "latest/stable",
          },
        }}
      />,
    );

    const firstSnapItem = screen.getByText(firstSnap.snap.name).closest("li");
    const secondSnapItem = screen.getByText(secondSnap.snap.name).closest("li");

    expect(firstSnapItem?.textContent).toBe(`${firstSnap.snap.name} (default)`);
    expect(secondSnapItem?.textContent).toBe(secondSnap.snap.name);
    expect(screen.getAllByText("(default)")).toHaveLength(1);
  });

  it("shows the chosen revision next to snaps that require classic confinement", () => {
    renderWithProviders(
      <ConfirmSnapActionModal
        {...props}
        snaps={[firstSnap, classicSnap]}
        actionVerb="install"
        snapModes={["revision"]}
        snapModeConfigs={{
          [firstSnap.snap.id]: { mode: "revision", value: "123" },
          [classicSnap.snap.id]: {
            mode: "revision",
            value: "789",
            confinement: "classic",
          },
        }}
      />,
    );

    expect(screen.getByText("(revision 789)")).toBeInTheDocument();
    expect(screen.queryByText("(revision 123)")).not.toBeInTheDocument();
  });

  it("shows the confirm button in a loading state while submitting", () => {
    renderWithProviders(<ConfirmSnapActionModal {...props} isSubmitting />);

    const confirmButton = screen.getByRole("button", {
      name: "Waiting for action to complete",
    });
    expect(confirmButton).toHaveAttribute("aria-disabled", "true");
    expect(confirmButton).toHaveIcon("spinner");
    expect(
      screen.queryByRole("button", { name: props.submitText }),
    ).not.toBeInTheDocument();
  });
});
