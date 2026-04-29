import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ViewUpgradeProfileDetailsBlock from "./ViewUpgradeProfileDetailsBlock";
import { upgradeProfiles } from "@/tests/mocks/upgrade-profiles";

describe("ViewUpgradeProfileDetailsBlock", () => {
  it("renders upgrade type and autoremove state", () => {
    renderWithProviders(
      <ViewUpgradeProfileDetailsBlock profile={upgradeProfiles[0]} />,
    );

    expect(screen.getByText("Upgrade type")).toBeInTheDocument();
    expect(screen.getByText("Security upgrades")).toBeInTheDocument();
    expect(screen.getByText("Auto remove packages")).toBeInTheDocument();
    expect(screen.getByText("On")).toBeInTheDocument();
  });

  it("renders upgrade type all and autoremove state off", () => {
    renderWithProviders(
      <ViewUpgradeProfileDetailsBlock profile={upgradeProfiles[1]} />,
    );

    expect(screen.getByText("All upgrades")).toBeInTheDocument();
    expect(screen.getByText("Off")).toBeInTheDocument();
  });
});
