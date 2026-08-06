import { ThemeContext } from "@/context/theme";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ThemeSwitcher from "./ThemeSwitcher";

describe("ThemeSwitcher", () => {
  const user = userEvent.setup();

  it("renders a labeled segmented control with all theme options", () => {
    render(
      <ThemeContext.Provider
        value={{ isDarkMode: false, theme: "light", setTheme: vi.fn() }}
      >
        <ThemeSwitcher />
      </ThemeContext.Provider>,
    );

    expect(
      screen.getByRole("radiogroup", { name: "Theme" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "System" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Light" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Dark" })).toBeInTheDocument();
    expect(
      screen.getByText("Changes are applied and saved instantly."),
    ).toBeInTheDocument();
  });

  it("marks the current theme as selected and keeps only it in the tab order", () => {
    render(
      <ThemeContext.Provider
        value={{ isDarkMode: true, theme: "dark", setTheme: vi.fn() }}
      >
        <ThemeSwitcher />
      </ThemeContext.Provider>,
    );

    expect(screen.getByRole("radio", { name: "Dark" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: "Dark" })).toHaveAttribute(
      "tabindex",
      "0",
    );
    expect(screen.getByRole("radio", { name: "Light" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
    expect(screen.getByRole("radio", { name: "Light" })).toHaveAttribute(
      "tabindex",
      "-1",
    );
  });

  it("describes the radiogroup with the help text", () => {
    render(
      <ThemeContext.Provider
        value={{ isDarkMode: false, theme: "system", setTheme: vi.fn() }}
      >
        <ThemeSwitcher />
      </ThemeContext.Provider>,
    );

    expect(
      screen.getByRole("radiogroup", { name: "Theme" }),
    ).toHaveAccessibleDescription("Changes are applied and saved instantly.");
  });

  it("selects the next theme with arrow keys", async () => {
    const setTheme = vi.fn();

    render(
      <ThemeContext.Provider
        value={{ isDarkMode: false, theme: "system", setTheme }}
      >
        <ThemeSwitcher />
      </ThemeContext.Provider>,
    );

    screen.getByRole("radio", { name: "System" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(setTheme).toHaveBeenCalledWith("light");

    await user.keyboard("{ArrowLeft}");
    expect(setTheme).toHaveBeenCalledWith("dark");

    await user.keyboard("{ArrowDown}");
    expect(setTheme).toHaveBeenLastCalledWith("light");

    await user.keyboard("{ArrowUp}");
    expect(setTheme).toHaveBeenLastCalledWith("dark");

    await user.keyboard("{End}");
    expect(setTheme).toHaveBeenLastCalledWith("dark");

    await user.keyboard("{Home}");
    expect(setTheme).toHaveBeenLastCalledWith("system");
  });

  it("applies the selected theme immediately", async () => {
    const setTheme = vi.fn();

    render(
      <ThemeContext.Provider
        value={{ isDarkMode: false, theme: "system", setTheme }}
      >
        <ThemeSwitcher />
      </ThemeContext.Provider>,
    );

    await user.click(screen.getByRole("radio", { name: "Dark" }));

    expect(setTheme).toHaveBeenCalledWith("dark");
  });
});
