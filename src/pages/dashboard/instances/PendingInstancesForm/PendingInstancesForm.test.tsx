import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import PendingInstancesForm from "./PendingInstancesForm";
import useAuth from "@/hooks/useAuth";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import useInstances from "@/hooks/useInstances";
import userEvent from "@testing-library/user-event";
import { pendingInstances } from "@/tests/mocks/instance";

// Mock hooks
vi.mock("@/hooks/useAuth");
vi.mock("@/hooks/useNotify");
vi.mock("@/hooks/useSidePanel");
vi.mock("@/hooks/useInstances");

describe("PendingInstancesForm", () => {
  const mockInstances = pendingInstances;

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      user: {
        accounts: [{ name: "testAccount", title: "Test Account" }],
        current_account: "testAccount",
      },
    });

    (useNotify as jest.Mock).mockReturnValue({
      notify: {
        success: vi.fn(),
        error: vi.fn(),
        clear: vi.fn(),
      },
      sidePanel: {
        setOpen: vi.fn(), // Mock setOpen as part of sidePanel
      },
    });

    (useSidePanel as jest.Mock).mockReturnValue({
      closeSidePanel: vi.fn(),
      changeSidePanelSize: vi.fn(),
    });

    (useInstances as jest.Mock).mockReturnValue({
      acceptPendingInstancesQuery: { mutateAsync: vi.fn(), isPending: false },
      rejectPendingInstancesQuery: { mutateAsync: vi.fn(), isPending: false },
    });
  });

  it("renders without errors", () => {
    renderWithProviders(<PendingInstancesForm instances={mockInstances} />);
    expect(
      screen.getByText(
        /You can automatically register new Landscape Client Instances/i,
      ),
    ).toBeInTheDocument();
  });

  it("displays correct help text", () => {
    renderWithProviders(<PendingInstancesForm instances={mockInstances} />);
    expect(
      screen.getByText(
        /You can automatically register new Landscape Client Instances/i,
      ),
    ).toBeInTheDocument();
  });

  it("button click changes state to show access group selection", async () => {
    const user = userEvent.setup();
    renderWithProviders(<PendingInstancesForm instances={mockInstances} />);

    const approveButton = screen.getByRole("button", { name: /Approve/i });
    await user.click(approveButton);

    expect(screen.getByLabelText(/Access group/i)).toBeInTheDocument(); // Check if access group dropdown appears
  });
});
