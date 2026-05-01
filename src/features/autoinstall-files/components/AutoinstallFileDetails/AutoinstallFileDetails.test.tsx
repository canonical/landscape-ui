import { setEndpointStatus } from "@/tests/controllers/controller";
import { expectLoadingState } from "@/tests/helpers";
import {
  autoinstallFiles,
  autoinstallFileVersions,
} from "@/tests/mocks/autoinstallFiles";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";
import { describe, expect, it } from "vitest";
import AutoinstallFileDetails from "./AutoinstallFileDetails";

describe("AutoinstallFileDetails", () => {
  const [defaultFile, nonDefaultFile] = autoinstallFiles;

  const defaultProps: ComponentProps<typeof AutoinstallFileDetails> = {
    autoinstallFile: defaultFile,
  };

  it("renders action buttons", () => {
    renderWithProviders(<AutoinstallFileDetails {...defaultProps} />);
    expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /set as default/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /remove/i })).toBeInTheDocument();
  });

  it("disables set-as-default and remove buttons for the default file", () => {
    renderWithProviders(
      <AutoinstallFileDetails
        {...defaultProps}
        autoinstallFile={{ ...defaultFile, is_default: true }}
      />,
    );
    expect(
      screen.getByRole("button", { name: /set as default/i }),
    ).toHaveAttribute("aria-disabled", "true");
    expect(screen.getByRole("button", { name: /remove/i })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("enables set-as-default and remove buttons for non-default files", () => {
    renderWithProviders(
      <AutoinstallFileDetails
        {...defaultProps}
        autoinstallFile={nonDefaultFile}
      />,
    );
    expect(
      screen.getByRole("button", { name: /set as default/i }),
    ).toBeEnabled();
    expect(screen.getByRole("button", { name: /remove/i })).toBeEnabled();
  });

  it("opens edit form side panel when clicking the edit button", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AutoinstallFileDetails {...defaultProps} />);
    await user.click(screen.getByRole("button", { name: /edit/i }));
    await waitFor(() => {
      expect(screen.getByRole("complementary")).toBeInTheDocument();
    });
  });

  it("opens delete modal when clicking the remove button", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <AutoinstallFileDetails
        {...defaultProps}
        autoinstallFile={nonDefaultFile}
      />,
    );
    await user.click(screen.getByRole("button", { name: /remove/i }));
    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: new RegExp(nonDefaultFile.filename, "i"),
        }),
      ).toBeInTheDocument();
    });
  });

  it("renders with an initial tab id", () => {
    renderWithProviders(
      <AutoinstallFileDetails
        {...defaultProps}
        initialTabId="version-history"
      />,
    );
    expect(
      screen.getByRole("tab", { name: /version history/i }),
    ).toBeInTheDocument();
  });

  it("calls viewVersionHistory when navigating back from a version detail", async () => {
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
      <AutoinstallFileDetails
        {...defaultProps}
        initialTabId="version-history"
      />,
    );

    // Wait for version history to load
    await expectLoadingState();

    // Click a version button to open the version detail side panel
    const versionButton = await screen.findByRole("button", {
      name: /version 1/i,
    });
    await user.click(versionButton);

    // Wait for the side panel to open and load
    const aside = await screen.findByRole("complementary");

    // Wait for loading to finish inside the side panel
    await waitFor(
      () => {
        expect(within(aside).queryByRole("status")).not.toBeInTheDocument();
      },
      { timeout: 5000 },
    );

    // Click the Back button in the version detail panel
    const backButton = await screen.findByRole("button", { name: /back/i });
    await user.click(backButton);

    // Verify the version history is shown again (side panel updates)
    await waitFor(() => {
      expect(screen.getByRole("complementary")).toBeInTheDocument();
    });
  });
});
