import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import userEvent from "@testing-library/user-event";
import { PATHS, ROUTES } from "@/libs/routes";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import WslInstancesHeader from "./WslInstancesHeader";
import {
  instanceChildren,
  noncompliantInstanceChild,
  uninstalledInstanceChild,
} from "@/tests/mocks/wsl";
import { windowsInstance } from "@/tests/mocks/instance";

describe("WslInstancesHeader", () => {
  it("renders the search box", () => {
    renderWithProviders(
      <WslInstancesHeader
        windowsInstance={windowsInstance}
        selectedWslInstances={[]}
        wslInstances={instanceChildren}
      />,
    );

    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("renders the 'Uninstall' action button", () => {
    renderWithProviders(
      <WslInstancesHeader
        windowsInstance={windowsInstance}
        selectedWslInstances={[]}
        wslInstances={instanceChildren}
      />,
    );

    expect(
      screen.getByRole("button", { name: /uninstall/i }),
    ).toBeInTheDocument();
  });

  it("renders the 'Create new instance' action button", () => {
    renderWithProviders(
      <WslInstancesHeader
        windowsInstance={windowsInstance}
        selectedWslInstances={[]}
        wslInstances={instanceChildren}
      />,
    );

    expect(
      screen.getByRole("button", { name: /create new instance/i }),
    ).toBeInTheDocument();
  });

  it("renders 'Install' and 'Reinstall' buttons when instances have profiles", () => {
    renderWithProviders(
      <WslInstancesHeader
        windowsInstance={windowsInstance}
        selectedWslInstances={[]}
        wslInstances={instanceChildren}
      />,
    );

    const installButtons = screen.getAllByRole("button", { name: /install/i });
    expect(installButtons.length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByRole("button", { name: /reinstall/i }),
    ).toBeInTheDocument();
  });

  it("disables install action when selected instance is not uninstalled", () => {
    renderWithProviders(
      <WslInstancesHeader
        windowsInstance={windowsInstance}
        selectedWslInstances={[instanceChildren[0]]}
        wslInstances={instanceChildren}
      />,
    );

    expect(screen.getByRole("button", { name: /^install$/i })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("disables uninstall action when selected instance is already not installed", () => {
    renderWithProviders(
      <WslInstancesHeader
        windowsInstance={windowsInstance}
        selectedWslInstances={[instanceChildren[1]]}
        wslInstances={instanceChildren}
      />,
    );

    expect(
      screen.getByRole("button", { name: /^uninstall$/i }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("opens create new instance side panel", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <WslInstancesHeader
        windowsInstance={windowsInstance}
        selectedWslInstances={[]}
        wslInstances={instanceChildren}
      />,
      undefined,
      ROUTES.instances.details.single(windowsInstance.id),
      `/${PATHS.instances.root}/${PATHS.instances.single}`,
    );

    await user.click(
      screen.getByRole("button", { name: /create new instance/i }),
    );

    expect(
      await screen.findByRole("heading", { name: "Create new WSL instance" }),
    ).toBeInTheDocument();
  });

  it("opens reinstall modal for a noncompliant selection", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <WslInstancesHeader
        windowsInstance={windowsInstance}
        selectedWslInstances={[noncompliantInstanceChild]}
        wslInstances={instanceChildren}
      />,
      undefined,
      ROUTES.instances.details.single(windowsInstance.id),
      `/${PATHS.instances.root}/${PATHS.instances.single}`,
    );

    await user.click(screen.getByRole("button", { name: /^reinstall$/i }));

    expect(
      screen.getByRole("heading", {
        name: `Reinstall ${noncompliantInstanceChild.name}`,
      }),
    ).toBeInTheDocument();
  });

  it("submits install for selected uninstalled instances", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <WslInstancesHeader
        windowsInstance={windowsInstance}
        selectedWslInstances={[uninstalledInstanceChild]}
        wslInstances={instanceChildren}
      />,
      undefined,
      ROUTES.instances.details.single(windowsInstance.id),
      `/${PATHS.instances.root}/${PATHS.instances.single}`,
    );

    await user.click(screen.getByRole("button", { name: /^install$/i }));

    expect(
      await screen.findByText(
        /successfully queued "WSL instance associated with profile, not installed, installation in progress" to be installed/i,
      ),
    ).toBeInTheDocument();
  });

  it("shows endpoint error when install request fails", async () => {
    const user = userEvent.setup();
    setEndpointStatus({
      status: "error",
      path: "child-instance-profiles/:name:reapply",
    });

    renderWithProviders(
      <WslInstancesHeader
        windowsInstance={windowsInstance}
        selectedWslInstances={[uninstalledInstanceChild]}
        wslInstances={instanceChildren}
      />,
      undefined,
      ROUTES.instances.details.single(windowsInstance.id),
      `/${PATHS.instances.root}/${PATHS.instances.single}`,
    );

    await user.click(screen.getByRole("button", { name: /^install$/i }));

    expect(
      await screen.findByText('The endpoint status is set to "error".'),
    ).toBeInTheDocument();
  });
});
