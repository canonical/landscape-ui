import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import MirrorPackagesList from ".";
import { mirrors } from "@/tests/mocks/mirrors";

describe("MirrorPackagesList", () => {
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
});
