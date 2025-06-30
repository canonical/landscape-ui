import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import PackageProfileCreateForm from "./PackageProfileCreateForm";

describe("PackageProfileCreateForm", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    renderWithProviders(<PackageProfileCreateForm />);
  });

  it("should render the form fields", () => {
    expect(screen.getByRole("textbox", { name: /name/i })).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: /description/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /access group/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /package constraints/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add package profile/i }),
    ).toBeInTheDocument();
  });

  it("should show validation errors on submit with empty required fields", async () => {
    const submitButton = screen.getByRole("button", {
      name: /add package profile/i,
    });
    await user.click(submitButton);

    expect(await screen.findAllByText("This field is required.")).toHaveLength(
      3,
    );
  });

  it("should show manual constraint fields when selected", async () => {
    const constraintsTypeSelect = screen.getByRole("combobox", {
      name: /package constraints/i,
    });
    await user.selectOptions(constraintsTypeSelect, "manual");

    expect(
      await screen.findByRole("button", { name: "Add new constraint" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("should show instance fields when selected", async () => {
    const constraintsTypeSelect = screen.getByRole("combobox", {
      name: /package constraints/i,
    });
    await user.selectOptions(constraintsTypeSelect, "instance");

    expect(
      await screen.findByRole("combobox", { name: /instance/i }),
    ).toBeInTheDocument();
  });

  it("should show file upload field when selected", async () => {
    const constraintsTypeSelect = screen.getByRole("combobox", {
      name: /package constraints/i,
    });
    await user.selectOptions(constraintsTypeSelect, "material");

    expect(
      await screen.findByLabelText(/upload constraints/i),
    ).toBeInTheDocument();
  });
});
