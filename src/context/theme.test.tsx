import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Theme } from "./theme";
import ThemeProvider, { LS_KEY, useTheme } from "./theme";

const mockSystemDark = (matches: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches: query === "(prefers-color-scheme: dark)" && matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
};

const TestConsumer = () => {
  const { isDarkMode, theme, setTheme } = useTheme();
  return (
    <div>
      <span data-testid="mode">{isDarkMode ? "dark" : "light"}</span>
      <span data-testid="theme">{theme}</span>
      {(["light", "dark", "system"] as Theme[]).map((value) => (
        <button
          key={value}
          onClick={() => {
            setTheme(value);
          }}
        >
          {`Set ${value}`}
        </button>
      ))}
    </div>
  );
};

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.className = "";
    document.body.style.colorScheme = "";
  });

  afterEach(() => {
    localStorage.clear();
    document.body.className = "";
    document.body.style.colorScheme = "";
  });

  it("defaults to the system theme when no saved preference", () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("system");
    expect(screen.getByTestId("mode")).toHaveTextContent("light");
  });

  it("follows a dark system preference when the theme is system", () => {
    mockSystemDark(true);

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("system");
    expect(screen.getByTestId("mode")).toHaveTextContent("dark");
    expect(document.body.classList.contains("is-dark")).toBe(true);
  });

  it("ignores a dark system preference when the theme is light", () => {
    mockSystemDark(true);
    localStorage.setItem(LS_KEY, "light");

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("mode")).toHaveTextContent("light");
  });

  it("reads the dark theme from localStorage", () => {
    localStorage.setItem(LS_KEY, "dark");

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(screen.getByTestId("mode")).toHaveTextContent("dark");
  });

  it("reads the light theme from localStorage", () => {
    localStorage.setItem(LS_KEY, "light");

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    expect(screen.getByTestId("mode")).toHaveTextContent("light");
  });

  it("migrates the legacy dark mode value", () => {
    localStorage.setItem(LS_KEY, "true");

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("dark");
    expect(screen.getByTestId("mode")).toHaveTextContent("dark");
  });

  it("migrates the legacy light mode value", () => {
    localStorage.setItem(LS_KEY, "false");

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("light");
    expect(screen.getByTestId("mode")).toHaveTextContent("light");
  });

  it("falls back to the system theme for an unknown saved value", () => {
    localStorage.setItem(LS_KEY, "unknown");

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme")).toHaveTextContent("system");
  });

  it("setting the dark theme adds the is-dark class to body", async () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    await act(async () => {
      screen.getByText("Set dark").click();
    });

    expect(document.body.classList.contains("is-dark")).toBe(true);
    expect(document.body.style.colorScheme).toBe("dark");
  });

  it("setting the light theme removes the is-dark class from body", async () => {
    localStorage.setItem(LS_KEY, "dark");

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    await act(async () => {
      screen.getByText("Set light").click();
    });

    expect(document.body.classList.contains("is-dark")).toBe(false);
    expect(document.body.style.colorScheme).toBe("light");
  });

  it("persists the theme preference to localStorage", async () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    await act(async () => {
      screen.getByText("Set dark").click();
    });

    expect(localStorage.getItem(LS_KEY)).toBe("dark");

    await act(async () => {
      screen.getByText("Set system").click();
    });

    expect(localStorage.getItem(LS_KEY)).toBe("system");
  });

  it("renders children", () => {
    render(
      <ThemeProvider>
        <div data-testid="child">hello</div>
      </ThemeProvider>,
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("default context setTheme function is a no-op when called without provider", () => {
    const TestDefault = () => {
      const { setTheme } = useTheme();
      return (
        <button
          onClick={() => {
            setTheme("dark");
          }}
        >
          call setTheme
        </button>
      );
    };

    render(<TestDefault />);
    expect(() => {
      screen.getByText("call setTheme").click();
    }).not.toThrow();
  });
});
