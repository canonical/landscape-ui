import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect } from "vitest";
import PackageProfileConstraintsEditForm from "./PackageProfileConstraintsEditForm";

const renderAndSubmit = async () => {
  renderWithProviders(
    <PackageProfileConstraintsEditForm profile={packageProfiles[0]} />,
  );

  await expectLoadingState();
  await userEvent.click(
    screen.getByRole("button", {
      name: `Edit ${packageProfiles[0].constraints[0].package} constraint`,
    }),
  );
  await userEvent.click(
    screen.getByRole("button", {
      name: `Save changes to ${packageProfiles[0].constraints[0].package} constraint`,
    }),
  );
};

describe("PackageProfileConstraintsEditForm", () => {
  it("paginates", async () => {
    renderWithProviders(
      <PackageProfileConstraintsEditForm profile={packageProfiles[3]} />,
    );

    await expectLoadingState();

    for (const constraint of packageProfiles[3].constraints.slice(0, 20)) {
      expect(screen.getByText(constraint.package)).toBeInTheDocument();
    }

    for (const constraint of packageProfiles[3].constraints.slice(20, 40)) {
      expect(screen.queryByText(constraint.package)).not.toBeInTheDocument();
    }

    await userEvent.click(screen.getByRole("button", { name: "Next page" }));

    for (const constraint of packageProfiles[3].constraints.slice(0, 20)) {
      expect(screen.queryByText(constraint.package)).not.toBeInTheDocument();
    }

    for (const constraint of packageProfiles[3].constraints.slice(20)) {
      expect(screen.getByText(constraint.package)).toBeInTheDocument();
    }
  });

  it("changes the page size", async () => {
    renderWithProviders(
      <PackageProfileConstraintsEditForm profile={packageProfiles[3]} />,
    );

    await expectLoadingState();

    for (const constraint of packageProfiles[3].constraints.slice(0, 20)) {
      expect(screen.getByText(constraint.package)).toBeInTheDocument();
    }

    for (const constraint of packageProfiles[3].constraints.slice(20, 50)) {
      expect(screen.queryByText(constraint.package)).not.toBeInTheDocument();
    }

    await userEvent.selectOptions(
      screen.getByRole("combobox", { name: "Instances per page" }),
      "50",
    );

    for (const constraint of packageProfiles[3].constraints.slice(0, 50)) {
      expect(screen.getByText(constraint.package)).toBeInTheDocument();
    }
  });

  it("submits", async () => {
    await renderAndSubmit();
    expect(
      screen.getByText("Package profile constraint updated"),
    ).toBeInTheDocument();
  });

  it("catches errors", async () => {
    setEndpointStatus("error");
    await renderAndSubmit();
    expect(
      screen.queryByText("Package profile constraint updated"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText("Request failed with status code 500"),
    ).toBeInTheDocument();
  });
});
