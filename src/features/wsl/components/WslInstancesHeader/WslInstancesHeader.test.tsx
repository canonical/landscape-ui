import { screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { renderWithProviders } from "@/tests/render";
import WslInstancesHeader from "./WslInstancesHeader";
import { instanceChildren } from "@/tests/mocks/wsl";
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
});
