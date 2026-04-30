import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { PATHS, ROUTES } from "@/libs/routes";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { resetScreenSize, setScreenSize } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import MirrorsPage from "./MirrorsPage";
import { Suspense } from "react";
import LoadingState from "@/components/layout/LoadingState";

describe("MirrorsPage", () => {
  afterEach(() => {
    resetScreenSize();
    setEndpointStatus("default");
  });

  it("renders the page heading and mirrors list", async () => {
    setScreenSize("lg");

    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <MirrorsPage />
      </Suspense>,
    );

    expect(
      await screen.findByRole("heading", { name: "Mirrors" }),
    ).toBeInTheDocument();

    expect(
      await screen.findByText("Ubuntu archive mirror"),
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: "Add mirror" })).toBeEnabled();
  });

  it("shows empty state when there are no mirrors", async () => {
    setEndpointStatus({ status: "empty", path: "mirrors" });

    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <MirrorsPage />
      </Suspense>,
    );

    expect(
      await screen.findByText("You don't have any mirrors yet."),
    ).toBeInTheDocument();
  });

  it("opens add mirror side panel when Add mirror is clicked", async () => {
    const user = userEvent.setup();
    setScreenSize("lg");

    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <MirrorsPage />
      </Suspense>,
      undefined,
      ROUTES.repositories.mirrors(),
      `/${PATHS.repositories.root}/${PATHS.repositories.mirrors}`,
    );

    await screen.findByRole("heading", { name: "Mirrors" });
    await user.click(screen.getByRole("button", { name: "Add mirror" }));

    expect(
      await screen.findByRole("heading", { name: "Add mirror" }),
    ).toBeInTheDocument();
  });
});
