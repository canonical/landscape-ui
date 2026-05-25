import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import RestartModal from "./RestartModal";
import { ubuntuInstance } from "@/tests/mocks/instance";
import { setEndpointStatus } from "@/tests/controllers/controller";

describe("RestartModal", () => {
  const user = userEvent.setup();

  afterEach(() => {
    setEndpointStatus("default");
  });

  it("renders the modal with correct title for a single instance", () => {
    renderWithProviders(
      <RestartModal close={vi.fn()} instances={[ubuntuInstance]} />,
    );

    expect(
      screen.getByRole("heading", {
        name: new RegExp(`Restart ${ubuntuInstance.title}`, "i"),
      }),
    ).toBeInTheDocument();
  });

  it("renders the modal with 'instances' in title for multiple instances", () => {
    const instances = [
      ubuntuInstance,
      { ...ubuntuInstance, id: 2, title: "Second instance" },
    ];
    renderWithProviders(<RestartModal close={vi.fn()} instances={instances} />);

    expect(
      screen.getByRole("heading", { name: /restart 2 instances/i }),
    ).toBeInTheDocument();
  });

  it('renders the "Deliver as soon as possible" checkbox checked by default', () => {
    renderWithProviders(
      <RestartModal close={vi.fn()} instances={[ubuntuInstance]} />,
    );

    const checkbox = screen.getByRole("checkbox", {
      name: /deliver as soon as possible/i,
    });
    expect(checkbox).toBeChecked();
  });

  it("renders the scheduled time input disabled by default", () => {
    renderWithProviders(
      <RestartModal close={vi.fn()} instances={[ubuntuInstance]} />,
    );

    const input = screen.getByPlaceholderText(/scheduled time/i);
    expect(input).toBeDisabled();
  });

  it("enables the datetime input when unchecking immediate delivery", async () => {
    renderWithProviders(
      <RestartModal close={vi.fn()} instances={[ubuntuInstance]} />,
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
      <RestartModal close={close} instances={[ubuntuInstance]} />,
    );

    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(close).toHaveBeenCalledOnce();
  });

  it("shows success notification after restart", async () => {
    renderWithProviders(
      <RestartModal close={vi.fn()} instances={[ubuntuInstance]} />,
    );

    await user.click(screen.getByRole("button", { name: /^restart$/i }));

    await waitFor(() => {
      expect(
        screen.getByText(
          new RegExp(`You queued ${ubuntuInstance.title} to be restarted`, "i"),
        ),
      ).toBeInTheDocument();
    });
  });

  it("shows success notification after scheduled restart", async () => {
    renderWithProviders(
      <RestartModal close={vi.fn()} instances={[ubuntuInstance]} />,
    );

    const checkbox = screen.getByRole("checkbox", {
      name: /deliver as soon as possible/i,
    });
    await user.click(checkbox);

    const input = screen.getByPlaceholderText(/scheduled time/i);
    await user.type(input, "2099-12-31T12:00");

    await user.click(screen.getByRole("button", { name: /^restart$/i }));

    await waitFor(() => {
      expect(
        screen.getByText(
          new RegExp(`You queued ${ubuntuInstance.title} to be restarted`, "i"),
        ),
      ).toBeInTheDocument();
    });
  });

  it("shows validation error when scheduled time is not set", async () => {
    renderWithProviders(
      <RestartModal close={vi.fn()} instances={[ubuntuInstance]} />,
    );

    const checkbox = screen.getByRole("checkbox", {
      name: /deliver as soon as possible/i,
    });
    await user.click(checkbox);

    await user.click(screen.getByRole("button", { name: /^restart$/i }));

    await waitFor(() => {
      expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
    });
  });

  it("shows 'This will restart' description with instance title", () => {
    renderWithProviders(
      <RestartModal close={vi.fn()} instances={[ubuntuInstance]} />,
    );

    expect(
      screen.getByText(
        new RegExp(`This will restart ${ubuntuInstance.title}`, "i"),
      ),
    ).toBeInTheDocument();
  });

  it("calls openActivityDetails when 'View details' is clicked in notification", async () => {
    renderWithProviders(
      <RestartModal close={vi.fn()} instances={[ubuntuInstance]} />,
    );

    await user.click(screen.getByRole("button", { name: /^restart$/i }));

    const viewDetailsButton = await screen.findByRole("button", {
      name: /view details/i,
    });
    await user.click(viewDetailsButton);
  });

  it("shows error notification when restart API fails", async () => {
    setEndpointStatus({ status: "error", path: "RebootComputers" });

    renderWithProviders(
      <RestartModal close={vi.fn()} instances={[ubuntuInstance]} />,
    );

    await user.click(screen.getByRole("button", { name: /^restart$/i }));

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
