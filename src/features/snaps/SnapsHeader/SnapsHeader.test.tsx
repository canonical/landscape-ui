import { describe, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SnapsHeader from "./SnapsHeader";
import userEvent from "@testing-library/user-event";

const props = {
  instanceId: 1,
  onSnapsSearchChange: vi.fn(),
  selectedSnapIds: [],
  installedSnaps: [],
};

describe("SnapsHeader", () => {
  beforeEach(() => {
    render(<SnapsHeader {...props} />);
  });

  it("renders SnapsHeader correctly", () => {
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
  });

  it("should write in search", async () => {
    const searchBox = screen.getByRole("searchbox");
    await userEvent.type(searchBox, "test{enter}");
    expect(searchBox).toHaveValue("test");
    expect(props.onSnapsSearchChange).toHaveBeenCalledWith("test");
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
