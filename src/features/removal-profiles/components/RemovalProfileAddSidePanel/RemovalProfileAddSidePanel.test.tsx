import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import RemovalProfileAddSidePanel from "./RemovalProfileAddSidePanel";

describe("RemovalProfileAddSidePanel", () => {
  it("renders", () => {
    renderWithProviders(<RemovalProfileAddSidePanel />);
    expect(
      screen.getByRole("heading", { name: "Add removal profile" }),
    ).toBeInTheDocument();
  });
});
