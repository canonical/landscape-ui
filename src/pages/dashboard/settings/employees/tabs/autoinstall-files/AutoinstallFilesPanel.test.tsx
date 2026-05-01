import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import AutoinstallFilesPanel from "./AutoinstallFilesPanel";

describe("AutoinstallFilesPanel", () => {
  it("renders the list of autoinstall files", async () => {
    renderWithProviders(<AutoinstallFilesPanel />);
    expect(
      await screen.findByText("default-autoinstall.yaml"),
    ).toBeInTheDocument();
  });

  it("shows loading state while fetching", async () => {
    renderWithProviders(<AutoinstallFilesPanel />);
    await expectLoadingState();
  });

  it("shows empty state when no files exist", async () => {
    setEndpointStatus("empty");
    renderWithProviders(<AutoinstallFilesPanel />);
    expect(
      await screen.findByText(/no autoinstall files found/i),
    ).toBeInTheDocument();
  });

  it("shows add button in the empty state", async () => {
    setEndpointStatus("empty");
    renderWithProviders(<AutoinstallFilesPanel />);
    expect(
      await screen.findByRole("button", { name: /add autoinstall file/i }),
    ).toBeInTheDocument();
  });

  it("opens add form side panel from the empty state button", async () => {
    const user = userEvent.setup();
    setEndpointStatus("empty");
    renderWithProviders(<AutoinstallFilesPanel />);
    await user.click(
      await screen.findByRole("button", { name: /add autoinstall file/i }),
    );
    await waitFor(() => {
      expect(screen.getByText(/add new autoinstall file/i)).toBeInTheDocument();
    });
  });

  it("opens add form side panel from the header button", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AutoinstallFilesPanel />);
    await screen.findByText("default-autoinstall.yaml");
    await user.click(screen.getByRole("button", { name: /add new/i }));
    await waitFor(() => {
      expect(screen.getByText(/add new autoinstall file/i)).toBeInTheDocument();
    });
  });
});
