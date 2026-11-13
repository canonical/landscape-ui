import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { Constraint } from "../../types";
import PackageProfileConstraintsEditFormTableActions from "./PackageProfileConstraintsEditFormTableActions";

const constraint: Constraint = {
  id: 3,
  package: "nginx",
  constraint: "depends",
  rule: "",
  version: "",
  notAnyVersion: false,
};

describe("PackageProfileConstraintsEditFormTableActions", () => {
  it("starts editing when the edit action is clicked", async () => {
    const setValues = vi.fn();
    renderWithProviders(
      <PackageProfileConstraintsEditFormTableActions
        constraint={constraint}
        editingConstraintId={0}
        isSubmitting={false}
        onEdit={setValues}
        onCancel={vi.fn()}
        onSave={vi.fn()}
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Edit nginx constraint" }),
    );

    expect(setValues).toHaveBeenCalledWith(constraint);
  });

  it("shows save and cancel actions while editing the current row", async () => {
    const handleSubmit = vi.fn();
    const resetForm = vi.fn();
    renderWithProviders(
      <PackageProfileConstraintsEditFormTableActions
        constraint={constraint}
        editingConstraintId={constraint.id}
        isSubmitting={false}
        onEdit={vi.fn()}
        onCancel={resetForm}
        onSave={handleSubmit}
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Save changes to nginx constraint" }),
    );
    await userEvent.click(
      screen.getByRole("button", { name: "Cancel editing nginx constraint" }),
    );

    expect(handleSubmit).toHaveBeenCalled();
    expect(resetForm).toHaveBeenCalled();
  });
});
