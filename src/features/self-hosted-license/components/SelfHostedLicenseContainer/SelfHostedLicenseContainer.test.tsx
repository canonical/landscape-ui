import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import { expectLoadingState } from "@/tests/helpers";
import { selfHostedLicense } from "@/tests/mocks/selfHostedLicense";
import SelfHostedLicenseContainer from "./SelfHostedLicenseContainer";

describe("SelfHostedLicenseContainer", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the server-provided license download URL in the curl command", async () => {
    renderWithProviders(<SelfHostedLicenseContainer />);

    const codeSnippet = await screen.findByText(
      (_, element) =>
        element?.tagName === "CODE" &&
        element.textContent ===
          `sudo curl -so /etc/landscape/license.txt \\
${selfHostedLicense.download_url}`,
    );

    expect(codeSnippet).toBeInTheDocument();
  });

  it("shows a loading spinner in the code block while the license is being fetched", async () => {
    renderWithProviders(<SelfHostedLicenseContainer />);

    await expectLoadingState();
  });

  it("disables the download button while the license is being fetched, then enables it", async () => {
    renderWithProviders(<SelfHostedLicenseContainer />);

    expect(
      screen.getByRole("button", { name: "Download license file" }),
    ).toHaveAttribute("aria-disabled", "true");

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: "Download license file" }),
      ).not.toHaveAttribute("aria-disabled");
    });
  });

  it("opens the license file download URL in a new tab", async () => {
    const user = userEvent.setup();
    const windowOpenSpy = vi
      .spyOn(window, "open")
      .mockImplementation(() => null);

    renderWithProviders(<SelfHostedLicenseContainer />);

    await user.click(
      await screen.findByRole("button", { name: "Download license file" }),
    );

    expect(windowOpenSpy).toHaveBeenCalledWith(
      selfHostedLicense.download_url,
      "_blank",
      "noopener,noreferrer",
    );
  });
});
