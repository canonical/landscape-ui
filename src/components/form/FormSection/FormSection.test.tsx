import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FormSection from "./FormSection";

describe("FormSection", () => {
  it("renders the title as a level-2 heading and exposes its children", () => {
    render(
      <FormSection title="Theme">
        <button type="button">System</button>
      </FormSection>,
    );

    expect(
      screen.getByRole("heading", { name: "Theme", level: 2 }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "System" })).toBeInTheDocument();
  });

  it("names the section region with its title for assistive tech", () => {
    render(
      <FormSection title="Account details">
        <span>content</span>
      </FormSection>,
    );

    // A <section> named via aria-labelledby is exposed as a "region", so it is
    // discoverable by its accessible name.
    expect(
      screen.getByRole("region", { name: "Account details" }),
    ).toBeInTheDocument();
  });

  it("merges an extra className onto the section", () => {
    const { container } = render(
      <FormSection title="Theme" className="custom-class">
        <span>x</span>
      </FormSection>,
    );

    expect(container.querySelector("section")).toHaveClass("custom-class");
  });
});
