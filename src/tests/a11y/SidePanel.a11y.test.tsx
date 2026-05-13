import SidePanel from "@/components/layout/SidePanel";
import { renderWithProviders } from "@/tests/render";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";

describe("SidePanel a11y", () => {
  it("has no detectable axe violations when open with content", async () => {
    const { container } = renderWithProviders(
      <SidePanel onClose={() => undefined}>
        <SidePanel.Header>
          <h2>Edit instance</h2>
        </SidePanel.Header>
        <SidePanel.Content>
          <p>Update the configuration below and save your changes.</p>
          <button type="button">Save</button>
        </SidePanel.Content>
      </SidePanel>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
