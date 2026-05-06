import { screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { setEndpointStatus } from "@/tests/controllers/controller";
import {
  expectLoadingState,
  resetScreenSize,
  setScreenSize,
} from "@/tests/helpers";
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
    );

    await screen.findByRole("heading", { name: "Mirrors" });
    await user.click(screen.getByRole("button", { name: "Add mirror" }));

    expect(
      await screen.findByRole("heading", { name: "Add mirror" }),
    ).toBeInTheDocument();
  });

  it("renders the edit form side panel when sidePath=edit is in the URL", async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <MirrorsPage />
      </Suspense>,
      undefined,
      "/?sidePath=edit&name=mirrors/ubuntu-archive-mirror",
    );

    await expectLoadingState();

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("button", {
        name: /save changes/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the view form side panel when sidePath=view is in the URL", async () => {
    setScreenSize("xxl");

    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <MirrorsPage />
      </Suspense>,
      undefined,
      "/?sidePath=view&name=mirrors/ubuntu-archive-mirror",
    );

    await expectLoadingState();

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("button", {
        name: /remove/i,
      }),
    ).toBeInTheDocument();
  });

  it("renders the publish form side panel when sidePath=publish is in the URL", async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <MirrorsPage />
      </Suspense>,
      undefined,
      "/?sidePath=publish&name=mirrors/ubuntu-archive-mirror",
    );

    await expectLoadingState();

    expect(
      await within(screen.getByLabelText("Side panel")).findByRole("button", {
        name: /publish mirror/i,
      }),
    ).toBeInTheDocument();
  });
});
