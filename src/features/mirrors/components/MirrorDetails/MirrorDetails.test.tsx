import { renderWithProviders } from "@/tests/render";
import { assert, beforeEach, describe, expect, it } from "vitest";
import MirrorDetails from "./MirrorDetails";
import { mirrors } from "@/tests/mocks/mirrors";
import { Suspense } from "react";
import userEvent from "@testing-library/user-event";
import LoadingState from "@/components/layout/LoadingState";
import { expectLoadingState } from "@/tests/helpers";
import { screen, within } from "@testing-library/react";
import type { Mirror } from "@canonical/landscape-openapi";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { AppErrorBoundary } from "@/components/layout/AppErrorBoundary";

const typedMirrors = mirrors as Mirror[];

describe("MirrorDetails", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("renders failed update notification", async () => {
    const failedMirror = typedMirrors.find(({ lastOperation }) =>
      lastOperation?.includes("ffff-llll-dddd"),
    );
    assert(failedMirror, "Missing mock mirror with a failed operation");

    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <MirrorDetails />
      </Suspense>,
      undefined,
      `?name=${failedMirror.name}`,
    );

    expect(
      await screen.findByRole("heading", { name: /Update failed/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Your last mirror update was not completed successfully.",
      ),
    ).toBeInTheDocument();

    expect(screen.getAllByRole("button", { name: "View logs" })).toHaveLength(
      2,
    );
  });

  it("renders both tabs and navigates to them when clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <MirrorDetails />
      </Suspense>,
      undefined,
      `?name=${mirrors[0].name}`,
    );

    await expectLoadingState();

    expect(
      screen.getByRole("heading", { name: "Details" }),
    ).toBeInTheDocument();

    const tabs = within(screen.getByRole("navigation"));
    const packagesTab = tabs.getByText("Packages");
    await user.click(packagesTab);

    expect(
      screen.queryByRole("heading", { name: "Details" }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: /Package name/i }),
    ).toBeInTheDocument();

    const detailsTab = tabs.getByText("General details");
    await user.click(detailsTab);

    expect(
      screen.getByRole("heading", { name: "Details" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("columnheader", { name: /Package name/i }),
    ).not.toBeInTheDocument();
  });

  it("throws when the mirror is not found", async () => {
    renderWithProviders(
      <AppErrorBoundary>
        <Suspense fallback={<LoadingState />}>
          <MirrorDetails />
        </Suspense>
      </AppErrorBoundary>,
    );

    expect(
      await screen.findByText(/^Mirror\s+was not found$/),
    ).toBeInTheDocument();
  });
});
