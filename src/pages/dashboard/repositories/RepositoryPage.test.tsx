import { waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ROUTES } from "@/libs/routes";
import { renderWithProviders } from "@/tests/render";
import RepositoryPage from "./RepositoryPage";

const navigate = vi.fn();

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

describe("RepositoryPage", () => {
  it("redirects to repository mirrors", async () => {
    renderWithProviders(<RepositoryPage />);

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(ROUTES.repositories.mirrors(), {
        replace: true,
      });
    });
  });
});
