import {
  scriptDetails,
  scriptVersionsWithPagination,
} from "@/tests/mocks/script";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import ScriptsVersionHistory from "./ScriptsVersionHistory";

const props: ComponentProps<typeof ScriptsVersionHistory> = {
  script: scriptDetails,
  viewVersionHistory: vi.fn(),
};

describe("Scripts Version History", () => {
  it("should render script version history", async () => {
    renderWithProviders(<ScriptsVersionHistory {...props} />);

    const table = await screen.findByRole("table");
    expect(table).toBeInTheDocument();

    expect(screen.getByText(/version/i)).toBeInTheDocument();
    expect(screen.getByText(/created/i)).toBeInTheDocument();

    const limitedVersions = scriptVersionsWithPagination.slice(0, 20);
    for (const version of limitedVersions) {
      const button = screen.getByRole("button", {
        name: `${version.version_number}`,
      });

      expect(button).toBeInTheDocument();
    }
  });

  it("should render side panel navigation", async () => {
    renderWithProviders(<ScriptsVersionHistory {...props} />);

    const table = await screen.findByRole("table");
    expect(table).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /next/i,
      }),
    ).toBeInTheDocument();
  });
});
