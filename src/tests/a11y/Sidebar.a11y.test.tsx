import Sidebar from "@/templates/dashboard/Sidebar";
import { renderWithProviders } from "@/tests/render";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";

describe("Sidebar a11y", () => {
  it("has no detectable axe violations in its default collapsed state", async () => {
    const { container } = renderWithProviders(<Sidebar />);

    expect(await axe(container)).toHaveNoViolations();
  });
});
