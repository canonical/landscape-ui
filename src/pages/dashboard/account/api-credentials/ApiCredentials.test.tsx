import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectLoadingState } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import ApiCredentials from "./ApiCredentials";
import { userDetails } from "@/tests/mocks/user";

describe("ApiCredentials", () => {
  it("renders API credentials table when user and credentials are loaded", async () => {
    renderWithProviders(<ApiCredentials />);

    expect(
      screen.getByRole("heading", { name: "API credentials" }),
    ).toBeInTheDocument();
    await expectLoadingState();

    const numberOfAccounts = userDetails.accounts.length;

    expect(screen.getAllByText("Generate API credentials")).toHaveLength(
      numberOfAccounts,
    );
  });
});
