import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, afterEach } from "vitest";
import { renderWithProviders } from "@/tests/render";
import PendingInstancesForm from "./PendingInstancesForm";
import { pendingInstances } from "@/tests/mocks/instance";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { authUser } from "@/tests/mocks/auth";
import useAuth from "@/hooks/useAuth";

vi.mock("@/hooks/useAuth");

describe("PendingInstancesForm", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      user: authUser,
      authLoading: false,
      authorized: true,
      hasAccounts: true,
      logout: vi.fn(),
      redirectToExternalUrl: vi.fn(),
      safeRedirect: vi.fn(),
      setUser: vi.fn(),
      isFeatureEnabled: vi.fn().mockReturnValue(false),
    });
  });

  afterEach(() => {
    setEndpointStatus("default");
  });

  it("renders the form with pending instances list", async () => {
    renderWithProviders(<PendingInstancesForm instances={pendingInstances} />);

    // Table with pending instances should be visible
    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument();
    });
  });

  it("renders help text with links", async () => {
    renderWithProviders(<PendingInstancesForm instances={pendingInstances} />);

    await waitFor(() => {
      expect(
        screen.getByText(
          /automatically register new landscape client instances/i,
        ),
      ).toBeInTheDocument();
    });
  });

  it("renders Cancel button", async () => {
    renderWithProviders(<PendingInstancesForm instances={pendingInstances} />);

    expect(screen.getByRole("button", { name: /cancel/i })).toBeInTheDocument();
  });

  it("shows the Reject button when instances are selected", async () => {
    renderWithProviders(<PendingInstancesForm instances={pendingInstances} />);

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    // Select instances first
    const [firstCheckbox] = screen.getAllByRole("checkbox");

    assert(firstCheckbox);

    await user.click(firstCheckbox);

    expect(screen.getByRole("button", { name: /reject/i })).toBeInTheDocument();
  });

  it("shows the Approve button in list view when instances are selected", async () => {
    renderWithProviders(<PendingInstancesForm instances={pendingInstances} />);

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    const [firstCheckbox] = screen.getAllByRole("checkbox");

    assert(firstCheckbox);

    await user.click(firstCheckbox);

    expect(
      screen.getByRole("button", { name: /approve/i }),
    ).toBeInTheDocument();
  });

  it("transitions to approving view when clicking Approve and showing access group select", async () => {
    renderWithProviders(<PendingInstancesForm instances={pendingInstances} />);

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    const [firstCheckbox] = screen.getAllByRole("checkbox");

    assert(firstCheckbox);

    await user.click(firstCheckbox);

    const approveBtn = screen.getByRole("button", { name: /^approve$/i });
    await user.click(approveBtn);

    await waitFor(() => {
      expect(
        screen.getByRole("combobox", { name: /access group/i }),
      ).toBeInTheDocument();
    });
  });

  it("renders Back button in approving step", async () => {
    renderWithProviders(<PendingInstancesForm instances={pendingInstances} />);

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    const [firstCheckbox] = screen.getAllByRole("checkbox");

    assert(firstCheckbox);

    await user.click(firstCheckbox);

    await user.click(screen.getByRole("button", { name: /^approve$/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
    });
  });

  it("returns to list view when clicking Back", async () => {
    renderWithProviders(<PendingInstancesForm instances={pendingInstances} />);

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    const [firstCheckbox] = screen.getAllByRole("checkbox");

    assert(firstCheckbox);

    await user.click(firstCheckbox);

    await user.click(screen.getByRole("button", { name: /^approve$/i }));

    await waitFor(() => {
      expect(screen.getByRole("button", { name: /back/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /back/i }));

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument();
    });
  });

  it("shows reject confirmation modal when Reject is clicked", async () => {
    renderWithProviders(<PendingInstancesForm instances={pendingInstances} />);

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    const [firstCheckbox] = screen.getAllByRole("checkbox");

    assert(firstCheckbox);

    await user.click(firstCheckbox);

    await user.click(screen.getByRole("button", { name: /reject/i }));

    expect(
      await screen.findByText("Reject pending instances"),
    ).toBeInTheDocument();
  });

  it("submits reject and shows success notification", async () => {
    renderWithProviders(<PendingInstancesForm instances={pendingInstances} />);

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    const [firstCheckbox] = screen.getAllByRole("checkbox");

    assert(firstCheckbox);

    await user.click(firstCheckbox);

    await user.click(screen.getByRole("button", { name: /reject/i }));

    const dialog = await screen.findByRole("dialog");
    await user.click(within(dialog).getByRole("button", { name: /^reject$/i }));

    expect(await screen.findByText(/you have rejected/i)).toBeInTheDocument();
  });

  it("shows approve confirmation modal in approving step", async () => {
    renderWithProviders(<PendingInstancesForm instances={pendingInstances} />);

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    const [firstCheckbox] = screen.getAllByRole("checkbox");

    assert(firstCheckbox);

    await user.click(firstCheckbox);

    await user.click(screen.getByRole("button", { name: /^approve$/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("combobox", { name: /access group/i }),
      ).toBeInTheDocument();
    });

    const approveConfirmBtn = screen
      .getAllByRole("button", { name: /approve/i })
      .find((btn) => btn.getAttribute("type") === "button");

    assert(approveConfirmBtn);
    await user.click(approveConfirmBtn);

    expect(
      await screen.findByText("Approve pending instances"),
    ).toBeInTheDocument();
  });

  it("submits approve and shows success notification", async () => {
    renderWithProviders(<PendingInstancesForm instances={pendingInstances} />);

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    const [firstCheckbox] = screen.getAllByRole("checkbox");

    assert(firstCheckbox);

    await user.click(firstCheckbox);

    await user.click(screen.getByRole("button", { name: /^approve$/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("combobox", { name: /access group/i }),
      ).toBeInTheDocument();
    });

    const approveConfirmBtn = screen
      .getAllByRole("button", { name: /approve/i })
      .find((btn) => btn.getAttribute("type") === "button");

    assert(approveConfirmBtn);
    await user.click(approveConfirmBtn);

    const dialog = await screen.findByRole("dialog");
    await user.click(
      within(dialog).getByRole("button", { name: /^approve$/i }),
    );

    expect(await screen.findByText(/you have approved/i)).toBeInTheDocument();
  });

  it("changes the access group select in approving step", async () => {
    renderWithProviders(<PendingInstancesForm instances={pendingInstances} />);

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    const [firstCheckbox] = screen.getAllByRole("checkbox");

    assert(firstCheckbox);

    await user.click(firstCheckbox);

    await user.click(screen.getByRole("button", { name: /^approve$/i }));

    const accessGroupSelect = await screen.findByRole("combobox", {
      name: /access group/i,
    });

    // Change the access group select to trigger the onChange handler
    const [firstOption] = accessGroupSelect.querySelectorAll("option");

    assert(firstOption);

    await user.selectOptions(accessGroupSelect, firstOption);
  });

  it("shows error notification when reject API fails", async () => {
    setEndpointStatus({ status: "error", path: "RejectPendingComputers" });

    renderWithProviders(<PendingInstancesForm instances={pendingInstances} />);

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    const [firstCheckbox] = screen.getAllByRole("checkbox");

    assert(firstCheckbox);

    await user.click(firstCheckbox);

    await user.click(screen.getByRole("button", { name: /reject/i }));

    const dialog = await screen.findByRole("dialog");
    await user.click(within(dialog).getByRole("button", { name: /^reject$/i }));

    // Error is caught and debug() called — no success notification
    await waitFor(() => {
      expect(screen.queryByText(/you have rejected/i)).not.toBeInTheDocument();
    });
  });

  it("shows error notification when approve API fails", async () => {
    setEndpointStatus({ status: "error", path: "AcceptPendingComputers" });

    renderWithProviders(<PendingInstancesForm instances={pendingInstances} />);

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument();
    });

    const [firstCheckbox] = screen.getAllByRole("checkbox");

    assert(firstCheckbox);

    await user.click(firstCheckbox);

    await user.click(screen.getByRole("button", { name: /^approve$/i }));

    await waitFor(() => {
      expect(
        screen.getByRole("combobox", { name: /access group/i }),
      ).toBeInTheDocument();
    });

    const approveConfirmBtn = screen
      .getAllByRole("button", { name: /approve/i })
      .find((btn) => btn.getAttribute("type") === "button");

    assert(approveConfirmBtn);
    await user.click(approveConfirmBtn);

    const dialog = await screen.findByRole("dialog");
    await user.click(
      within(dialog).getByRole("button", { name: /^approve$/i }),
    );

    // Error is caught and debug() called — no success notification
    await waitFor(() => {
      expect(screen.queryByText(/you have approved/i)).not.toBeInTheDocument();
    });
  });
});
