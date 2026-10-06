import { renderWithProviders } from "@/tests/render";
import LoadingState from "@/components/layout/LoadingState";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Suspense } from "react";
import { beforeEach, describe, expect, it } from "vitest";
import MirrorActions from "./MirrorActions";
import { OperationProvider } from "@/features/operations";
import { getLocationDisplay, LocationDisplay } from "@/tests/LocationDisplay";
import { mirrors } from "@/tests/mocks/mirrors";
import type { Mirror } from "@canonical/landscape-openapi";

const [mirror] = mirrors;
const typedMirrors = mirrors as Mirror[];

const sigPreservingMirror = typedMirrors.find(
  ({ preserveSignatures }) => preserveSignatures,
);
assert(sigPreservingMirror, "Missing mock mirror with preserve signatures");

const updatingMirror = typedMirrors.find(
  ({ lastOperation }) => lastOperation === "operations/pppp-gggg-ssss",
);
assert(updatingMirror, "Missing mock mirror with ongoing update operation");

describe("MirrorActions", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

  const TestComponent = () => {
    return (
      <Suspense fallback={<LoadingState />}>
        <MirrorActions mirror={mirror} />
        <LocationDisplay />
      </Suspense>
    );
  };

  const openActionsMenu = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.click(
      await screen.findByRole("button", {
        name: `${mirror.displayName} mirror actions`,
      }),
    );
  };

  const expectSidePanel = (action: string) => {
    const location = getLocationDisplay();
    expect(location).toHaveTextContent(`sidePath=${action}`);
    expect(location).toHaveTextContent(
      `name=${encodeURIComponent(mirror.name)}`,
    );
  };

  it("opens the update modal when update is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(<TestComponent />);

    await openActionsMenu(user);
    await user.click(await screen.findByRole("menuitem", { name: "Update" }));

    expect(
      screen.getByRole("heading", { name: `Update ${mirror.displayName}` }),
    ).toBeInTheDocument();
  });

  it("disables the update action while updating if persistent LROs are disabled", async () => {
    setEndpointStatus({ status: "empty", path: "debarchive/features" });
    const user = userEvent.setup();

    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <OperationProvider operationNames={["operations/pppp-gggg-ssss"]}>
          <MirrorActions mirror={updatingMirror} />
        </OperationProvider>
      </Suspense>,
    );

    await user.click(
      await screen.findByRole("button", {
        name: `${updatingMirror.displayName} mirror actions`,
      }),
    );

    expect(screen.getByRole("menuitem", { name: "Updating" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    expect(
      screen.queryByRole("menuitem", { name: "Update" }),
    ).not.toBeInTheDocument();
  });

  it("confirms canceling an ongoing import before importing packages", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <OperationProvider operationNames={["operations/pppp-gggg-ssss"]}>
        <MirrorActions mirror={updatingMirror} />
      </OperationProvider>,
    );

    await user.click(
      await screen.findByRole("button", {
        name: `${updatingMirror.displayName} mirror actions`,
      }),
    );

    await user.click(screen.getByRole("menuitem", { name: "Update" }));

    expect(
      await screen.findByRole("heading", {
        name: `${updatingMirror.displayName} is already updating`,
      }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /cancel update and continue/i }),
    );

    expect(
      await screen.findByRole("heading", {
        name: `Update ${updatingMirror.displayName}`,
      }),
    ).toBeInTheDocument();
  });

  it("opens the remove modal when remove is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(<TestComponent />);

    await openActionsMenu(user);
    await user.click(await screen.findByRole("menuitem", { name: "Remove" }));

    expect(
      screen.getByRole("heading", { name: `Remove ${mirror.displayName}` }),
    ).toBeInTheDocument();
  });

  it("opens no publication targets modal when publish is clicked without targets", async () => {
    const user = userEvent.setup();

    setEndpointStatus({ status: "empty", path: "publicationTargets" });

    renderWithProviders(<TestComponent />);

    await openActionsMenu(user);
    await user.click(await screen.findByRole("menuitem", { name: "Publish" }));

    expect(
      screen.getByRole("heading", {
        name: "No publication targets have been added",
      }),
    ).toBeInTheDocument();

    expect(getLocationDisplay()).not.toHaveTextContent("sidePath=publish");
  });

  it("sets publish side panel when publish is clicked with publication targets", async () => {
    const user = userEvent.setup();

    renderWithProviders(<TestComponent />);

    await openActionsMenu(user);
    await user.click(await screen.findByRole("menuitem", { name: "Publish" }));

    expectSidePanel("publish");
  });

  it("sets view side panel when view details is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(<TestComponent />);

    await openActionsMenu(user);
    await user.click(
      await screen.findByRole("menuitem", { name: "View details" }),
    );

    expectSidePanel("view");
  });

  it("sets edit side panel when edit is clicked", async () => {
    const user = userEvent.setup();

    renderWithProviders(<TestComponent />);

    await openActionsMenu(user);
    await user.click(await screen.findByRole("menuitem", { name: "Edit" }));

    expectSidePanel("edit");
  });

  it("does not render update action for preserve signatures mirror", async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <MirrorActions mirror={sigPreservingMirror} />
        <LocationDisplay />
      </Suspense>,
    );

    await user.click(
      await screen.findByRole("button", {
        name: `${sigPreservingMirror.displayName} mirror actions`,
      }),
    );

    expect(
      screen.queryByRole("menuitem", { name: "Update" }),
    ).not.toBeInTheDocument();
  });
});
