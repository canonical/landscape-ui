import { windowsInstance } from "@/tests/mocks/instance";
import {
  compliantInstanceChild,
  noncompliantInstanceChild,
  uninstalledInstanceChild,
} from "@/tests/mocks/wsl";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect } from "vitest";
import WslInstanceListActions from "./WslInstanceListActions";

describe("WslInstanceListActions", () => {
  it("should allow you to install an uninstalled child", async () => {
    renderWithProviders(
      <WslInstanceListActions
        windowsInstance={windowsInstance}
        wslInstance={uninstalledInstanceChild}
      />,
    );

    await userEvent.click(
      screen.getByLabelText(
        `${uninstalledInstanceChild.name} instance actions`,
      ),
    );

    await userEvent.click(screen.getByText("Install"));

    expect(
      screen.getByText(
        `You have successfully queued ${uninstalledInstanceChild.name} to be installed.`,
      ),
    ).toBeInTheDocument();
  });

  it("should allow you to set a child as default", async () => {
    renderWithProviders(
      <WslInstanceListActions
        windowsInstance={windowsInstance}
        wslInstance={{ ...compliantInstanceChild, default: false }}
      />,
    );

    await userEvent.click(
      screen.getByLabelText(`${compliantInstanceChild.name} instance actions`),
    );
    await userEvent.click(screen.getByText("Set as default"));
    await userEvent.click(
      screen.getByRole("button", { name: "Set as default" }),
    );

    expect(
      screen.getByText(
        `You have successfully marked ${compliantInstanceChild.name} to be set as the default instance`,
      ),
    ).toBeInTheDocument();
  });

  it("should all you to remove a child from Landscape", async () => {
    renderWithProviders(
      <WslInstanceListActions
        windowsInstance={windowsInstance}
        wslInstance={compliantInstanceChild}
      />,
    );

    await userEvent.click(
      screen.getByLabelText(`${compliantInstanceChild.name} instance actions`),
    );
    await userEvent.click(screen.getByText("Remove from Landscape"));
    await userEvent.type(
      screen.getByRole("textbox"),
      `remove ${compliantInstanceChild.name}`,
    );
    await userEvent.click(screen.getByRole("button", { name: "Remove" }));

    expect(
      await screen.findByText(
        `You have successfully removed ${compliantInstanceChild.name} from Landscape.`,
      ),
    ).toBeInTheDocument();
  });

  it("should all you to reinstall a noncompliant child", async () => {
    renderWithProviders(
      <WslInstanceListActions
        windowsInstance={windowsInstance}
        wslInstance={noncompliantInstanceChild}
      />,
    );

    await userEvent.click(
      screen.getByLabelText(
        `${noncompliantInstanceChild.name} instance actions`,
      ),
    );
    await userEvent.click(screen.getByText("Reinstall"));
    await userEvent.type(
      screen.getByRole("textbox"),
      `reinstall ${noncompliantInstanceChild.name}`,
    );
    await userEvent.click(screen.getByRole("button", { name: "Reinstall" }));

    expect(
      await screen.findByText(
        `You have successfully marked ${noncompliantInstanceChild.name} to be reinstalled.`,
      ),
    ).toBeInTheDocument();
  });

  it("should all you to uninstall a child", async () => {
    renderWithProviders(
      <WslInstanceListActions
        windowsInstance={windowsInstance}
        wslInstance={compliantInstanceChild}
      />,
    );

    await userEvent.click(
      screen.getByLabelText(`${compliantInstanceChild.name} instance actions`),
    );
    await userEvent.click(screen.getByText("Uninstall"));
    await userEvent.type(
      screen.getByRole("textbox"),
      `uninstall ${compliantInstanceChild.name}`,
    );
    await userEvent.click(screen.getByRole("button", { name: "Uninstall" }));

    expect(
      await screen.findByText(
        `You have successfully marked ${compliantInstanceChild.name} to be uninstalled.`,
      ),
    ).toBeInTheDocument();
  });
});
