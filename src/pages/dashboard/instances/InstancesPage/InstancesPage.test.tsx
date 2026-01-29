import { ubuntuInstance } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import InstancesContainer from "../InstancesContainer";
import InstancesPage from "./InstancesPage";

const props = {
  instances: [],
  instanceCount: 0,
  isGettingInstances: false,
  selectedInstances: [],
};

describe("InstancesPage", () => {
  it("should render the InstancesPage component", () => {
    renderWithProviders(<InstancesPage />);
    expect(screen.getByText("Instances")).toBeInTheDocument();
  });

  it("should have selected instances as null initially", () => {
    const setSelectedInstances = vi.fn();
    renderWithProviders(
      <InstancesContainer
        {...props}
        setToggledInstances={setSelectedInstances}
      />,
    );

    expect(setSelectedInstances).toHaveBeenCalledTimes(0);
  });

  it("should update selected instances when an instance is selected", async () => {
    const setSelectedInstances = vi.fn();
    const mockInstance = ubuntuInstance;

    renderWithProviders(
      <InstancesContainer
        {...props}
        setToggledInstances={setSelectedInstances}
      />,
    );

    setSelectedInstances([mockInstance]);

    expect(setSelectedInstances).toHaveBeenCalledTimes(1);
    expect(setSelectedInstances).toHaveBeenCalledWith([mockInstance]);
  });
});
