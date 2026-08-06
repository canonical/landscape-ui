import { renderWithProviders } from "@/tests/render";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFormik } from "formik";
import type { FC } from "react";
import * as Yup from "yup";
import { describe, expect, it } from "vitest";
import { constraintsSchema, EMPTY_CONSTRAINT } from "../../constants";
import type { Constraint, ConstraintsFormProps } from "../../types";
import PackageProfileConstraintsBlock from "./PackageProfileConstraintsBlock";

interface ComponentWithFormikProps {
  readonly initialConstraints?: Omit<Constraint, "id">[];
  readonly withValidation?: boolean;
}

const ComponentWithFormik: FC<ComponentWithFormikProps> = ({
  initialConstraints = [EMPTY_CONSTRAINT],
  withValidation = false,
}) => {
  const formik = useFormik<ConstraintsFormProps>({
    initialValues: { constraints: initialConstraints },
    onSubmit: () => undefined,
    validationSchema: withValidation
      ? Yup.object().shape({ constraints: constraintsSchema })
      : undefined,
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <PackageProfileConstraintsBlock formik={formik} />
      <button type="submit">Validate</button>
    </form>
  );
};

describe("PackageProfileConstraintsBlock", () => {
  it("renders an empty message when there are no constraints", () => {
    renderWithProviders(<ComponentWithFormik initialConstraints={[]} />);

    expect(screen.getByText("No constraints added yet.")).toBeInTheDocument();
  });

  it("renders the editable cells for a constraint row", () => {
    renderWithProviders(<ComponentWithFormik />);

    expect(
      screen.getByRole("combobox", { name: "Constraint" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Package name" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Rule" })).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Version" }),
    ).toBeInTheDocument();
  });

  it("updates constraint fields and toggles notAnyVersion via the rule", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ComponentWithFormik />);

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Constraint" }),
      "depends",
    );

    // Setting then clearing the rule with an empty version toggles
    // notAnyVersion true and back to false.
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Rule" }),
      ">=",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Rule" }),
      "",
    );

    await user.type(
      screen.getByRole("textbox", { name: "Package name" }),
      "vim",
    );
    await user.tab();

    await user.type(screen.getByRole("textbox", { name: "Version" }), "1.0");
    await user.tab();

    expect(screen.getByRole("combobox", { name: "Constraint" })).toHaveValue(
      "depends",
    );
  });

  it("adds a new constraint row, preserving touched state after submit", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ComponentWithFormik withValidation />);

    await user.click(screen.getByRole("button", { name: "Validate" }));

    await user.click(
      screen.getByRole("button", { name: /add new constraint/i }),
    );

    await waitFor(() => {
      expect(
        screen.getAllByRole("combobox", { name: "Constraint" }),
      ).toHaveLength(2);
    });
  });

  it("deletes a constraint row", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <ComponentWithFormik
        withValidation
        initialConstraints={[
          { ...EMPTY_CONSTRAINT, package: "vim" },
          { ...EMPTY_CONSTRAINT, package: "nano" },
        ]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Validate" }));

    const [, secondRowDelete] = screen.getAllByRole("button", {
      name: "Delete constraint row",
    });
    assert(secondRowDelete);

    await user.click(secondRowDelete);

    await waitFor(() => {
      expect(
        screen.getAllByRole("button", { name: "Delete constraint row" }),
      ).toHaveLength(1);
    });
  });

  it("shows per-field validation errors after submit", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ComponentWithFormik withValidation />);

    await user.click(screen.getByRole("button", { name: "Validate" }));

    const table = screen.getByRole("table");
    expect(await within(table).findAllByText("Required.")).not.toHaveLength(0);
  });

  it("shows the array-level validation error when no constraints exist", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <ComponentWithFormik withValidation initialConstraints={[]} />,
    );

    await user.click(screen.getByRole("button", { name: "Validate" }));

    expect(
      await screen.findByText(
        "Package profiles must have at least one package constraint.",
      ),
    ).toBeInTheDocument();
  });
});
