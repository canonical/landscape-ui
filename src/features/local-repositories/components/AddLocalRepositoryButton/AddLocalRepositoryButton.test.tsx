import { renderWithProviders } from "@/tests/render";
import { describe, it, expect } from "vitest";
import AddLocalRepositoryButton from "./AddLocalRepositoryButton";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import usePageParams from "@/hooks/usePageParams";

vi.mock("@/hooks/usePageParams", () => ({
  default: vi.fn(),
}));

const mockCreatePageParamsSetter = vi.fn();
const mockUsePageParams = vi.mocked(usePageParams);

mockUsePageParams.mockReturnValue({
  createPageParamsSetter: mockCreatePageParamsSetter,
} as unknown as ReturnType<typeof usePageParams>);

describe("AddLocalRepositoryButton", () => {
  it("renders the button with correct label and styling", () => {
    renderWithProviders(<AddLocalRepositoryButton />);

    const button = screen.getByRole("button", {
      name: /add local repository/i,
    });
    expect(button).toHaveClass("p-button--positive");
    expect(button).toHaveIcon("plus");
  });

  it("opens add form when clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AddLocalRepositoryButton />);

    const button = screen.getByRole("button", {
      name: /add local repository/i,
    });
    await user.click(button);

    expect(mockCreatePageParamsSetter).toBeCalledWith({ sidePath: ["add"] });
  });
});
