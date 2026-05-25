import {
  scriptDetails,
  scriptVersionsWithPagination,
} from "@/tests/mocks/script";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { afterEach, describe, expect, it, assert } from "vitest";
import ScriptsVersionHistory from "./ScriptsVersionHistory";
import { DEFAULT_PAGE_SIZE } from "@/libs/pageParamsManager";

const props: ComponentProps<typeof ScriptsVersionHistory> = {
  script: scriptDetails,
  viewVersionHistory: vi.fn(),
};

describe("Scripts Version History", () => {
  const user = userEvent.setup();

  afterEach(() => {
    setEndpointStatus("default");
  });

  it("should render script version history", async () => {
    renderWithProviders(<ScriptsVersionHistory {...props} />);

    await expectLoadingState();

    const table = await screen.findByRole("table");
    expect(table).toBeInTheDocument();

    expect(screen.getByText(/version/i)).toBeInTheDocument();
    expect(screen.getByText(/created/i)).toBeInTheDocument();

    const limitedVersions = scriptVersionsWithPagination.slice(
      0,
      DEFAULT_PAGE_SIZE,
    );
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

  it("should open version details panel when clicking a version number", async () => {
    renderWithProviders(<ScriptsVersionHistory {...props} />);

    const [firstVersion] = scriptVersionsWithPagination;
    assert(firstVersion);
    const versionButton = await screen.findByRole("button", {
      name: `${firstVersion.version_number}`,
    });

    await user.click(versionButton);

    // The script is archived, so we see the author info and Back button
    expect(
      await screen.findByRole("button", { name: /back/i }),
    ).toBeInTheDocument();
  });

  it("should navigate to next page when clicking Next page button", async () => {
    renderWithProviders(<ScriptsVersionHistory {...props} />);

    await screen.findByRole("table");

    const nextPageButton = screen.getByRole("button", {
      name: /next page/i,
    });
    await user.click(nextPageButton);

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument();
    });
  });

  it("should change page size when selecting a new value", async () => {
    renderWithProviders(<ScriptsVersionHistory {...props} />);

    await screen.findByRole("table");

    const pageSizeSelect = screen.getByRole("combobox", {
      name: /instances per page/i,
    });
    await user.selectOptions(pageSizeSelect, "50");

    await waitFor(() => {
      expect(screen.getByRole("table")).toBeInTheDocument();
    });
  });

  it("should render loading state while fetching versions", () => {
    setEndpointStatus({ status: "loading", path: "scripts/versions" });
    renderWithProviders(<ScriptsVersionHistory {...props} />);

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });
});
