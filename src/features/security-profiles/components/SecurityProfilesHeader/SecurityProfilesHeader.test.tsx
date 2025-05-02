import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SecurityProfilesHeader from "./SecurityProfilesHeader";

describe("ScriptsHeader", () => {
  beforeEach(() => {
    renderWithProviders(<SecurityProfilesHeader />);
  });

  it("should render ScriptsHeader correctly", () => {
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(screen.getByText(/status/i)).toBeInTheDocument();
    expect(screen.getByText(/pass rate/i)).toBeInTheDocument();
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
