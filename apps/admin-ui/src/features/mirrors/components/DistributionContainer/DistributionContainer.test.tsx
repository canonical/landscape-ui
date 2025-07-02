import { renderWithProviders } from "@/tests/render";
import type { ComponentProps } from "react";
import { vi } from "vitest";
import DistributionContainer from "./DistributionContainer";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { screen } from "@testing-library/react";
import { distributions } from "@/tests/mocks/distributions";

const props: ComponentProps<typeof DistributionContainer> = {
  onDistributionsLengthChange: vi.fn(),
};

describe("DistributionContainer", () => {
  it("renders empty state", async () => {
    setEndpointStatus("empty");

    renderWithProviders(<DistributionContainer {...props} />);

    await expectLoadingState();
    expect(screen.getByText("No mirrors have been added yet.")).toBeVisible();
    expect(
      screen.getByRole("button", { name: /add distribution/i }),
    ).toBeVisible();
  });

  it("renders distributions", async () => {
    renderWithProviders(<DistributionContainer {...props} />);

    await expectLoadingState();

    for (const distribution of distributions) {
      expect(screen.getByText(distribution.name)).toBeVisible();
    }
  });
});
