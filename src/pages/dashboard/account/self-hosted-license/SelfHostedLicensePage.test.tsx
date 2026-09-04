import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/tests/render";
import SelfHostedLicensePage from "./SelfHostedLicensePage";

describe("SelfHostedLicensePage", () => {
  it("renders the page title and documentation link", () => {
    renderWithProviders(<SelfHostedLicensePage />);

    expect(
      screen.getByRole("heading", { name: "Self hosted license" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Learn more about self hosted landscape",
      }),
    ).toHaveAttribute(
      "href",
      expect.stringContaining("/self-hosted-landscape/"),
    );
  });

  it("renders the self-hosted license setup instructions", async () => {
    renderWithProviders(<SelfHostedLicensePage />);

    expect(
      screen.getByRole("heading", { name: "Setting up the license file" }),
    ).toBeInTheDocument();

    expect(
      await screen.findByRole("button", { name: "Download license file" }),
    ).toBeInTheDocument();
  });
});
