import LocationDisplay from "@/tests/LocationDisplay";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ScriptsHeader from "./ScriptsHeader";

describe("ScriptsHeader", () => {
  const user = userEvent.setup();

  it("should render ScriptsHeader correctly", () => {
    renderWithProviders(<ScriptsHeader />);
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(screen.getByText(/status/i)).toBeInTheDocument();
  });

  it("should write in search", async () => {
    renderWithProviders(<ScriptsHeader />);
    const searchBox = screen.getByRole("searchbox");
    await user.type(searchBox, "test{enter}");
    expect(searchBox).toHaveValue("test");
  });

  it("should clear search box", async () => {
    renderWithProviders(<ScriptsHeader />);
    const searchBox = screen.getByRole("searchbox");
    await user.type(searchBox, "test");
    await user.click(
      screen.getByRole("button", { name: /Clear search field/i }),
    );
    expect(searchBox).toHaveValue("");
  });

  it("should render Add script button", () => {
    renderWithProviders(<ScriptsHeader />);
    expect(
      screen.getByRole("button", { name: /add script/i }),
    ).toBeInTheDocument();
  });

  it("should open Create script form when Add script is clicked", async () => {
    renderWithProviders(
      <>
        <ScriptsHeader />
        <LocationDisplay />
      </>,
    );
    await user.click(screen.getByRole("button", { name: /add script/i }));
    expect(screen.getByTestId("location").textContent).toContain(
      "sidePath=create",
    );
  });
});
