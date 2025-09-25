import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect } from "vitest";
import RebootProfileAddSidePanel from "./RebootProfileAddSidePanel";

describe("PackageProfileAddSidePanel", () => {
  it("renders", async () => {
    renderWithProviders(<RebootProfileAddSidePanel />);

    expect(
      screen.getByRole("heading", { name: "Add reboot profile" }),
    ).toBeInTheDocument();
  });
});
