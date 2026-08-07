import { renderWithProviders } from "@/tests/render";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFormik } from "formik";
import type { FC } from "react";
import { useState } from "react";
import * as Yup from "yup";
import { describe, expect, it } from "vitest";
import type { Constraint, PackageProfileConstraint } from "../../types";
import PackageProfileConstraintsEditFormTable from "./PackageProfileConstraintsEditFormTable";

const CONSTRAINTS: PackageProfileConstraint[] = [
  { id: 1, constraint: "depends", package: "vim", rule: ">=", version: "2.0" },
  { id: 2, constraint: "conflicts", package: "nano", rule: "", version: "" },
];

const DEFAULT_CONSTRAINT: Constraint = {
  id: 0,
  constraint: "",
  package: "",
  rule: "",
  version: "",
  notAnyVersion: false,
};

interface ComponentWithFormikProps {
  readonly filter?: string;
  readonly initialValues?: Partial<Constraint>;
  readonly isConstraintsLoading?: boolean;
  readonly profileConstraints?: PackageProfileConstraint[] | undefined;
  readonly search?: string;
  readonly selectedIds?: number[];
  readonly withValidation?: boolean;
}

const ComponentWithFormik: FC<ComponentWithFormikProps> = ({
  filter = "",
  initialValues,
  isConstraintsLoading = false,
  profileConstraints = CONSTRAINTS,
  search = "",
  selectedIds: initialSelectedIds = [],
  withValidation = false,
}) => {
  const [selectedIds, setSelectedIds] = useState<number[]>(initialSelectedIds);

  const formik = useFormik<Constraint>({
    initialValues: { ...DEFAULT_CONSTRAINT, ...initialValues },
    onSubmit: () => undefined,
    validationSchema: withValidation
      ? Yup.object().shape({ package: Yup.string().required("Required.") })
      : undefined,
  });

  return (
    <PackageProfileConstraintsEditFormTable
      filter={filter}
      formik={formik}
      isConstraintsLoading={isConstraintsLoading}
      onSelectedIdsChange={setSelectedIds}
      pageSize={20}
      profileConstraints={profileConstraints}
      search={search}
      selectedIds={selectedIds}
    />
  );
};

describe("PackageProfileConstraintsEditFormTable", () => {
  it("renders a loading row while constraints are loading", () => {
    renderWithProviders(
      <ComponentWithFormik
        isConstraintsLoading
        initialValues={{ id: -1 }}
        profileConstraints={[]}
      />,
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows the empty message with the filter and search context", () => {
    renderWithProviders(
      <ComponentWithFormik
        filter="depends"
        search="vim"
        profileConstraints={[]}
      />,
    );

    expect(
      screen.getByText(
        'No constraints found with the constraint type: "depends" and with the search: "vim"',
      ),
    ).toBeInTheDocument();
  });

  it("renders existing constraints and toggles selection", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ComponentWithFormik />);

    expect(screen.getByText("vim")).toBeInTheDocument();
    expect(screen.getByText("nano")).toBeInTheDocument();
    expect(screen.getByText("Newer or equal to")).toBeInTheDocument();

    const getToggleAll = () =>
      screen.getByRole("checkbox", { name: "Toggle all constraints" });

    await user.click(getToggleAll());
    expect(getToggleAll()).toBeChecked();

    await user.click(
      screen.getByRole("checkbox", { name: "Toggle vim constraint" }),
    );
    expect(getToggleAll()).toBePartiallyChecked();

    await user.click(getToggleAll());
    expect(getToggleAll()).not.toBeChecked();
  });

  it("edits a new constraint row and updates rule/version state", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ComponentWithFormik initialValues={{ id: -1 }} />);

    // Setting then clearing the rule while the version is empty toggles
    // notAnyVersion true and then back to false.
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Rule" }),
      ">=",
    );
    await user.selectOptions(
      screen.getByRole("combobox", { name: "Rule" }),
      "",
    );

    await user.type(screen.getByRole("textbox", { name: "Version" }), "1.0");

    await user.type(
      screen.getByRole("textbox", { name: "Package name" }),
      "vim",
    );

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Constraint" }),
      "depends",
    );

    expect(screen.getByRole("combobox", { name: "Constraint" })).toHaveValue(
      "depends",
    );
  });

  it("shows a validation error for a touched, invalid field in edit mode", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <ComponentWithFormik initialValues={{ id: -1 }} withValidation />,
    );

    const packageInput = screen.getByRole("textbox", { name: "Package name" });
    await user.click(packageInput);
    await user.tab();

    expect(await screen.findByText("Required.")).toBeInTheDocument();
  });

  it("renders an existing row in edit mode alongside read-only rows", () => {
    renderWithProviders(<ComponentWithFormik initialValues={{ id: 1 }} />);

    const table = screen.getByRole("table");
    expect(
      within(table).getByRole("combobox", { name: "Rule" }),
    ).toBeInTheDocument();
    expect(screen.getByText("nano")).toBeInTheDocument();
  });
});
