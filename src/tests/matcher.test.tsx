import { Button, Icon } from "@canonical/react-ds-global";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("toHaveIcon matcher", () => {
  it("matches legacy Vanilla icons", () => {
    render(
      <button type="button">
        <i className="p-icon--plus" />
        <span>Add</span>
      </button>,
    );

    expect(screen.getByRole("button", { name: "Add" })).toHaveIcon("plus");
    expect(screen.getByRole("button", { name: "Add" })).not.toHaveIcon(
      "delete",
    );
  });

  it("matches Pragma Button icon slots", () => {
    render(
      <Button type="button" icon="plus" anticipation="constructive">
        Add
      </Button>,
    );

    expect(screen.getByRole("button", { name: "Add" })).toHaveIcon("plus");
    expect(screen.getByRole("button", { name: "Add" })).not.toHaveIcon(
      "delete",
    );
  });

  it("matches standalone Pragma Icon elements", () => {
    render(<Icon icon="information" aria-label="Info" />);

    expect(screen.getByRole("img", { name: "Info" })).toHaveIcon("information");
    expect(screen.getByRole("img", { name: "Info" })).not.toHaveIcon("warning");
  });
});
