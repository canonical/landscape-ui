import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import PackageDropdownSearchCount from "./PackageDropdownSearchCount";

describe("PackageDropdownSearchCount", () => {
  it("renders with count > 1", () => {
    renderWithProviders(<PackageDropdownSearchCount count={10} />);

    screen.getByText(/10 packages/i);
  });

  it("does not render with count == 0 ", () => {
    renderWithProviders(<PackageDropdownSearchCount count={0} />);

    expect(screen.queryByText(/packages/i)).not.toBeInTheDocument();
  });
});
