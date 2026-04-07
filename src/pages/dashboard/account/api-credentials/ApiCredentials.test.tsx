import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectLoadingState } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import ApiCredentials from "./ApiCredentials";

describe("ApiCredentials", () => {
  it("renders API credentials table when user and credentials are loaded", async () => {
    renderWithProviders(<ApiCredentials />);

    expect(
      screen.getByRole("heading", { name: "API credentials" }),
    ).toBeInTheDocument();
    await expectLoadingState();

    expect(await screen.findByText("test-account")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Generate API credentials" }),
    ).toBeInTheDocument();
  });
});
