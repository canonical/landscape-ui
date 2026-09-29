import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import AccountCreationAlternative from "./AccountCreationAlternative";

describe("AccountCreationAlternative", () => {
  it("does not render when no alternate provider is enabled", () => {
    renderWithProviders(
      <AccountCreationAlternative
        oidcEnabled={false}
        ubuntuOneEnabled={false}
      />,
    );

    expect(
      screen.queryByRole("link", {
        name: /sign in with .* instead/i,
      }),
    ).not.toBeInTheDocument();
  });

  it.each([
    [true, false, "Sign in with OIDC instead"],
    [false, true, "Sign in with Ubuntu One instead"],
    [true, true, "Sign in with Ubuntu One or OIDC instead"],
  ])(
    "renders the appropriate provider link",
    (oidcEnabled, ubuntuOneEnabled, label) => {
      renderWithProviders(
        <AccountCreationAlternative
          oidcEnabled={oidcEnabled}
          ubuntuOneEnabled={ubuntuOneEnabled}
        />,
      );

      expect(screen.getByRole("link", { name: label })).toHaveAttribute(
        "href",
        "/login",
      );
    },
  );
});
