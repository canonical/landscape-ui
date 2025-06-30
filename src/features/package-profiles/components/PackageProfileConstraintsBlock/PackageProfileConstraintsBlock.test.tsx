import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Formik } from "formik";
import PackageProfileConstraintsBlock from "./PackageProfileConstraintsBlock";
import { EMPTY_CONSTRAINT } from "../../constants";

describe("PackageProfileConstraintsBlock", () => {
  const user = userEvent.setup();

  it("should render correctly and allow adding/removing constraints", async () => {
    const onSubmit = vi.fn();
    const Wrapper = () => (
      <Formik
        initialValues={{ constraints: [EMPTY_CONSTRAINT] }}
        onSubmit={onSubmit}
      >
        {(formik) => <PackageProfileConstraintsBlock formik={formik} />}
      </Formik>
    );

    renderWithProviders(<Wrapper />);

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Package name")).toBeInTheDocument();

    const addConstraintButton = screen.getByRole("button", {
      name: "Add new constraint",
    });
    await user.click(addConstraintButton);
    expect(screen.getAllByPlaceholderText("Package name")).toHaveLength(2);

    const deleteButtons = screen.getAllByRole("button", {
      name: "Delete constraint row",
    });
    await user.click(deleteButtons[0]);
    expect(screen.getAllByPlaceholderText("Package name")).toHaveLength(1);
  });
});
