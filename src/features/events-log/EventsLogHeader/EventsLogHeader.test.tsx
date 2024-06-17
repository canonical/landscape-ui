import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EventsLogHeader from "./EventsLogHeader";
import { FILTERS } from "./constants";

describe("EventsLogHeader", () => {
  beforeEach(() => {
    renderWithProviders(<EventsLogHeader />);
  });

  it("should render EventsLogHeader correctly", () => {
    const dropdownLabel = FILTERS.days.label;
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText(dropdownLabel)).toBeInTheDocument();
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
