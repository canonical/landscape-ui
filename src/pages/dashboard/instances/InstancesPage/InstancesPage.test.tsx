import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import InstancesPage from "./InstancesPage";

const useGetInstances = vi.hoisted(() => vi.fn());
const instancesContainerSpy = vi.hoisted(() => vi.fn());

vi.mock("@/features/instances", async (importOriginal) => ({
  ...(await importOriginal()),
  useGetInstances,
  InstancesPageActions: () => <div data-testid="instances-page-actions" />,
}));

vi.mock("../InstancesContainer", () => ({
  default: (props: unknown) => {
    instancesContainerSpy(props);
    return <div data-testid="instances-container" />;
  },
}));

describe("InstancesPage", () => {
  beforeEach(() => {
    useGetInstances.mockReturnValue({
      instances: [],
      instancesCount: 0,
      isGettingInstances: false,
    });
    instancesContainerSpy.mockClear();
  });

  it("renders heading and container", () => {
    renderWithProviders(<InstancesPage />);

    expect(
      screen.getByRole("heading", { name: "Instances" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("instances-page-actions")).toBeInTheDocument();
    expect(screen.getByTestId("instances-container")).toBeInTheDocument();
  });

  it("passes count and loading state to InstancesContainer", () => {
    useGetInstances.mockReturnValue({
      instances: [],
      instancesCount: undefined,
      isGettingInstances: true,
    });

    renderWithProviders(<InstancesPage />);

    expect(instancesContainerSpy).toHaveBeenCalledTimes(1);

    const firstCallFirstArg = instancesContainerSpy.mock.calls[0]?.[0] as
      | {
          instanceCount: number | undefined;
          isGettingInstances: boolean;
        }
      | undefined;

    expect(firstCallFirstArg?.instanceCount).toBeUndefined();
    expect(firstCallFirstArg?.isGettingInstances).toBe(true);
  });
});
