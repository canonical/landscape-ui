import { DEFAULT_MODAL_PAGE_SIZE } from "@/constants";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import type { InstanceModalRow } from "../../types";
import DistributionUpgradesViewInstancesModal from "./DistributionUpgradesViewInstancesModal";

const cannotBeUpgradedInstances: InstanceModalRow[] = Array.from(
  { length: DEFAULT_MODAL_PAGE_SIZE + 1 },
  (_, index) => ({
    instanceId: index + 1,
    instanceTitle: `instance-${index + 1}`,
    currentDistribution: "Ubuntu 22.04 LTS",
    targetDistribution: "Unavailable",
    reason: "No upgrade target",
  }),
);

const canBeUpgradedInstances: InstanceModalRow[] = Array.from(
  { length: DEFAULT_MODAL_PAGE_SIZE + 1 },
  (_, index) => ({
    instanceId: index + 1,
    instanceTitle: `instance-${index + 1}`,
    currentDistribution: "Ubuntu 22.04 LTS",
    targetDistribution: "Ubuntu 24.04 LTS",
    reason: "",
  }),
);

const nonPaginatedInstances: InstanceModalRow[] = Array.from(
  { length: DEFAULT_MODAL_PAGE_SIZE - 1 },
  (_, index) => ({
    instanceId: index + 1,
    instanceTitle: `instance-${index + 1}`,
    currentDistribution: "Ubuntu 22.04 LTS",
    targetDistribution: "Unavailable",
    reason: "No upgrade target",
  }),
);

const props = {
  category: {
    title: "Cannot be upgraded",
    instances: cannotBeUpgradedInstances,
    isIneligibleCategory: true,
  },
  onClose: vi.fn(),
} satisfies ComponentProps<typeof DistributionUpgradesViewInstancesModal>;

describe("DistributionUpgradesViewInstancesModal", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders reason column for ineligible category", () => {
    renderWithProviders(<DistributionUpgradesViewInstancesModal {...props} />);

    expect(
      screen.getByRole("heading", { name: /cannot be upgraded/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /reason/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", { name: /target distribution/i }),
    ).not.toBeInTheDocument();
  });

  it("renders target distribution column for eligible category", () => {
    renderWithProviders(
      <DistributionUpgradesViewInstancesModal
        {...props}
        category={{
          ...props.category,
          isIneligibleCategory: false,
          instances: canBeUpgradedInstances,
        }}
      />,
    );

    expect(
      screen.getByRole("columnheader", { name: /target distribution/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", { name: /reason/i }),
    ).not.toBeInTheDocument();
  });

  it("shows pagination controls only when there are multiple modal pages", () => {
    renderWithProviders(
      <DistributionUpgradesViewInstancesModal
        {...props}
        category={{
          ...props.category,
          instances: nonPaginatedInstances,
        }}
      />,
    );

    expect(
      screen.queryByRole("button", { name: /next page/i }),
    ).not.toBeInTheDocument();
  });

  it("paginates modal rows", async () => {
    renderWithProviders(
      <DistributionUpgradesViewInstancesModal
        {...props}
        category={{
          ...props.category,
          instances: canBeUpgradedInstances,
        }}
      />,
    );

    expect(screen.getByText("instance-1")).toBeInTheDocument();
    expect(screen.queryByText("instance-11")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /next page/i }));

    expect(screen.getByText("instance-11")).toBeInTheDocument();
  });
});
