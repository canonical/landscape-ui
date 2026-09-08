import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import InstancesWithoutVersionCount from "./InstancesWithoutVersionCount";

describe("InstancesWithoutVersionCount", () => {
  it("renders with count > 1", () => {
    renderWithProviders(
      <InstancesWithoutVersionCount count={10} type="installed" />,
    );

    screen.getByText(/10 instances don't have this package installed/i);
  });

  it("does not render with count == 0 ", () => {
    renderWithProviders(<InstancesWithoutVersionCount count={0} type="held" />);

    expect(
      screen.queryByText(/don't have this package/i),
    ).not.toBeInTheDocument();
  });
});
