import { installedSnaps } from "@/tests/mocks/snap";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ConfirmSnapActionModal from "./ConfirmSnapActionModal";

const [firstSnap, secondSnap] = installedSnaps;

const props: ComponentProps<typeof ConfirmSnapActionModal> = {
  actionVerb: "refresh",
  snaps: [firstSnap, secondSnap],
  instancesCount: 3,
  onClose: vi.fn(),
  onConfirm: vi.fn(),
  isSubmitting: false,
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
      screen.getByRole("button", { name: "Refresh 2 snaps" }),
    ).toBeInTheDocument();
  });

  it("uses the singular form for a single snap and instance", () => {
    renderWithProviders(
      <ConfirmSnapActionModal
        {...props}
        snaps={[firstSnap]}
        instancesCount={1}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Refresh 1 snap on 1 instance" }),
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
    expect(
      screen.getByRole("button", { name: "Uninstall 2 snaps" }),
    ).toHaveClass("p-button--negative");
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

    await user.click(screen.getByRole("button", { name: "Refresh 2 snaps" }));

    expect(props.onConfirm).toHaveBeenCalledOnce();
  });

  it("calls onClose when the cancel button is clicked", async () => {
    renderWithProviders(<ConfirmSnapActionModal {...props} />);

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(props.onClose).toHaveBeenCalledOnce();
  });

  it("renders the install warning text", () => {
    renderWithProviders(
      <ConfirmSnapActionModal {...props} actionVerb="install" />,
    );

    expect(
      screen.getByRole("heading", { name: "Install 2 snaps on 3 instances" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/may have access to your files and system/i),
    ).toBeInTheDocument();
  });

  it("shows the confirm button in a loading state while submitting", () => {
    renderWithProviders(<ConfirmSnapActionModal {...props} isSubmitting />);

    const confirmButton = screen.getByRole("button", {
      name: "Waiting for action to complete",
    });
    expect(confirmButton).toHaveAttribute("aria-disabled", "true");
    expect(confirmButton).toHaveIcon("spinner");
    expect(
      screen.queryByRole("button", { name: "Refresh 2 snaps" }),
    ).not.toBeInTheDocument();
  });
});
