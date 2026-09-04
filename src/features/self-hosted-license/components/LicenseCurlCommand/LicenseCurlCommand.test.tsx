import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/tests/render";
import LicenseCurlCommand from "./LicenseCurlCommand";

describe("LicenseCurlCommand", () => {
  it("shows a loading spinner while the license is loading", () => {
    renderWithProviders(<LicenseCurlCommand isLoading />);

    expect(screen.getByRole("status")).toHaveTextContent("Loading...");
  });

  it("shows a loading spinner when there is no download URL yet", () => {
    renderWithProviders(<LicenseCurlCommand isLoading={false} />);

    expect(screen.getByRole("status")).toBeInTheDocument();
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
