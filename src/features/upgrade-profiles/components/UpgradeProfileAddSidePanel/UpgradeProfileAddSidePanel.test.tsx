import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import UpgradeProfileAddSidePanel from "./UpgradeProfileAddSidePanel";

describe("UpgradeProfileAddSidePanel", () => {
  it("renders", () => {
    renderWithProviders(<UpgradeProfileAddSidePanel />);
    expect(
      screen.getByRole("heading", { name: "Add upgrade profile" }),
    ).toBeInTheDocument();
  });
});
