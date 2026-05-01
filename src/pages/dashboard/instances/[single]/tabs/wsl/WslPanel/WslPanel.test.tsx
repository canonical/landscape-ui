import { act, screen } from "@testing-library/react";
import { describe, expect, it, assert, afterEach, vi } from "vitest";
import { windowsInstance } from "@/tests/mocks/instance";
import { instanceChildren } from "@/tests/mocks/wsl";
import { renderWithProviders } from "@/tests/render";
import WslPanel from "./WslPanel";
import { expectLoadingState } from "@/tests/helpers";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { AppErrorBoundary } from "@/components/layout/AppErrorBoundary";

afterEach(() => {
  setEndpointStatus("default");
});

describe("WslPanel", () => {
  it("shows loading state initially", async () => {
    renderWithProviders(<WslPanel instance={windowsInstance} />);

    await expectLoadingState();
  });

  it("shows WSL instances list after loading", async () => {
    const [firstChild] = instanceChildren;
    assert(firstChild);

    renderWithProviders(<WslPanel instance={windowsInstance} />);

    expect(await screen.findByText(firstChild.name)).toBeInTheDocument();
  });

  it("shows empty state when there are no WSL children", async () => {
    setEndpointStatus({ status: "empty", path: "children" });

    renderWithProviders(<WslPanel instance={windowsInstance} />);

    expect(
      await screen.findByText("No WSL instances found"),
    ).toBeInTheDocument();
  });

  it("shows limit reached notification when at capacity", async () => {
    setEndpointStatus({
      status: "variant",
      path: "wsl-feature-limits",
      response: {
        max_windows_host_machines: 100,
        max_wsl_child_instance_profiles: 10,
        max_wsl_child_instances_per_host: 1,
      },
    });

    renderWithProviders(<WslPanel instance={windowsInstance} />);

    expect(await screen.findByText(/limit reached/i)).toBeInTheDocument();
  });

  it("shows error boundary when children endpoint fails", async () => {
    vi.spyOn(console, "error").mockReturnValue(undefined);
    setEndpointStatus({ status: "error", path: "children" });

    renderWithProviders(
      <AppErrorBoundary>
        <WslPanel instance={windowsInstance} />
      </AppErrorBoundary>,
    );

    expect(
      await screen.findByText(/unexpected error occurred/i),
    ).toBeInTheDocument();
  });

  it("shows loading state while wsl limits are being fetched", async () => {
    setEndpointStatus({ status: "loading", path: "wsl-feature-limits" });

    renderWithProviders(<WslPanel instance={windowsInstance} />);

    // Allow children to load (they respond normally) so the component transitions
    // past isLoadingWslInstances into the isGettingWslLimits branch.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
