import { screen } from "@testing-library/react";
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
});
