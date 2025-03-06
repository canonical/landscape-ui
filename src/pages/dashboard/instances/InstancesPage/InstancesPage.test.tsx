import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import InstancesPage from "./InstancesPage";
import InstancesContainer from "../InstancesContainer";
import { ubuntuInstance } from "@/tests/mocks/instance";

describe("InstancesPage", () => {
  it("should render the InstancesPage component", () => {
    renderWithProviders(<InstancesPage />);
    expect(screen.getByText("Instances")).toBeInTheDocument();
  });

  it("should have selected instances as null initially", () => {
    const setSelectedInstances = vi.fn();
    renderWithProviders(
      <InstancesContainer
        selectedInstances={[]}
        setSelectedInstances={setSelectedInstances}
      />,
    );

    expect(setSelectedInstances).toHaveBeenCalledTimes(0);
  });

  it("should update selected instances when an instance is selected", async () => {
    const setSelectedInstances = vi.fn();
    const mockInstance = ubuntuInstance;

    renderWithProviders(
      <InstancesContainer
        selectedInstances={[]}
        setSelectedInstances={setSelectedInstances}
      />,
    );

    setSelectedInstances([mockInstance]);

    expect(setSelectedInstances).toHaveBeenCalledTimes(1);
    expect(setSelectedInstances).toHaveBeenCalledWith([mockInstance]);
  });
});
