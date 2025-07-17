import { describe, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/tests/render";
import LoginPage from "./LoginPage";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { CONTACT_SUPPORT_TEAM_MESSAGE } from "@/constants";
import { expectLoadingState } from "@/tests/helpers";
import useEnv from "@/hooks/useEnv";
import type { EnvContextState } from "@/context/env";

vi.mock("@/hooks/useEnv");

const envCommon: Omit<EnvContextState, "displayDisaStigBanner"> = {
  envLoading: false,
  packageVersion: "",
  revision: "",
  isSaas: true,
  isSelfHosted: false,
};

describe("LoginPage", () => {
  beforeEach(() => {
    vi.mocked(useEnv).mockReturnValue({
      ...envCommon,
      displayDisaStigBanner: false,
    });
  });

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

  it("should render consent banner modal when set to true", async () => {
    vi.mocked(useEnv, { partial: true }).mockReturnValue({
      ...envCommon,
      displayDisaStigBanner: true,
    });

    renderWithProviders(<LoginPage />);

    await expectLoadingState();

    expect(
      screen.getByRole("heading", {
        name: /proceed after acknowledging consent/i,
      }),
    ).toBeInTheDocument();
  });

  it("should not render consent banner modal when set to false", async () => {
    vi.mocked(useEnv, { partial: true }).mockReturnValue({
      ...envCommon,
      displayDisaStigBanner: false,
    });

    renderWithProviders(<LoginPage />);

    await expectLoadingState();

    expect(
      screen.queryByRole("heading", {
        name: /proceed after acknowledging consent/i,
      }),
    ).not.toBeInTheDocument();
  });
});
