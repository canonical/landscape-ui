import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import {
  autoinstallFiles,
  autoinstallFileVersions,
} from "@/tests/mocks/autoinstallFiles";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import AutoinstallFileVersionHistory from "./AutoinstallFileVersionHistory";

describe("AutoinstallFileVersionHistory", () => {
  const [file] = autoinstallFiles;

  it("shows loading state while fetching", async () => {
    renderWithProviders(
      <AutoinstallFileVersionHistory
        file={file}
        viewVersionHistory={vi.fn()}
      />,
    );
    await expectLoadingState();
  });

  it("renders the version history table after loading", async () => {
    renderWithProviders(
      <AutoinstallFileVersionHistory
        file={file}
        viewVersionHistory={vi.fn()}
      />,
    );
    await expectLoadingState();
    expect(screen.getByRole("table")).toBeInTheDocument();
  });

  it("renders empty table when no versions are available", async () => {
    renderWithProviders(
      <AutoinstallFileVersionHistory
        file={file}
        viewVersionHistory={vi.fn()}
      />,
    );
    await expectLoadingState();
    const table = screen.getByRole("table");
    expect(table).toBeInTheDocument();
    expect(within(table).queryAllByRole("row")).toHaveLength(1); // header row only
  });

  it("renders version buttons when version history is available", async () => {
    setEndpointStatus({
      status: "variant",
      path: "autoinstall",
      response: {
        current_version: 3,
        max_versions: 5,
        versions: autoinstallFileVersions,
      },
    });
    renderWithProviders(
      <AutoinstallFileVersionHistory
        file={file}
        viewVersionHistory={vi.fn()}
      />,
    );
    await expectLoadingState();
    expect(
      await screen.findByRole("button", { name: /version 1/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /version 2/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /version 3/i }),
    ).toBeInTheDocument();
  });

  it("opens version side panel when clicking a version button", async () => {
    const user = userEvent.setup();
    setEndpointStatus({
      status: "variant",
      path: "autoinstall",
      response: {
        current_version: 3,
        max_versions: 5,
        versions: autoinstallFileVersions,
      },
    });
    renderWithProviders(
      <AutoinstallFileVersionHistory
        file={file}
        viewVersionHistory={vi.fn()}
      />,
    );
    await expectLoadingState();
    const versionButton = await screen.findByRole("button", {
      name: /version 1/i,
    });
    await user.click(versionButton);
    await waitFor(() => {
      expect(screen.getByRole("complementary")).toBeInTheDocument();
    });
  });
});
