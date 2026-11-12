import { FEEDBACK_LINK } from "@/constants";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FallbackComponent } from "./FallbackComponent";

const renderFallback = (resetError = vi.fn()) =>
  renderWithProviders(
    FallbackComponent({
      error: new Error("Boom"),
      componentStack: "\n    at Thing",
      eventId: "event-1",
      resetError,
    }),
  );

describe("FallbackComponent", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockReturnValue(undefined);
  });

  it("renders the error message, report link and recovery actions", () => {
    renderFallback();

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "report it" })).toHaveAttribute(
      "href",
      FEEDBACK_LINK,
    );
    const tryAgainButton = screen.getByRole("button", { name: "Try again" });
    const reloadButton = screen.getByRole("button", { name: "Reload page" });
    expect(tryAgainButton).toHaveClass("ds", "button", "primary");
    expect(reloadButton).toHaveClass("ds", "button", "tertiary");
  });

  it("calls resetError when 'Try again' is clicked", async () => {
    const resetError = vi.fn();
    renderFallback(resetError);

    await userEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(resetError).toHaveBeenCalledOnce();
  });

  it("reloads the page when 'Reload page' is clicked", async () => {
    const reload = vi.fn();
    vi.spyOn(window, "location", "get").mockReturnValue({
      ...window.location,
      reload,
    });

    renderFallback();
    await userEvent.click(screen.getByRole("button", { name: "Reload page" }));

    expect(reload).toHaveBeenCalledOnce();
  });

  it("copies the error report to the clipboard with the component stack", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    renderFallback();

    const copyButton = screen.getByRole("button", { name: /copy/i });
    expect(copyButton).toHaveClass("ds", "button", "tertiary");
    expect(copyButton).toHaveIcon("copy");

    await userEvent.click(copyButton);

    expect(writeText).toHaveBeenCalledOnce();
    expect(writeText).toHaveBeenCalledWith(
      expect.stringContaining("Error: Boom"),
    );
    expect(writeText).toHaveBeenCalledWith(
      expect.stringContaining("Component stack:\n"),
    );

    const copiedButton = await screen.findByRole("button", { name: "Copied" });
    expect(copiedButton).toHaveIcon("success");
  });
});
