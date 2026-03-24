import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ThemeContext } from "@/context/theme";
import { render } from "@testing-library/react";
import DarkModeSwitch from "./DarkModeSwitch";

describe("DarkModeSwitch", () => {
  const user = userEvent.setup();

  it("renders a switch labeled Dark mode", () => {
    const set = vi.fn();
    render(
      <ThemeContext.Provider value={{ isDarkMode: false, set }}>
        <DarkModeSwitch />
      </ThemeContext.Provider>,
    );

    expect(screen.getByLabelText("Dark mode")).toBeInTheDocument();
  });

  it("toggling the switch calls set with inverted value", async () => {
    const set = vi.fn();

    render(
      <ThemeContext.Provider value={{ isDarkMode: false, set }}>
        <DarkModeSwitch />
      </ThemeContext.Provider>,
    );

    await user.click(screen.getByRole("switch", { name: "Dark mode" }));
    expect(set).toHaveBeenCalledWith(true);
  });

  it("calls set with false when dark mode is on", async () => {
    const set = vi.fn();

    render(
      <ThemeContext.Provider value={{ isDarkMode: true, set }}>
        <DarkModeSwitch />
      </ThemeContext.Provider>,
    );

    await user.click(screen.getByRole("switch", { name: "Dark mode" }));
    expect(set).toHaveBeenCalledWith(false);
  });
});
