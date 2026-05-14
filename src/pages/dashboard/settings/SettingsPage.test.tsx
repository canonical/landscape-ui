import { waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ROUTES } from "@/libs/routes";
import { renderWithProviders } from "@/tests/render";
import SettingsPage from "./SettingsPage";

const navigate = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

describe("SettingsPage", () => {
  it("redirects to settings general page", async () => {
    renderWithProviders(<SettingsPage />);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(ROUTES.settings.general(), {
        replace: true,
      });
    });
  });
});
