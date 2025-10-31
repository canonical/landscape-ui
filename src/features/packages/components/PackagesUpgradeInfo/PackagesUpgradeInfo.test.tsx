import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PackagesUpgradeInfo from "./PackagesUpgradeInfo";
import type { ComponentProps } from "react";

type PackagesUpgradeInfoProps = ComponentProps<typeof PackagesUpgradeInfo>;

describe("PackagesUpgradeInfo", () => {
  it("displays security upgrade count when security upgrades are available", () => {
    const props: PackagesUpgradeInfoProps = {
      packageCount: 10,
      securityUpgradePackageCount: 3,
      totalUpgradePackageCount: 5,
    };

    renderWithProviders(<PackagesUpgradeInfo {...props} />);

    const securityUpgradeText = screen.getByText(/security upgrades/i);
    expect(securityUpgradeText).toBeInTheDocument();
  });

  it("does not display security upgrades when none are available", () => {
    const props: PackagesUpgradeInfoProps = {
      packageCount: 5,
      securityUpgradePackageCount: 0,
      totalUpgradePackageCount: 2,
    };

    renderWithProviders(<PackagesUpgradeInfo {...props} />);

    expect(screen.queryByText(/security upgrade/i)).not.toBeInTheDocument();
  });

  it("displays regular upgrade count when regular upgrades are available", () => {
    const props: PackagesUpgradeInfoProps = {
      packageCount: 10,
      securityUpgradePackageCount: 2,
      totalUpgradePackageCount: 6,
    };

    renderWithProviders(<PackagesUpgradeInfo {...props} />);

    const regularUpgradeText = screen.getByText(/regular upgrades/i);
    expect(regularUpgradeText).toBeInTheDocument();
  });

  it("does not display regular upgrades when none are available", () => {
    const props: PackagesUpgradeInfoProps = {
      packageCount: 5,
      securityUpgradePackageCount: 3,
      totalUpgradePackageCount: 3,
    };

    renderWithProviders(<PackagesUpgradeInfo {...props} />);

    expect(screen.queryByText(/regular upgrade/i)).not.toBeInTheDocument();
  });
});

it("displays both security and regular upgrades when both are available", () => {
  const props: PackagesUpgradeInfoProps = {
    packageCount: 10,
    securityUpgradePackageCount: 3,
    totalUpgradePackageCount: 7,
  };

  renderWithProviders(<PackagesUpgradeInfo {...props} />);

  expect(screen.getByText(/security upgrades/i)).toBeInTheDocument();
  expect(screen.getByText(/regular upgrades/i)).toBeInTheDocument();
});
