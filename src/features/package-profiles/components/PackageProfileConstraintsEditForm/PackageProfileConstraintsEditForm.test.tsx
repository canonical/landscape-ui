import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import PackageProfileConstraintsEditForm from "./PackageProfileConstraintsEditForm";

describe("PackageProfileConstraintsEditForm", () => {
  const user = userEvent.setup();
  const [profile] = packageProfiles;

  beforeEach(() => {
    setEndpointStatus("default");
    renderWithProviders(
      <PackageProfileConstraintsEditForm profile={profile} />,
    );
  });

  it("should render the form with constraints table, search, and actions", async () => {
    await expectLoadingState();

    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: /Constraint type/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Remove/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add new constraint/i }),
    ).toBeInTheDocument();
  });

  it("should filter constraints by search", async () => {
    await expectLoadingState();
    const searchInput = screen.getByRole("searchbox");
    const firstConstraintPackage = profile.constraints[0].package;

    await user.type(searchInput, firstConstraintPackage);
    await user.type(searchInput, "{enter}");

    const filteredConstraint = screen.getByRole("rowheader", {
      name: firstConstraintPackage,
    });
    expect(filteredConstraint).toBeInTheDocument();
    const otherConstraints = screen.queryAllByRole("rowheader", {
      name: (name) => name !== firstConstraintPackage,
    });
    expect(otherConstraints).toHaveLength(0);
  });

  it("should allow inline editing of a constraint", async () => {
    await expectLoadingState();

    const editPackageConstraintButton = screen.getByRole("button", {
      name: `Edit ${profile.constraints[0].package} constraint`,
    });
    await user.click(editPackageConstraintButton);

    const packageNameInput = screen.getByPlaceholderText("Package name");
    expect(packageNameInput).toHaveValue(profile.constraints[0].package);

    await user.clear(packageNameInput);
    await user.type(packageNameInput, "new-package-name");

    const saveButton = screen.getByRole("button", {
      name: `Save changes for ${profile.constraints[0].package} constraint`,
    });
    await user.click(saveButton);
  });
});
