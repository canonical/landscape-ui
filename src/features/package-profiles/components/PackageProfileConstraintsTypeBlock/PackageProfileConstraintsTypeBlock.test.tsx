import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useFormik } from "formik";
import type { FC } from "react";
import { describe, expect, it } from "vitest";
import { EMPTY_CONSTRAINT } from "../../constants";
import type { AddFormProps } from "../../types";
import PackageProfileConstraintsTypeBlock from "./PackageProfileConstraintsTypeBlock";

const INITIAL_VALUES: AddFormProps = {
  access_group: "global",
  all_computers: false,
  constraints: [EMPTY_CONSTRAINT],
  constraintsType: "",
  csvFile: null,
  description: "",
  isCsvFileParsed: false,
  material: "",
  source_computer_id: 0,
  tags: [],
  title: "",
};

const ComponentWithFormik: FC = () => {
  const formik = useFormik<AddFormProps>({
    initialValues: INITIAL_VALUES,
    onSubmit: () => undefined,
  });

  return <PackageProfileConstraintsTypeBlock formik={formik} />;
};

describe("PackageProfileConstraintsTypeBlock", () => {
  it("renders the package constraints type selector", () => {
    renderWithProviders(<ComponentWithFormik />);

    expect(
      screen.getByRole("combobox", { name: "Package constraints" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("combobox", { name: "Instance" }),
    ).not.toBeInTheDocument();
  });

  it("renders the instance selector with the placeholder option when the instance type is chosen", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ComponentWithFormik />);

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Package constraints" }),
      "instance",
    );

    const instanceSelect = await screen.findByRole("combobox", {
      name: "Instance",
    });

    expect(instanceSelect).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Select instance" }),
    ).toBeInTheDocument();
  });

  it("uploads and removes a CSV file when the material type is chosen", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ComponentWithFormik />);

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Package constraints" }),
      "material",
    );

    const fileInput = await screen.findByLabelText("Upload constraints");
    const csvFile = new File(["package\tinstall"], "constraints.csv", {
      type: "text/csv",
    });

    await user.upload(fileInput, csvFile);

    expect(await screen.findByText("constraints.csv")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Remove" }));

    await waitFor(() => {
      expect(screen.queryByText("constraints.csv")).not.toBeInTheDocument();
    });
    expect(screen.getByLabelText("Upload constraints")).toBeInTheDocument();
  });

  it("renders the manual constraints block when the manual type is chosen", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ComponentWithFormik />);

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Package constraints" }),
      "manual",
    );

    expect(
      await screen.findByRole("button", { name: /add new constraint/i }),
    ).toBeInTheDocument();
  });
});
