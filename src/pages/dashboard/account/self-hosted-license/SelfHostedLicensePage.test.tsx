import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/tests/render";
import SelfHostedLicensePage from "./SelfHostedLicensePage";

describe("SelfHostedLicensePage", () => {
  it("renders the page title and documentation link", () => {
    renderWithProviders(<SelfHostedLicensePage />);

    expect(
      screen.getByRole("heading", { name: "Legacy license file" }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("link", {
        name: "Learn more about Landscape licensing",
      }),
    ).toHaveAttribute("href", expect.stringContaining("/licenses/"));
  });
});
