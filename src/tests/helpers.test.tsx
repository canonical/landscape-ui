import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { expectLoadingState } from "./helpers";

describe("expectLoadingState", () => {
  it("waits for the loading spinner to be removed", async () => {
    const { rerender } = render(<div role="status">Loading...</div>);
    const loadingFinished = expectLoadingState();
    await screen.findByRole("status");

    rerender(<div>Loaded</div>);

    await loadingFinished;
    expect(screen.getByText("Loaded")).toBeInTheDocument();
  });

  it("waits for the loading spinner to become hidden", async () => {
    const { rerender } = render(<div role="status">Loading...</div>);
    const loadingFinished = expectLoadingState();
    const spinner = await screen.findByRole("status");

    rerender(
      <div role="status" style={{ display: "none" }}>
        Loading...
      </div>,
    );

    await loadingFinished;
    expect(spinner).toBeInTheDocument();
    expect(spinner).not.toBeVisible();
  });
});
