import { describe } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/tests/render";
import SupportLoginPage from "./SupportLoginPage";
import { CONTACT_SUPPORT_TEAM_MESSAGE } from "@/constants";

describe("SupportLoginPage", () => {
  it("should render", async () => {
    renderWithProviders(<SupportLoginPage />);

    expect(screen.getByText("Sign in to Landscape")).toBeInTheDocument();

    const errorMessage = screen.queryByText(CONTACT_SUPPORT_TEAM_MESSAGE);

    expect(errorMessage).not.toBeInTheDocument();
  });

  it("should render ubuntu one button", async () => {
    renderWithProviders(<SupportLoginPage />);

    expect(screen.getByText("Sign in with Ubuntu One")).toBeVisible();
  });

  it("should not render other forms of login", async () => {
    renderWithProviders(<SupportLoginPage />);

    const loginForm = screen.queryByRole("form");
    const octaButton = screen.queryByRole("button", {
      name: "Sign in with Okta Enabled",
    });
    const enterpriseButton = screen.queryByRole("button", {
      name: "Sign in with Enterprise Login",
    });

    expect(loginForm).not.toBeInTheDocument();
    expect(octaButton).not.toBeInTheDocument();
    expect(enterpriseButton).not.toBeInTheDocument();
  });
});
