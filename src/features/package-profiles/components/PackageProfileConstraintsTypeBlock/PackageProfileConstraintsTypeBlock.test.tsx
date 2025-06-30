import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Formik } from "formik";
import PackageProfileConstraintsTypeBlock from "./PackageProfileConstraintsTypeBlock";
import { INITIAL_VALUES } from "../PackageProfileCreateForm/constants";
import { CONSTRAINTS_TYPE_OPTIONS } from "./constants";

describe("PackageProfileConstraintsTypeBlock", () => {
  const user = userEvent.setup();

  const Wrapper = () => (
    <Formik initialValues={INITIAL_VALUES} onSubmit={vi.fn()}>
      {(formik) => <PackageProfileConstraintsTypeBlock formik={formik} />}
    </Formik>
  );

  it("should render the constraints type selector", () => {
    renderWithProviders(<Wrapper />);
    expect(
      screen.getByRole("combobox", { name: /package constraints/i }),
    ).toBeInTheDocument();
  });

  it("should show instance selector when 'From an instance's packages' is selected", async () => {
    renderWithProviders(<Wrapper />);
    const select = screen.getByRole("combobox", {
      name: /package constraints/i,
    });
    await user.selectOptions(select, CONSTRAINTS_TYPE_OPTIONS[1].value);
    expect(
      await screen.findByRole("combobox", { name: /instance/i }),
    ).toBeInTheDocument();
  });

  it("should show file input when 'From a CSV file' is selected", async () => {
    renderWithProviders(<Wrapper />);
    const select = screen.getByRole("combobox", {
      name: /package constraints/i,
    });
    await user.selectOptions(select, CONSTRAINTS_TYPE_OPTIONS[2].value);
    expect(
      await screen.findByLabelText(/upload constraints/i),
    ).toBeInTheDocument();
  });

  it("should show manual entry block when 'Enter manually' is selected", async () => {
    renderWithProviders(<Wrapper />);
    const select = screen.getByRole("combobox", {
      name: /package constraints/i,
    });
    await user.selectOptions(select, CONSTRAINTS_TYPE_OPTIONS[3].value);
    expect(
      await screen.findByRole("button", { name: /add new constraint/i }),
    ).toBeInTheDocument();
  });
});
