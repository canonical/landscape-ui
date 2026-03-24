import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import { createFormik } from "@/tests/formik";
import RadioGroup from "./RadioGroup";

describe("RadioGroup", () => {
  const user = userEvent.setup();

  it("renders the label", () => {
    const formik = createFormik({ mode: "option1" });

    renderWithProviders(
      <RadioGroup
        field="mode"
        formik={formik}
        label="Select mode"
        inputs={[]}
      />,
    );

    expect(screen.getByText("Select mode")).toBeInTheDocument();
  });

  it("renders radio inputs", () => {
    const formik = createFormik({ mode: "option1" });

    renderWithProviders(
      <RadioGroup
        field="mode"
        formik={formik}
        label="Mode"
        inputs={[
          { key: "opt1", value: "option1", label: "Option 1" },
          { key: "opt2", value: "option2", label: "Option 2" },
        ]}
      />,
    );

    expect(screen.getByRole("radio", { name: "Option 1" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Option 2" })).toBeInTheDocument();
  });

  it("checks the radio matching the current formik value", () => {
    const formik = createFormik({ mode: "option2" });

    renderWithProviders(
      <RadioGroup
        field="mode"
        formik={formik}
        label="Mode"
        inputs={[
          { key: "opt1", value: "option1", label: "Option 1" },
          { key: "opt2", value: "option2", label: "Option 2" },
        ]}
      />,
    );

    expect(screen.getByRole("radio", { name: "Option 2" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Option 1" })).not.toBeChecked();
  });

  it("calls formik.setFieldValue when a radio is selected", async () => {
    const formik = createFormik({ mode: "option1" });

    renderWithProviders(
      <RadioGroup
        field="mode"
        formik={formik}
        label="Mode"
        inputs={[
          { key: "opt1", value: "option1", label: "Option 1" },
          { key: "opt2", value: "option2", label: "Option 2" },
        ]}
      />,
    );

    await user.click(screen.getByRole("radio", { name: "Option 2" }));

    expect(formik.setFieldValue).toHaveBeenCalledWith("mode", "option2");
  });

  it("calls onSelect callback when a radio is selected", async () => {
    const onSelect = vi.fn();
    const formik = createFormik({ mode: "option1" });

    renderWithProviders(
      <RadioGroup
        field="mode"
        formik={formik}
        label="Mode"
        inputs={[
          { key: "opt1", value: "option1", label: "Option 1" },
          { key: "opt2", value: "option2", label: "Option 2", onSelect },
        ]}
      />,
    );

    await user.click(screen.getByRole("radio", { name: "Option 2" }));

    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("shows expansion content for the checked item", () => {
    const formik = createFormik({ mode: "option1" });

    renderWithProviders(
      <RadioGroup
        field="mode"
        formik={formik}
        label="Mode"
        inputs={[
          {
            key: "opt1",
            value: "option1",
            label: "Option 1",
            expansion: <div>Expanded content</div>,
          },
          {
            key: "opt2",
            value: "option2",
            label: "Option 2",
            expansion: <div>Other expansion</div>,
          },
        ]}
      />,
    );

    expect(screen.getByText("Expanded content")).toBeInTheDocument();
    expect(screen.queryByText("Other expansion")).not.toBeInTheDocument();
  });

  it("renders help text for inputs", () => {
    const formik = createFormik({ mode: "option1" });

    renderWithProviders(
      <RadioGroup
        field="mode"
        formik={formik}
        label="Mode"
        inputs={[
          {
            key: "opt1",
            value: "option1",
            label: "Option 1",
            help: "This is helpful",
          },
        ]}
      />,
    );

    expect(screen.getByText("This is helpful")).toBeInTheDocument();
  });
});
