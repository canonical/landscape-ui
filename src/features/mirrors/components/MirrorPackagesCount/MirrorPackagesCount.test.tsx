import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { beforeEach, describe, expect, it } from "vitest";
import MirrorPackagesCount from "./MirrorPackagesCount";
import { mirrors } from "@/tests/mocks/mirrors";
import { screen } from "@testing-library/react";

describe("MirrorPackagesCount", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("shows an exact count", async () => {
    renderWithProviders(<MirrorPackagesCount mirrorName={mirrors[0].name} />);

    expect(await screen.findByText("3 packages")).toBeInTheDocument();
  });

  it("shows a limited count", async () => {
    setEndpointStatus({
      status: "variant",
      path: "mirrors/packages",
      response: {
        mirrorPackages: ["package-1", "package-2", "package-3"],
        nextPageToken: "token",
      },
    });

    renderWithProviders(<MirrorPackagesCount mirrorName={mirrors[0].name} />);

    expect(await screen.findByText("3+ packages")).toBeInTheDocument();
  });
});
