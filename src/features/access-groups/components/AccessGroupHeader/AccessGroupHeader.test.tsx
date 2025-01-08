import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AccessGroupHeader from "./AccessGroupHeader";

describe("AccessGroupHeader", () => {
  beforeEach(() => {
    renderWithProviders(<AccessGroupHeader />);
  });

  it("should render AccessGroupHeader correctly", () => {
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(screen.getByText("Group by")).toBeInTheDocument();
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
