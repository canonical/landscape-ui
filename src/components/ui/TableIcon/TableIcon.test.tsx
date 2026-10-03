import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import TableIcon from "./TableIcon";

vi.mock("@/constants", () => ({ ROOT_PATH: "/portal/" }));

describe("TableIcon", () => {
  it("renders a decorative Pragma icon with label and severity classes", () => {
    render(
      <TableIcon icon="success" severity="positive" className="custom-icon">
        Ready
      </TableIcon>,
    );

    const wrapper = screen.getByText("Ready").parentElement;
    const icon = wrapper?.querySelector("svg");

    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(icon).toHaveClass("positive", "custom-icon");
    expect(icon?.querySelector("use")).toHaveAttribute(
      "href",
      "/portal/icons/success.svg#success",
    );
  });
});
