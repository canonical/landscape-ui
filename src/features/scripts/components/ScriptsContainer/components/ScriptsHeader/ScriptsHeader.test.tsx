import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ScriptsHeader from "./ScriptsHeader";

describe("ScriptsHeader", () => {
  beforeEach(() => {
    renderWithProviders(<ScriptsHeader />);
  });

  it("should render ScriptsHeader correctly", () => {
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(screen.getByText(/days/i)).toBeInTheDocument();
  });

  it("should write in search", async () => {
    const searchBox = screen.getByRole("searchbox");
    await userEvent.type(searchBox, "test{enter}");
    expect(searchBox).toHaveValue("test");
  });

  it("should clear search box", async () => {
    const searchBox = screen.getByRole("searchbox");
    await userEvent.type(searchBox, "test");
    await userEvent.click(
      screen.getByRole("button", { name: /Clear search field/i }),
    );
    expect(searchBox).toHaveValue("");
  });
});
