import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import InstancesPage from "./InstancesPage";

describe("InstancesPage", () => {
  it("should render the InstancesPage component", () => {
    renderWithProviders(<InstancesPage />);
    expect(screen.getByText("Instances")).toBeInTheDocument();
  });
});
