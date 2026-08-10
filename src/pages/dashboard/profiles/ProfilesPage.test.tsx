import { waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ROUTES } from "@/libs/routes";
import { renderWithProviders } from "@/tests/render";
import useEnv from "@/hooks/useEnv";
import ProfilesPage from "./ProfilesPage";

const navigate = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

vi.mock("@/hooks/useEnv");

describe("ProfilesPage", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("doesn't redirect until env is loaded", async () => {
    vi.mocked(useEnv, { partial: true }).mockReturnValue({
      envLoading: true,
    });

    renderWithProviders(<ProfilesPage />);

    await waitFor(() => {
      expect(navigate).not.toHaveBeenCalled();
    });
  });

  it("redirects to package profiles page in self-hosted", async () => {
    vi.mocked(useEnv, { partial: true }).mockReturnValue({
      envLoading: false,
      isSaas: false,
    });

    renderWithProviders(<ProfilesPage />);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(ROUTES.profiles.package(), {
        replace: true,
      });
    });
  });

  it("redirects to repository profiles page in saas", async () => {
    vi.mocked(useEnv, { partial: true }).mockReturnValue({
      envLoading: false,
      isSaas: true,
    });

    renderWithProviders(<ProfilesPage />);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(
        ROUTES.profiles.repositoryProfiles(),
        {
          replace: true,
        },
      );
    });
  });
});
