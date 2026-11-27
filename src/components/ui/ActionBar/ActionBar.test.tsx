import { Button } from "@canonical/react-ds-global";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ActionBar from "./ActionBar";
import classes from "./ActionBar.module.scss";

describe("ActionBar", () => {
  it("renders child actions inside the actionBar container", () => {
    render(
      <ActionBar data-testid="action-bar">
        <Button type="button" importance="secondary">
          Edit
        </Button>
        <Button type="button" importance="secondary" icon="delete">
          Remove
        </Button>
      </ActionBar>,
    );

    const container = screen.getByTestId("action-bar");
    expect(container).toHaveClass(classes.actionBar);
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove" })).toBeInTheDocument();
  });

  it("merges custom className and forwards HTML div attributes", () => {
    render(
      <ActionBar className="custom-bar" role="toolbar" aria-label="Actions">
        <Button type="button" importance="secondary">
          Sync
        </Button>
      </ActionBar>,
    );

    const toolbar = screen.getByRole("toolbar", { name: "Actions" });
    expect(toolbar).toHaveClass(classes.actionBar, "custom-bar");
  });
});
