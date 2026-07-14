import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import InstancesPage from "./InstancesPage";

describe("InstancesPage", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("renders instances page content with list data", async () => {
    renderWithProviders(<InstancesPage />);

    await expectLoadingState();

    expect(
      screen.getByRole("heading", { name: "Instances" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.queryByText("No instances found")).not.toBeInTheDocument();
  });

  it("shows empty state when instances endpoint is empty", async () => {
    setEndpointStatus({ status: "empty", path: "computers" });

    renderWithProviders(<InstancesPage />);

    await expectLoadingState();

    expect(screen.getByText("No instances found")).toBeInTheDocument();
    expect(
      screen.getByText(
        "You don't have any instances registered to Landscape yet.",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});
