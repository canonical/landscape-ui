import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ROUTES } from "@/libs/routes";
import { renderWithProviders } from "@/tests/render";
import AccountPage from "./AccountPage";

const navigate = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

describe("AccountPage", () => {
  it("redirects to account general settings", async () => {
    renderWithProviders(<AccountPage />);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(ROUTES.account.general(), {
        replace: true,
      });
    });

    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });
});
