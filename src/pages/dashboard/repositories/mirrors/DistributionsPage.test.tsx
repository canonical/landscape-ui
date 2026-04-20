import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { PATHS, ROUTES } from "@/libs/routes";
import { setEndpointStatus } from "@/tests/controllers/controller";
import {
  expectLoadingState,
  resetScreenSize,
  setScreenSize,
} from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import DistributionsPage from "./DistributionsPage";

describe("DistributionsPage", () => {
  afterEach(() => {
    resetScreenSize();
  });

  it("renders distributions and large-screen actions", async () => {
    setScreenSize("lg");

    renderWithProviders(<DistributionsPage />);

    expect(
      screen.getByRole("heading", { name: "Mirrors" }),
    ).toBeInTheDocument();
    await expectLoadingState();

    expect(await screen.findByText("Distribution 1")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add distribution" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add mirror" })).toBeEnabled();
  });

  it("disables add mirror when there are no distributions", async () => {
    setScreenSize("lg");
    setEndpointStatus("empty");

    renderWithProviders(<DistributionsPage />);

    await expectLoadingState();
    expect(
      screen.getByText("No mirrors have been added yet."),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add mirror" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("shows actions menu on small screens", async () => {
    setScreenSize("xs");

    renderWithProviders(<DistributionsPage />);

    expect(screen.getByRole("button", { name: "Actions" })).toBeInTheDocument();
  });

  it("opens add distribution side panel", async () => {
    const user = userEvent.setup();
    setScreenSize("lg");

    renderWithProviders(
      <DistributionsPage />,
      undefined,
      ROUTES.repositories.mirrors(),
      `/${PATHS.repositories.root}/${PATHS.repositories.mirrors}`,
    );

    await expectLoadingState();
    await user.click(screen.getByRole("button", { name: "Add distribution" }));

    expect(
      await screen.findByRole("heading", { name: "Add distribution" }),
    ).toBeInTheDocument();
  });

  it("opens add mirror side panel when distributions exist", async () => {
    const user = userEvent.setup();
    setScreenSize("lg");

    renderWithProviders(
      <DistributionsPage />,
      undefined,
      ROUTES.repositories.mirrors(),
      `/${PATHS.repositories.root}/${PATHS.repositories.mirrors}`,
    );

    await expectLoadingState();
    await user.click(screen.getByRole("button", { name: "Add mirror" }));

    expect(
      await screen.findByRole("heading", { name: "Add new mirror" }),
    ).toBeInTheDocument();
  });
});
