import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/tests/render";
import { selfHostedLicense } from "@/tests/mocks/selfHostedLicense";
import SelfHostedLicensePage from "./SelfHostedLicensePage";

describe("SelfHostedLicensePage", () => {
  it("renders the server-provided license download URL in the curl command", async () => {
    renderWithProviders(<SelfHostedLicensePage />);

    const codeSnippet = await screen.findByText(
      (_, element) =>
        element?.tagName === "CODE" &&
        element.textContent ===
          `sudo curl -so /etc/landscape/license.txt \\
${selfHostedLicense.download_url}`,
    );

    expect(codeSnippet).toBeInTheDocument();
  });
});