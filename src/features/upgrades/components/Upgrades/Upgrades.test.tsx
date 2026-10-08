import { beforeEach, describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { instances } from "@/tests/mocks/instance";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectErrorNotification } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import Upgrades from "./Upgrades";

describe("Upgrades", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("should render tabs", async () => {
    renderWithProviders(<Upgrades selectedInstances={instances} />);

    expect(screen.getAllByRole("tab")).toHaveLength(3);
    expect(screen.getByRole("tab", { name: /instances/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: /packages/i })).toHaveAttribute(
      "aria-selected",
      "false",
    );
    expect(screen.getByRole("tab", { name: /usns/i })).toHaveAttribute(
      "aria-selected",
      "false",
    );
    expect(screen.getByRole("tabpanel")).toHaveAttribute(
      "aria-labelledby",
      "tab-link-instances",
    );
    expect(
      await screen.findByText(/Showing \d of \d+ instances/i),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("tab", { name: /packages/i }));

    expect(screen.getByRole("tab", { name: /packages/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toHaveAttribute(
      "aria-labelledby",
      "tab-link-packages",
    );
    expect(
      await screen.findByText(/Showing \d of \d+ packages/i),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByRole("tab", { name: /usns/i }));

    expect(screen.getByRole("tab", { name: /usns/i })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toHaveAttribute(
      "aria-labelledby",
      "tab-link-usns",
    );
    expect(
      await screen.findByText(/Showing \d of \d+ security issues/i),
    ).toBeInTheDocument();
  });

  it("submits package upgrades from default tab", async () => {
    const user = userEvent.setup();

    renderWithProviders(<Upgrades selectedInstances={instances} />);

    await user.click(screen.getByRole("button", { name: "Upgrade" }));

    expect(
      await screen.findByText("You queued packages to be upgraded"),
    ).toBeInTheDocument();
  });

  it("submits USN upgrades when USNs tab is selected", async () => {
    const user = userEvent.setup();

    renderWithProviders(<Upgrades selectedInstances={instances} />);

    await user.click(screen.getByRole("tab", { name: /usns/i }));
    await user.click(screen.getByRole("button", { name: "Upgrade" }));

    expect(
      await screen.findByText("You queued packages to be upgraded"),
    ).toBeInTheDocument();
  });

  it("renders only instances and packages tabs when no security upgrades exist", () => {
    const noSecurityUpgradeInstances = instances.map((instance) => ({
      ...instance,
      alerts: (instance.alerts ?? []).filter(
        ({ type }) => type !== "SecurityUpgradesAlert",
      ),
    }));

    renderWithProviders(
      <Upgrades selectedInstances={noSecurityUpgradeInstances} />,
    );

    expect(screen.getByRole("tab", { name: /instances/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /packages/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("tab", { name: /usns/i }),
    ).not.toBeInTheDocument();
  });

  it("shows singular success message when upgrading one instance", async () => {
    const user = userEvent.setup();
    const [singleInstance] = instances;
    assert(singleInstance);

    renderWithProviders(<Upgrades selectedInstances={[singleInstance]} />);

    await user.click(screen.getByRole("button", { name: "Upgrade" }));

    expect(
      await screen.findByText(/Packages on 1 instance will be upgraded/i),
    ).toBeInTheDocument();
  });

  it("handles package-upgrade submission errors", async () => {
    const user = userEvent.setup();

    renderWithProviders(<Upgrades selectedInstances={instances} />);

    setEndpointStatus("error");
    await user.click(screen.getByRole("button", { name: "Upgrade" }));

    await expectErrorNotification();
  });

  it("handles usn-upgrade submission errors", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Upgrades selectedInstances={instances} />);

    await user.click(screen.getByRole("tab", { name: /usns/i }));
    setEndpointStatus("error");
    await user.click(screen.getByRole("button", { name: "Upgrade" }));

    await expectErrorNotification();
  });

  it("updates excluded package list from packages tab interaction", async () => {
    const user = userEvent.setup();

    renderWithProviders(<Upgrades selectedInstances={instances} />);

    await user.click(screen.getByRole("tab", { name: /packages/i }));
    await user.click(
      screen.getByRole("checkbox", { name: /toggle all packages/i }),
    );
    await user.click(screen.getByRole("button", { name: "Upgrade" }));

    expect(
      await screen.findByText("You queued packages to be upgraded"),
    ).toBeInTheDocument();
  });

  it("updates excluded usn list from usns tab interaction", async () => {
    const user = userEvent.setup();

    renderWithProviders(<Upgrades selectedInstances={instances} />);

    await user.click(screen.getByRole("tab", { name: /usns/i }));
    await user.click(
      screen.getByRole("checkbox", { name: /toggle all security issues/i }),
    );
    await user.click(screen.getByRole("button", { name: "Upgrade" }));

    expect(
      await screen.findByText("You queued packages to be upgraded"),
    ).toBeInTheDocument();
  });
});
