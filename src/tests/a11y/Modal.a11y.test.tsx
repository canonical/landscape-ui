import { Modal } from "@canonical/react-components";
import { renderWithProviders } from "@/tests/render";
import { axe } from "vitest-axe";
import { describe, expect, it } from "vitest";

describe("Modal a11y", () => {
  it("has no detectable axe violations in its open state", async () => {
    const { container } = renderWithProviders(
      <Modal close={() => undefined} title="Confirm action">
        <p>Are you sure you want to proceed?</p>
        <button type="button">Cancel</button>
        <button type="button">Confirm</button>
      </Modal>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
