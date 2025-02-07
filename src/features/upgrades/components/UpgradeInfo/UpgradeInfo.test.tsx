import {
  hasRegularUpgrades,
  hasSecurityUpgrades,
  hasUpgrades,
} from "@/features/instances";
import { instances } from "@/tests/mocks/instance";
import { render } from "@testing-library/react";
import UpgradeInfo from "./UpgradeInfo";

describe("UpgradeInfo", () => {
  it("should render upgrades info correctly", () => {
    const { container } = render(<UpgradeInfo instances={instances} />);

    expect(container).toHaveTexts([
      "You selected",
      `${instances.length}`,
      "instances:",
      "Security upgrades are available for",
      `${instances.filter(({ alerts }) => hasSecurityUpgrades(alerts)).length}`,
      "instances",
      "Regular upgrades are available for",
      `${instances.filter(({ alerts }) => hasRegularUpgrades(alerts)).length}`,
      "instances",
      "No upgrades for",
      `${instances.filter(({ alerts }) => !hasUpgrades(alerts)).length}`,
      "instances needed.",
    ]);
  });
});
