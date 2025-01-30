import type { ComponentProps } from "react";
import { describe, vi } from "vitest";
import { screen } from "@testing-library/react";
import { expectLoadingState } from "@/tests/helpers";
import { instances } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import PackagesPanel from "./PackagesPanel";

const excludedPackages = instances.map(({ id }) => ({
  id,
  exclude_packages: [],
}));
const onExcludedPackagesChange = vi.fn();

const props: ComponentProps<typeof PackagesPanel> = {
  excludedPackages,
  instances,
  onExcludedPackagesChange,
};

describe("PackagesPanel", () => {
  it("should render packages panel", async () => {
    const { container } = renderWithProviders(<PackagesPanel {...props} />);

    await expectLoadingState();

    expect(container).toHaveTexts(["Package name", "Affected instances"]);

    expect(screen.getByText(/Showing \d of \d+ packages/i)).toBeInTheDocument();
  });
});
