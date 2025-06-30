import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { useFormik } from "formik";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import PackageProfileConstraintsEditFormTableActions from "./PackageProfileConstraintsEditFormTableActions";
import { INITIAL_VALUES } from "../PackageProfileConstraintsEditForm/constants";
import type { Constraint } from "../../types";

const [packageProfileConstraint] = packageProfiles[0].constraints;

const constraint: Constraint = {
  ...packageProfileConstraint,
  notAnyVersion: false,
};

describe("PackageProfileConstraintsEditFormTableActions", () => {
  const user = userEvent.setup();
  const formikHandleSubmit = vi.fn();
  const formikResetForm = vi.fn();

  const Wrapper = ({
    inEditMode = false,
  }: {
    readonly inEditMode?: boolean;
  }) => {
    const formik = useFormik({
      initialValues: inEditMode ? constraint : INITIAL_VALUES,
      onSubmit: formikHandleSubmit,
      onReset: formikResetForm,
    });

    return (
      <PackageProfileConstraintsEditFormTableActions
        constraint={constraint}
        formik={formik}
      />
    );
  };

  it("should show an edit button by default", () => {
    renderWithProviders(<Wrapper />);
    expect(
      screen.getByRole("button", {
        name: `Edit ${constraint.package} constraint`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Save changes" }),
    ).not.toBeInTheDocument();
  });

  it("should show save and cancel buttons when in edit mode", () => {
    renderWithProviders(<Wrapper inEditMode />);
    expect(
      screen.getByRole("button", {
        name: `Save changes for ${constraint.package} constraint`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: `Cancel editing ${constraint.package} constraint`,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", {
        name: `Edit ${constraint.package} constraint`,
      }),
    ).not.toBeInTheDocument();
  });

  it("should call handleSubmit on save click", async () => {
    renderWithProviders(<Wrapper inEditMode />);

    const saveButton = screen.getByRole("button", {
      name: `Save changes for ${constraint.package} constraint`,
    });
    await user.click(saveButton);

    expect(formikHandleSubmit).toHaveBeenCalled();
  });

  it("should call handleReset on cancel click", async () => {
    renderWithProviders(<Wrapper inEditMode />);

    const cancelButton = screen.getByRole("button", {
      name: `Cancel editing ${constraint.package} constraint`,
    });
    await user.click(cancelButton);

    expect(formikResetForm).toHaveBeenCalled();
  });
});
