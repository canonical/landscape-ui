import { ubuntuCoreInstance, ubuntuInstance } from "@/tests/mocks/instance";
import type { Instance } from "@/types/Instance";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import InstanceStatus from "./InstanceStatus";
import InstanceUpgrades from "./InstanceUpgrades";
import Tags from "./Tags";

const multiAlertInstance = {
  ...ubuntuInstance,
  archived: false,
  alerts: [
    {
      type: "PackageReporterAlert",
      summary: "Reporter failed",
      severity: "danger",
    },
    { type: "ComputerOfflineAlert", summary: "Offline", severity: "danger" },
    {
      type: "PackageProfilesAlert",
      summary: "Profile alert",
      severity: "warning",
    },
  ],
} as Instance;

const ExpandableHarness = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <InstanceStatus
      instance={multiAlertInstance}
      expandable
      isExpanded={expanded}
      onExpand={() => {
        setExpanded(true);
      }}
    />
  );
};

describe("InstanceStatus", () => {
  it("shows every status with a label in full mode", () => {
    renderWithProviders(<InstanceStatus instance={multiAlertInstance} />);

    expect(screen.getByText("Reporter failed")).toBeInTheDocument();
    expect(screen.getByText("Offline")).toBeInTheDocument();
    expect(screen.getByText("Profile alert")).toBeInTheDocument();
  });

  it("keeps red statuses visible and collapses the rest behind a counter", () => {
    renderWithProviders(
      <InstanceStatus instance={multiAlertInstance} expandable />,
    );

    expect(screen.getByText("Reporter failed")).toBeInTheDocument();
    expect(screen.getByText("Offline")).toBeInTheDocument();
    expect(screen.queryByText("Profile alert")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Show 1 more status" }),
    ).toBeInTheDocument();
  });

  it("reveals the collapsed statuses when expanded", async () => {
    renderWithProviders(<ExpandableHarness />);

    await userEvent.click(
      screen.getByRole("button", { name: "Show 1 more status" }),
    );

    expect(screen.getByText("Profile alert")).toBeInTheDocument();
  });

  it("renders a single online status without a counter", () => {
    renderWithProviders(
      <InstanceStatus
        instance={{ ...ubuntuInstance, archived: false, alerts: [] }}
        expandable
      />,
    );

    expect(screen.getByText("Online")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});

describe("InstanceUpgrades", () => {
  it("shows a labelled 'Up to date' pill instead of a colour-only dot", () => {
    renderWithProviders(
      <InstanceUpgrades
        instance={
          {
            ...ubuntuInstance,
            alerts: [],
            upgrades: { regular: 0, security: 0 },
          } as Instance
        }
      />,
    );

    expect(screen.getByText("Up to date")).toBeInTheDocument();
  });

  it("renders a neutral N/A pill when the instance has no packages feature", () => {
    renderWithProviders(<InstanceUpgrades instance={ubuntuCoreInstance} />);

    expect(screen.getByText("N/A")).toBeInTheDocument();
  });
});

describe("Tags", () => {
  it("renders static (non-interactive) pills without a click handler", () => {
    renderWithProviders(<Tags tags={["bionic", "server"]} />);

    expect(screen.getByText("bionic")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders clickable tags and reports the clicked tag", async () => {
    const onTagClick = vi.fn();
    renderWithProviders(
      <Tags tags={["bionic", "server"]} onTagClick={onTagClick} />,
    );

    await userEvent.click(screen.getByRole("button", { name: "bionic" }));

    expect(onTagClick).toHaveBeenCalledWith("bionic");
  });

  it("announces the expander with tag wording, not status", () => {
    renderWithProviders(
      <Tags tags={["bionic", "server", "edge"]} expandable />,
    );

    expect(
      screen.getByRole("button", { name: "Show 2 more tags" }),
    ).toBeInTheDocument();
  });
});
