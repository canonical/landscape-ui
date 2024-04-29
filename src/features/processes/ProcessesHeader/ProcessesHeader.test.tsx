import { renderWithProviders } from "@/tests/render";
import ProcessesHeader from "./ProcessesHeader";
import { vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const props = {
  instanceId: 21,
  onPageChange: vi.fn(),
  onSearch: vi.fn(),
  selectedPids: [],
  setSelectedPids: vi.fn(),
};

describe("ProcessesHeader", () => {
  beforeEach(() => {
    renderWithProviders(<ProcessesHeader {...props} />);
  });

  it("should render ProcessesHeader correctly", () => {
    const buttons = ["End process", "Kill process"];
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    buttons.forEach((button) => {
      expect(screen.getByRole("button", { name: button })).toBeInTheDocument();
    });
  });

  it("should write in search", async () => {
    const searchBox = screen.getByRole("searchbox");
    await userEvent.type(searchBox, "test{enter}");
    expect(searchBox).toHaveValue("test");
    expect(props.onSearch).toHaveBeenCalledWith("test");
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
