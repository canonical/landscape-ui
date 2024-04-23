import { STATUSES } from "@/pages/dashboard/instances/InstanceStatusLabel/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import AlertCard from "./AlertCard";

const alert = STATUSES["Online"];
const props = {
  alertQueryData: {
    label: alert.label,
    filterValue: alert.filterValue,
    icon: alert.icon,
  },
};

describe("AlertCard", () => {
  it("renders AlertCard", async () => {
    renderWithProviders(<AlertCard {...props} />);
    const alertLabel = screen.getByText(props.alertQueryData.label);
    expect(alertLabel).toBeInTheDocument();
  });

  it("AlertCard error", async () => {
    setEndpointStatus("error");
    renderWithProviders(<AlertCard {...props} />);

    const alertLabel = screen.getByText(props.alertQueryData.label);
    expect(alertLabel).toBeInTheDocument();

    await expectLoadingState();

    const error = screen.getByText(/error loading data./i);
    expect(error).toBeInTheDocument();
  });
});
