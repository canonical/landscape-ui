/* eslint-disable @typescript-eslint/no-magic-numbers */
import { renderWithProviders } from "@/tests/render";
import { beforeEach, describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MirrorPackagesList from ".";
import { mirrors, packages } from "@/tests/mocks/mirrors";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { AppErrorBoundary } from "@/components/layout/AppErrorBoundary";

describe("MirrorPackagesList", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });
  it("renders table with correct header after loading", async () => {
    renderWithProviders(<MirrorPackagesList mirrorName={mirrors[0].name} />);

    expect(screen.getByRole("status")).toBeInTheDocument();

    expect(
      await screen.findByRole("columnheader", { name: "Package name" }),
    ).toBeInTheDocument();
  });

  it("navigates to the next and previous page", async () => {
    assert(packages[0]);
    assert(packages[9]);
    assert(packages[10]);
    assert(packages[19]);

    const user = userEvent.setup();
    renderWithProviders(<MirrorPackagesList mirrorName={mirrors[0].name} />);

    expect(await screen.findByText(packages[0])).toBeInTheDocument();
    expect(await screen.findByText(packages[9])).toBeInTheDocument();
    expect(screen.queryByText(packages[10])).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Next page" }));

    expect(await screen.findByText(packages[10])).toBeInTheDocument();
    expect(await screen.findByText(packages[19])).toBeInTheDocument();
    expect(screen.queryByText(packages[0])).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Previous page" }));

    expect(await screen.findByText(packages[0])).toBeInTheDocument();
    expect(screen.queryByText(packages[10])).not.toBeInTheDocument();
  });

  it("renders empty table", async () => {
    setEndpointStatus({ path: "mirrors/packages", status: "empty" });
    renderWithProviders(<MirrorPackagesList mirrorName={mirrors[0].name} />);

    expect(screen.getByRole("status")).toBeInTheDocument();

    expect(
      await screen.findByRole("columnheader", { name: "Package name" }),
    ).toBeInTheDocument();

    expect(
      await screen.findByText("No packages associated with this mirror."),
    ).toBeInTheDocument();
  });

  it("renders error state", async () => {
    setEndpointStatus({ path: "mirrors/packages", status: "error" });
    renderWithProviders(
      <AppErrorBoundary>
        <MirrorPackagesList mirrorName={mirrors[0].name} />
      </AppErrorBoundary>,
    );

    expect(screen.getByRole("status")).toBeInTheDocument();

    expect(
      await screen.findByText((content, element) => {
        return (
          element?.textContent ===
          "We hit an unexpected error while loading this page. You can try again — if the problem continues, please report it or contact our support team."
        );
      }),
    ).toBeInTheDocument();
  });
});
