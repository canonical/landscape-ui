import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import PackageProfileConstraintsAddForm from "./PackageProfileConstraintsAddForm";

describe("PackageProfileConstraintsAddForm", () => {
  const user = userEvent.setup();
  const [profile] = packageProfiles;

  beforeEach(() => {
    renderWithProviders(<PackageProfileConstraintsAddForm profile={profile} />);
  });

  it("should render the form with one empty constraint row", () => {
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Package name")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add new constraint/i }),
    ).toBeInTheDocument();
  });

  it("should allow adding and deleting constraint rows", async () => {
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

  it("should show validation errors for invalid input", async () => {
    const submitButton = screen.getByRole("button", {
      name: /add constraint/i,
    });
    await user.click(submitButton);
    const errorMessages = await screen.findAllByText("Required.");
    expect(errorMessages).toHaveLength(2);
  });
});
