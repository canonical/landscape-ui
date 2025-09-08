import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import { renderWithProviders } from "@/tests/render";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect } from "vitest";
import PackageProfileConstraintsEditForm from "./PackageProfileConstraintsEditForm";

const user = userEvent.setup();

const renderAndSubmit = async () => {
  renderWithProviders(
    <PackageProfileConstraintsEditForm profile={packageProfiles[0]} />,
  );

  await expectLoadingState();
  await user.click(
    screen.getByRole("button", {
      name: `Edit ${packageProfiles[0].constraints[0].package} constraint`,
    }),
  );
  await user.click(
    screen.getByRole("button", {
      name: `Save changes to ${packageProfiles[0].constraints[0].package} constraint`,
    }),
  );
};

describe("PackageProfileConstraintsEditForm", () => {
  const packageProfileWithMultiplePages = packageProfiles.find(
    (packageProfile) => packageProfile.constraints.length > 20,
  );
  assert(packageProfileWithMultiplePages);

  it("paginates", async () => {
    renderWithProviders(
      <PackageProfileConstraintsEditForm
        profile={packageProfileWithMultiplePages}
      />,
    );

    await expectLoadingState();

    for (const constraint of packageProfileWithMultiplePages.constraints.slice(
      0,
      20,
    )) {
      expect(screen.getByText(constraint.package)).toBeInTheDocument();
    }

    for (const constraint of packageProfileWithMultiplePages.constraints.slice(
      20,
      40,
    )) {
      expect(screen.queryByText(constraint.package)).not.toBeInTheDocument();
    }

    await user.click(screen.getByRole("button", { name: "Next page" }));

    for (const constraint of packageProfileWithMultiplePages.constraints.slice(
      0,
      20,
    )) {
      expect(screen.queryByText(constraint.package)).not.toBeInTheDocument();
    }

    for (const constraint of packageProfileWithMultiplePages.constraints.slice(
      20,
    )) {
      expect(screen.getByText(constraint.package)).toBeInTheDocument();
    }
  });

  it("changes the page size", async () => {
    renderWithProviders(
      <PackageProfileConstraintsEditForm
        profile={packageProfileWithMultiplePages}
      />,
    );

    await expectLoadingState();

    for (const constraint of packageProfileWithMultiplePages.constraints.slice(
      0,
      20,
    )) {
      expect(screen.getByText(constraint.package)).toBeInTheDocument();
    }

    for (const constraint of packageProfileWithMultiplePages.constraints.slice(
      20,
      50,
    )) {
      expect(screen.queryByText(constraint.package)).not.toBeInTheDocument();
    }

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Instances per page" }),
      "50",
    );

    for (const constraint of packageProfileWithMultiplePages.constraints.slice(
      0,
      50,
    )) {
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
      screen.getByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
  });
});
