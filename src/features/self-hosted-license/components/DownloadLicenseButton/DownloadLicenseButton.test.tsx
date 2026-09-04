import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import DownloadLicenseButton from "./DownloadLicenseButton";

describe("DownloadLicenseButton", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("disables the button while loading", () => {
    renderWithProviders(<DownloadLicenseButton isLoading />);

    expect(
      screen.getByRole("button", { name: "Download license file" }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("disables the button when there is no download URL yet", () => {
    renderWithProviders(<DownloadLicenseButton isLoading={false} />);

    expect(
      screen.getByRole("button", { name: "Download license file" }),
    ).toHaveAttribute("aria-disabled", "true");
  });

  it("enables the button once a download URL is available", () => {
    renderWithProviders(
      <DownloadLicenseButton
        isLoading={false}
        downloadUrl="https://example.com/license.txt"
      />,
    );

    expect(
      screen.getByRole("button", { name: "Download license file" }),
    ).not.toHaveAttribute("aria-disabled");
  });

  it("opens the download URL in a new tab when clicked", async () => {
    const user = userEvent.setup();
    const windowOpenSpy = vi
      .spyOn(window, "open")
      .mockImplementation(() => null);
    const downloadUrl = "https://example.com/license.txt";

    renderWithProviders(
      <DownloadLicenseButton isLoading={false} downloadUrl={downloadUrl} />,
    );

    await user.click(
      screen.getByRole("button", { name: "Download license file" }),
    );

    expect(windowOpenSpy).toHaveBeenCalledWith(
      downloadUrl,
      "_blank",
      "noopener,noreferrer",
    );
  });
});
