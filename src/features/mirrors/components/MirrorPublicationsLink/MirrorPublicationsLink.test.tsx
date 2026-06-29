import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { beforeEach, describe, expect, it } from "vitest";
import MirrorPublicationsLink from "./MirrorPublicationsLinks";
import { mirrors } from "@/tests/mocks/mirrors";
import { Suspense } from "react";
import LoadingState from "@/components/layout/LoadingState";
import { screen } from "@testing-library/react";

describe("MirrorPublicationsLink", () => {
  beforeEach(() => {
    setEndpointStatus("default");
  });

  it("renders with no publications", async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <MirrorPublicationsLink mirrorName={mirrors[1].name} />
      </Suspense>,
    );

    expect(await screen.findByText("0 publications")).toBeInTheDocument();
  });

  it("renders a link with an exact count", async () => {
    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <MirrorPublicationsLink mirrorName={mirrors[0].name} />
      </Suspense>,
    );

    expect(await screen.findByText("2 publications")).toBeInTheDocument();
  });

  it("renders a link with a limited count", async () => {
    setEndpointStatus({
      status: "variant",
      path: "publications",
      response: {
        publications: ["publication-1", "publication-2", "publication-3"],
        nextPageToken: "token",
      },
    });

    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <MirrorPublicationsLink mirrorName={mirrors[0].name} />
      </Suspense>,
    );

    expect(await screen.findByText("3+ publications")).toBeInTheDocument();
  });
});
