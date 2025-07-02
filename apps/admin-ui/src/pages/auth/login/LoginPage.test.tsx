import { describe } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/tests/render";
import LoginPage from "./LoginPage";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { CONTACT_SUPPORT_TEAM_MESSAGE } from "@/constants";
import { expectLoadingState } from "@/tests/helpers";

describe("LoginPage", () => {
  it("should render", async () => {
    renderWithProviders(<LoginPage />);

    await expectLoadingState();

    expect(screen.getByText("Sign in to Landscape")).toBeInTheDocument();

    await waitFor(() => {
      const errorMessage = screen.queryByText(CONTACT_SUPPORT_TEAM_MESSAGE);

      expect(errorMessage).not.toBeInTheDocument();
    });
  });

  it("should render contact support message in case of error", async () => {
    setEndpointStatus("error");

    renderWithProviders(<LoginPage />);

    await expectLoadingState();

    await waitFor(() => {
      expect(screen.getByText(CONTACT_SUPPORT_TEAM_MESSAGE)).toBeVisible();
    });
  });
});
