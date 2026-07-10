import { renderWithProviders } from "@/tests/render";
import { beforeEach, describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import MirrorPackagesList from ".";
import { mirrors } from "@/tests/mocks/mirrors";
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

    expect(await screen.findByText("package-1")).toBeInTheDocument();
    expect(screen.getByText("package-2")).toBeInTheDocument();
    expect(screen.getByText("package-3")).toBeInTheDocument();
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
