import { renderWithProviders } from "@/tests/render";
import { describe } from "vitest";
import MirrorPackagesCount from "./MirrorPackagesCount";
import { mirrors } from "@/tests/mocks/mirrors";
import { screen } from "@testing-library/react";

const useListMirrorPackages = vi.hoisted(() => vi.fn());

vi.mock("../../api", async () => {
  const actual = await vi.importActual("../../api");

  return {
    ...actual,
    useListMirrorPackages,
  };
});

describe("MirrorPackagesCount", () => {
  it("shows an exact count", () => {
    useListMirrorPackages.mockReturnValueOnce({
      data: {
        data: {
          mirrorPackages: ["package-1", "package-2", "package-3"],
          nextPageToken: undefined,
        },
      },
    });

    renderWithProviders(<MirrorPackagesCount mirrorName={mirrors[0].name} />);

    expect(screen.getByText("3 packages")).toBeInTheDocument();
  });

  it("shows a limited count", () => {
    useListMirrorPackages.mockReturnValueOnce({
      data: {
        data: {
          mirrorPackages: ["package-1", "package-2", "package-3"],
          nextPageToken: "token",
        },
      },
    });

    renderWithProviders(<MirrorPackagesCount mirrorName={mirrors[0].name} />);

    expect(screen.getByText("3+ packages")).toBeInTheDocument();
  });
});
