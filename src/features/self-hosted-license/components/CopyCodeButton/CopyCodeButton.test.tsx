import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import CopyCodeButton from "./CopyCodeButton";

describe("CopyCodeButton", () => {
  it("copies the provided value and shows feedback", async () => {
    const user = userEvent.setup();
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);

    renderWithProviders(<CopyCodeButton value="copy me" />);

    await user.click(screen.getByRole("button", { name: "Copy code" }));

    expect(writeText).toHaveBeenCalledWith("copy me");
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument();
  });

  it("does not show success feedback when the clipboard write fails", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValueOnce(
      new Error("Clipboard unavailable"),
    );

    renderWithProviders(<CopyCodeButton value="copy me" />);

    await user.click(screen.getByRole("button", { name: "Copy code" }));

    expect(
      screen.getByRole("button", { name: "Copy code" }),
    ).toBeInTheDocument();
  });
});
