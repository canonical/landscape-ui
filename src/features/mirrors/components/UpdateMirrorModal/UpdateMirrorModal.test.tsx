import { renderWithProviders } from "@/tests/render";
import { afterEach, describe, expect, it, vi } from "vitest";
import type { ComponentProps } from "react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UpdateMirrorModal from "./UpdateMirrorModal";
import { mirrors } from "@/tests/mocks/mirrors";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";

describe("UpdateMirrorModal", () => {
  const close = vi.fn();
  const props: ComponentProps<typeof UpdateMirrorModal> = {
    close,
    isOpen: true,
    isUpdating: false,
    mirror: mirrors[0],
  };

  afterEach(() => {
    vi.clearAllMocks();
    setEndpointStatus("default");
  });

  it("doesn't render while closed", async () => {
    renderWithProviders(<UpdateMirrorModal {...props} isOpen={false} />);

    expect(
      screen.queryByText(`Update ${props.mirror.displayName}`),
    ).not.toBeInTheDocument();
  });

  it("updates a mirror", async () => {
    const user = userEvent.setup();
    renderWithProviders(<UpdateMirrorModal {...props} />);

    await user.click(screen.getByRole("button", { name: /update mirror/i }));

    expect(
      await screen.findByText(
        `You have marked ${props.mirror.displayName} to be updated`,
      ),
    ).toBeInTheDocument();
    expect(close).toHaveBeenCalled();
  });

  it("confirms cancelling an ongoing update before showing the update form", async () => {
    const user = userEvent.setup();
    renderWithProviders(<UpdateMirrorModal {...props} isUpdating />);

    expect(
      screen.getByText(`${props.mirror.displayName} is already updating`),
    ).toBeInTheDocument();
    expect(
      screen.queryByText(`Update ${props.mirror.displayName}`),
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /cancel update and continue/i }),
    );

    expect(props.close).not.toHaveBeenCalled();
  });

  it("unchecks skip existing packages when force update is checked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<UpdateMirrorModal {...props} />);

    const skipExistingPackages = screen.getByRole("checkbox", {
      name: /skip downloading packages that already exist/i,
    });
    const forceUpdate = screen.getByRole("checkbox", {
      name: /force a full update/i,
    });

    await user.click(skipExistingPackages);
    expect(skipExistingPackages).toBeChecked();

    await user.click(forceUpdate);

    expect(forceUpdate).toBeChecked();
    expect(skipExistingPackages).not.toBeChecked();
    expect(skipExistingPackages).toBeDisabled();
  });

  it("shows an error notification when updating a mirror fails", async () => {
    setEndpointStatus({ path: "mirrors/sync", status: "error" });
    const user = userEvent.setup();
    renderWithProviders(<UpdateMirrorModal {...props} />);

    await user.click(screen.getByRole("button", { name: /update mirror/i }));

    expect(close).not.toHaveBeenCalled();

    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
  });

  it("shows an error notification when canceling an ongoing update fails", async () => {
    setEndpointStatus({ path: "operations/cancel", status: "error" });
    const user = userEvent.setup();

    renderWithProviders(<UpdateMirrorModal {...props} isUpdating />);

    await user.click(
      screen.getByRole("button", { name: /cancel update and continue/i }),
    );

    expect(close).not.toHaveBeenCalled();

    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
  });
});
