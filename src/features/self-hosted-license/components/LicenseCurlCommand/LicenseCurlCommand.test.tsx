import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/tests/render";
import LicenseCurlCommand from "./LicenseCurlCommand";

describe("LicenseCurlCommand", () => {
  it("shows a loading spinner while the license is loading", () => {
    renderWithProviders(<LicenseCurlCommand isLoading />);

    expect(screen.getByRole("status")).toHaveTextContent("Loading...");
  });

  it("shows an error message when loading completes without a download URL", () => {
    renderWithProviders(<LicenseCurlCommand isLoading={false} />);

    expect(
      screen.getByText("Unable to get the download license curl command."),
    ).toBeInTheDocument();
  });

  it("renders the curl command once the download URL is available", () => {
    const downloadUrl = "https://example.com/license.txt";

    renderWithProviders(
      <LicenseCurlCommand isLoading={false} downloadUrl={downloadUrl} />,
    );

    const codeSnippet = screen.getByText(
      (_, element) =>
        element?.tagName === "CODE" &&
        element.textContent ===
          `sudo curl -so /etc/landscape/license.txt \\
${downloadUrl}`,
    );

    expect(codeSnippet).toBeInTheDocument();
  });
});
