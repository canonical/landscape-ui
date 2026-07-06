import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import PublicationsHeader from "./PublicationsHeader";

const mockSetPageParams = vi.fn();
let mockQuery = "";

vi.mock("@/hooks/usePageParams", () => ({
  __esModule: true,
  default: () => ({
    query: mockQuery,
    setPageParams: mockSetPageParams,
  }),
}));

describe("PublicationsHeader", () => {
  beforeEach(() => {
    mockQuery = "";
    mockSetPageParams.mockReset();
  });

  it("renders the search input with the current query", () => {
    mockQuery = "focal";

    renderWithProviders(<PublicationsHeader />);

    expect(screen.getByRole("searchbox")).toHaveValue("focal");
  });

  it("updates query page params when search is submitted", async () => {
    const user = userEvent.setup();

    renderWithProviders(<PublicationsHeader />);

    const searchBox = screen.getByRole("searchbox");
    await user.type(searchBox, "  jammy  {enter}");

    expect(mockSetPageParams).toHaveBeenCalledWith({ query: "jammy" });
  });
});
