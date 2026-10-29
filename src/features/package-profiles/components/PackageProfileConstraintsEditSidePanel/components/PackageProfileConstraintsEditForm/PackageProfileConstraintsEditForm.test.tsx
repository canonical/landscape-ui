/* eslint @typescript-eslint/no-magic-numbers: 0 */

import { API_URL } from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { packageProfiles } from "@/tests/mocks/package-profiles";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { expect } from "vitest";
import PackageProfileConstraintsEditForm from "./PackageProfileConstraintsEditForm";

const user = userEvent.setup();

const renderAndSubmit = async () => {
  renderWithProviders(
    <PackageProfileConstraintsEditForm profile={packageProfiles[0]} />,
  );

  expect(screen.getByRole("status")).toBeInTheDocument();

  await user.click(
    await screen.findByRole("button", {
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

  it("catches errors", async () => {
    setEndpointStatus({
      status: "error",
      path: "packageprofiles/:profileName/constraints/:constraintId",
    });
    await renderAndSubmit();
    expect(
      await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Package profile constraint updated"),
    ).not.toBeInTheDocument();
  });

  describe("request payloads", () => {
    const [constraint] = packageProfiles[0].constraints;
    const versionedConstraint = { ...constraint, rule: ">", version: "8.0" };
    let submittedPayload: unknown;

    beforeEach(() => {
      submittedPayload = undefined;

      server.use(
        http.put(
          `${API_URL}packageprofiles/:profileName/constraints/:constraintId`,
          async ({ request }) => {
            submittedPayload = await request.json();
            return HttpResponse.json();
          },
        ),
      );
    });

    it.each([
      {
        description:
          "omits version fields when saving an any-version constraint",
        initialConstraint: constraint,
        rule: "",
        version: "",
      },
      {
        description: "preserves an edited explicit version restriction",
        initialConstraint: versionedConstraint,
        rule: ">=",
        version: "9.0",
      },
      {
        description:
          "omits version fields when removing an existing restriction",
        initialConstraint: versionedConstraint,
        rule: "",
        version: "",
      },
    ])("$description", async ({ initialConstraint, rule, version }) => {
      setEndpointStatus({
        status: "variant",
        path: "packageprofiles/:profileName/constraints",
        response: { results: [initialConstraint], count: 1 },
      });
      renderWithProviders(
        <PackageProfileConstraintsEditForm profile={packageProfiles[0]} />,
      );

      await user.click(
        await screen.findByRole("button", {
          name: `Edit ${constraint.package} constraint`,
        }),
      );
      await user.selectOptions(
        screen.getByRole("combobox", { name: "Rule" }),
        rule,
      );
      const versionInput = screen.getByRole("textbox", { name: "Version" });
      await user.clear(versionInput);
      if (version) {
        await user.type(versionInput, version);
      }
      await user.tab();

      await user.click(
        screen.getByRole("button", {
          name: `Save changes to ${constraint.package} constraint`,
        }),
      );

      expect(
        await screen.findByText("Package profile constraint updated"),
      ).toBeInTheDocument();
      expect(submittedPayload).toEqual({
        constraint: constraint.constraint,
        package: constraint.package,
        ...(rule ? { rule, version } : {}),
      });
    });

    it.each([
      { rule: ">=", version: "" },
      { rule: "", version: "9.0" },
    ])(
      "does not submit an incomplete restriction: $rule $version",
      async ({ rule, version }) => {
        renderWithProviders(
          <PackageProfileConstraintsEditForm profile={packageProfiles[0]} />,
        );

        await user.click(
          await screen.findByRole("button", {
            name: `Edit ${constraint.package} constraint`,
          }),
        );
        if (rule) {
          await user.selectOptions(
            screen.getByRole("combobox", { name: "Rule" }),
            rule,
          );
        }
        if (version) {
          await user.type(
            screen.getByRole("textbox", { name: "Version" }),
            version,
          );
          await user.tab();
        }
        await user.click(
          screen.getByRole("button", {
            name: `Save changes to ${constraint.package} constraint`,
          }),
        );

        expect(await screen.findByText("Required.")).toBeInTheDocument();
        expect(submittedPayload).toBeUndefined();
        expect(
          screen.queryByText("Package profile constraint updated"),
        ).not.toBeInTheDocument();
      },
    );
  });
});
