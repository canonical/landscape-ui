import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import ShutDownModal from "./ShutDownModal";
import { ubuntuInstance } from "@/tests/mocks/instance";
import { setEndpointStatus } from "@/tests/controllers/controller";

describe("ShutDownModal", () => {
  const user = userEvent.setup();

  afterEach(() => {
    setEndpointStatus("default");
  });

  it("renders the modal with correct title for a single instance", () => {
    renderWithProviders(
      <ShutDownModal close={vi.fn()} instances={[ubuntuInstance]} />,
    );

    expect(
      screen.getByRole("heading", {
        name: new RegExp(`Shut down ${ubuntuInstance.title}`, "i"),
      }),
    ).toBeInTheDocument();
  });

  it("renders the modal with 'instances' in title for multiple instances", () => {
    const instances = [
      ubuntuInstance,
      { ...ubuntuInstance, id: 2, title: "Second instance" },
    ];
    renderWithProviders(
      <ShutDownModal close={vi.fn()} instances={instances} />,
    );

    expect(
      screen.getByRole("heading", { name: /shut down 2 instances/i }),
    ).toBeInTheDocument();
  });

  it('renders the "Deliver as soon as possible" checkbox checked by default', () => {
    renderWithProviders(
      <ShutDownModal close={vi.fn()} instances={[ubuntuInstance]} />,
    );

    const checkbox = screen.getByRole("checkbox", {
      name: /deliver as soon as possible/i,
    });
    expect(checkbox).toBeChecked();
  });

  it("renders the scheduled time input disabled by default", () => {
    renderWithProviders(
      <ShutDownModal close={vi.fn()} instances={[ubuntuInstance]} />,
    );

    const input = screen.getByPlaceholderText(/scheduled time/i);
    expect(input).toBeDisabled();
  });

  it("enables the datetime input when unchecking immediate delivery", async () => {
    renderWithProviders(
      <ShutDownModal close={vi.fn()} instances={[ubuntuInstance]} />,
    );

    const checkbox = screen.getByRole("checkbox", {
      name: /deliver as soon as possible/i,
    });
    await user.click(checkbox);

    const input = screen.getByPlaceholderText(/scheduled time/i);
    expect(input).not.toBeDisabled();
  });

  it("calls close when clicking the Cancel button", async () => {
    const close = vi.fn();
    renderWithProviders(
      <ShutDownModal close={close} instances={[ubuntuInstance]} />,
    );

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(close).toHaveBeenCalledOnce();
  });

  it("shows a description mentioning the instance name", () => {
    renderWithProviders(
      <ShutDownModal close={vi.fn()} instances={[ubuntuInstance]} />,
    );

    expect(
      screen.getByText(
        new RegExp(`This will shut down ${ubuntuInstance.title}`, "i"),
      ),
    ).toBeInTheDocument();
  });

  it("shows success notification after shutdown", async () => {
    renderWithProviders(
      <ShutDownModal close={vi.fn()} instances={[ubuntuInstance]} />,
    );

    await user.click(screen.getByRole("button", { name: /shut down/i }));

    await waitFor(() => {
      expect(
        screen.getByText(
          new RegExp(`You queued ${ubuntuInstance.title} to be shut down`, "i"),
        ),
      ).toBeInTheDocument();
    });
  });

  it("shows success notification after scheduled shutdown", async () => {
    renderWithProviders(
      <ShutDownModal close={vi.fn()} instances={[ubuntuInstance]} />,
    );

    const checkbox = screen.getByRole("checkbox", {
      name: /deliver as soon as possible/i,
    });
    await user.click(checkbox);

    const input = screen.getByPlaceholderText(/scheduled time/i);
    await user.type(input, "2099-12-31T12:00");

    await user.click(screen.getByRole("button", { name: /shut down/i }));

    await waitFor(() => {
      expect(
        screen.getByText(
          new RegExp(`You queued ${ubuntuInstance.title} to be shut down`, "i"),
        ),
      ).toBeInTheDocument();
    });
  });

  it("shows validation error when scheduled time is not set", async () => {
    renderWithProviders(
      <ShutDownModal close={vi.fn()} instances={[ubuntuInstance]} />,
    );

    const checkbox = screen.getByRole("checkbox", {
      name: /deliver as soon as possible/i,
    });
    await user.click(checkbox);

    await user.click(screen.getByRole("button", { name: /shut down/i }));

    await waitFor(() => {
      expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
    });
  });

  it("calls openActivityDetails when 'View details' is clicked in notification", async () => {
    renderWithProviders(
      <ShutDownModal close={vi.fn()} instances={[ubuntuInstance]} />,
    );

    await user.click(screen.getByRole("button", { name: /shut down/i }));

    const viewDetailsButton = await screen.findByRole("button", {
      name: /view details/i,
    });
    await user.click(viewDetailsButton);
  });

  it("shows error notification when shutdown API fails", async () => {
    setEndpointStatus({ status: "error", path: "ShutdownComputers" });

    renderWithProviders(
      <ShutDownModal close={vi.fn()} instances={[ubuntuInstance]} />,
    );

    await user.click(screen.getByRole("button", { name: /shut down/i }));

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
