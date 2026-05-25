import { renderWithProviders } from "@/tests/render";
import { describe, expect } from "vitest";
import MirrorPublicationsLink from "./MirrorPublicationsLinks";
import { mirrors } from "@/tests/mocks/mirrors";
import { Suspense } from "react";
import LoadingState from "@/components/layout/LoadingState";
import { screen } from "@testing-library/react";

const useListPublications = vi.hoisted(() => vi.fn());

vi.mock("../../api", async () => {
  const actual = await vi.importActual("../../api");

  return {
    ...actual,
    useListPublications,
  };
});

describe("MirrorPublicationsLink", () => {
  it("renders with no publications", async () => {
    useListPublications.mockReturnValueOnce({
      data: {
        data: {
          publications: [],
        },
      },
    });

    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <MirrorPublicationsLink mirrorName={mirrors[0].name} />
      </Suspense>,
    );

    expect(screen.getByText("0 publications")).toBeInTheDocument();
  });

  it("renders a link with an exact count", async () => {
    useListPublications.mockReturnValueOnce({
      data: {
        data: {
          publications: ["publication-1", "publication-2", "publication-3"],
        },
      },
    });

    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <MirrorPublicationsLink mirrorName={mirrors[0].name} />
      </Suspense>,
    );

    expect(screen.getByText("3 publications")).toBeInTheDocument();
  });

  it("renders a link with a limited count", async () => {
    useListPublications.mockReturnValueOnce({
      data: {
        data: {
          publications: ["publication-1", "publication-2", "publication-3"],
          nextPageToken: "token",
        },
      },
    });

    renderWithProviders(
      <Suspense fallback={<LoadingState />}>
        <MirrorPublicationsLink mirrorName={mirrors[0].name} />
      </Suspense>,
    );

    expect(screen.getByText("3+ publications")).toBeInTheDocument();
  });
});
