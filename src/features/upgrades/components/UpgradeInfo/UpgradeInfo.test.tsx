import { render } from "@testing-library/react";
import { instances } from "@/tests/mocks/instance";
import UpgradeInfo from "./UpgradeInfo";

describe("UpgradeInfo", () => {
  it("should render upgrades info correctly", () => {
    const { container } = render(<UpgradeInfo instances={instances} />);

    expect(container).toHaveTexts([
      "You selected",
      `${instances.length}`,
      "instances:",
      "Security upgrades are available for",
      `${instances.filter(({ upgrades }) => upgrades?.security).length}`,
      "instances",
      "Regular upgrades are available for",
      `${instances.filter(({ upgrades }) => upgrades?.regular).length}`,
      "instances",
      "No upgrades for",
      `${instances.filter(({ upgrades }) => !upgrades?.security && !upgrades?.regular).length}`,
      "instances needed.",
    ]);
  });
});
