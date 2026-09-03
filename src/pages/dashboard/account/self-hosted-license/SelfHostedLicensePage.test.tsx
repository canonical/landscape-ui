import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import { selfHostedLicense } from "@/tests/mocks/selfHostedLicense";
import SelfHostedLicensePage from "./SelfHostedLicensePage";

const redirectToExternalUrl = vi.hoisted(() => vi.fn());

vi.mock("@/features/auth/helpers", async (importOriginal) => ({
  ...(await importOriginal()),
  redirectToExternalUrl,
}));

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

  it("downloads the license file from the server-provided URL", async () => {
    const user = userEvent.setup();

    renderWithProviders(<SelfHostedLicensePage />);

    await user.click(
      await screen.findByRole("button", { name: "Download license file" }),
    );

    expect(redirectToExternalUrl).toHaveBeenCalledWith(
      selfHostedLicense.download_url,
    );
  });
});