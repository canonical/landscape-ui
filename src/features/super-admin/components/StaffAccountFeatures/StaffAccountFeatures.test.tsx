import { AppErrorBoundary } from "@/components/layout/AppErrorBoundary";
import { API_URL } from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { authResponse } from "@/tests/mocks/auth";
import { features } from "@/tests/mocks/features";
import { createStaffAccounts } from "@/tests/mocks/staffAccounts";
import { renderWithProviders } from "@/tests/render";
import server from "@/tests/server";
import { setStaffGlobalRoles } from "@/tests/server/handlers/staffAccounts";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { beforeEach, describe, expect, it, vi } from "vitest";
import StaffAccountFeatures from "./StaffAccountFeatures";

vi.mock("@/hooks/useEnv", () => import("@/tests/mocks/env"));

const staffAccount = createStaffAccounts().find(
  ({ account }) => account === "acme",
);

const getFeatureName = (databaseKey: number): string => {
  const feature = features.find(
    ({ database_key }) => database_key === databaseKey,
  );

  assert(feature);

  return feature.name;
};

const signedInStatus = () => ({
  status: "variant" as const,
  path: "me",
  response: { ...authResponse, global_roles: ["AccountManager"] },
});

const renderFeatures = () => {
  assert(staffAccount);

  return renderWithProviders(
    <AppErrorBoundary>
      <StaffAccountFeatures staffAccount={staffAccount} />
    </AppErrorBoundary>,
  );
};

/** A feature's switch, once auth has loaded and no change is in flight. */
const findEnabledSwitch = async (featureName: string) => {
  await waitFor(() => {
    expect(screen.getByRole("switch", { name: featureName })).toBeEnabled();
  });

  return screen.getByRole("switch", { name: featureName });
};

describe("StaffAccountFeatures", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    assert(staffAccount);

    setStaffGlobalRoles(["AccountManager"]);
    setEndpointStatus(signedInStatus());
  });

  it("lists the registry by name", async () => {
    renderFeatures();

    await screen.findByRole("switch", { name: getFeatureName(4) });

    expect(
      screen
        .getAllByRole("switch")
        .map((featureSwitch) => featureSwitch.getAttribute("aria-label")),
    ).toEqual(
      features.map(({ name }) => name).sort((a, b) => a.localeCompare(b)),
    );
  });

  it("surfaces a failed registry request", async () => {
    setEndpointStatus([
      signedInStatus(),
      { status: "error", path: "features" },
    ]);

    renderFeatures();

    expect(
      within(await screen.findByRole("alert")).getByText(
        "Something went wrong",
      ),
    ).toBeInTheDocument();
    expect(screen.queryByRole("switch")).not.toBeInTheDocument();
  });

  it("shows an empty registry", async () => {
    setEndpointStatus([
      signedInStatus(),
      { status: "variant", path: "features", response: { results: [] } },
    ]);

    renderFeatures();

    expect(await screen.findByText("No features")).toBeInTheDocument();
    expect(
      screen.getByText("The feature registry is empty."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("offers a positive Enable for a disabled feature and a negative Disable for an enabled one", async () => {
    renderFeatures();

    await user.click(await findEnabledSwitch(getFeatureName(5)));

    const enableDialog = within(await screen.findByRole("dialog"));

    expect(enableDialog.getByRole("button", { name: "Enable" })).toHaveClass(
      "p-button--positive",
    );

    await user.click(enableDialog.getByRole("button", { name: "Cancel" }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    await user.click(await findEnabledSwitch(getFeatureName(4)));

    const disableDialog = within(await screen.findByRole("dialog"));

    expect(
      disableDialog.getByRole("heading", {
        name: `Disable ${getFeatureName(4)}`,
      }),
    ).toBeInTheDocument();
    expect(disableDialog.getByRole("button", { name: "Disable" })).toHaveClass(
      "p-button--negative",
    );
  });

  it("locks every switch while a change is in flight, then confirms it", async () => {
    assert(staffAccount);

    let respond: () => void = () => undefined;
    const responded = new Promise<void>((resolve) => {
      respond = resolve;
    });

    server.use(
      http.patch(`${API_URL}accounts/acme`, async () => {
        await responded;

        return HttpResponse.json({
          ...staffAccount,
          enabled_features: [4, 5, 7],
        });
      }),
    );

    renderFeatures();

    const featureName = getFeatureName(5);

    await user.click(await findEnabledSwitch(featureName));
    await user.click(
      within(await screen.findByRole("dialog")).getByRole("button", {
        name: "Enable",
      }),
    );

    await waitFor(() => {
      for (const featureSwitch of screen.getAllByRole("switch")) {
        expect(featureSwitch).toBeDisabled();
      }
    });
    expect(screen.getByRole("switch", { name: featureName })).toBeChecked();

    respond();

    expect(
      await screen.findByText(`${featureName} enabled`),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        `${featureName} is now enabled for ${staffAccount.company}.`,
      ),
    ).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    await findEnabledSwitch(featureName);
  });
});
