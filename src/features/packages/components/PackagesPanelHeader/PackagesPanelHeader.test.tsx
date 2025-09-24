import { renderWithProviders } from "@/tests/render";
import { describe, it } from "vitest";
import PackagesPanelHeader from "./PackagesPanelHeader";

describe("PackagesPanelHeader", () => {
  it("renders", () => {
    renderWithProviders(
      <PackagesPanelHeader
        handleClearSelection={vi.fn()}
        selectedPackages={[]}
      />,
    );
  });
});
