import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import ThemeProvider, { useTheme, LS_KEY } from "./theme";

const TestConsumer = () => {
  const { isDarkMode, set } = useTheme();
  return (
    <div>
      <span data-testid="mode">{isDarkMode ? "dark" : "light"}</span>
      <button
        onClick={() => {
          set(true);
        }}
      >
        Set Dark
      </button>
      <button
        onClick={() => {
          set(false);
        }}
      >
        Set Light
      </button>
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

  it("defaults to light mode when no saved preference", () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("mode")).toHaveTextContent("light");
  });

  it("reads dark mode from localStorage", () => {
    localStorage.setItem(LS_KEY, "true");

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("mode")).toHaveTextContent("dark");
  });

  it("reads light mode from localStorage", () => {
    localStorage.setItem(LS_KEY, "false");

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    expect(screen.getByTestId("mode")).toHaveTextContent("light");
  });

  it("toggling to dark mode adds the is-dark class to body", async () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    await act(async () => {
      screen.getByText("Set Dark").click();
    });

    expect(document.body.classList.contains("is-dark")).toBe(true);
    expect(document.body.style.colorScheme).toBe("dark");
  });

  it("toggling to light mode removes the is-dark class from body", async () => {
    localStorage.setItem(LS_KEY, "true");

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    await act(async () => {
      screen.getByText("Set Light").click();
    });

    expect(document.body.classList.contains("is-dark")).toBe(false);
    expect(document.body.style.colorScheme).toBe("light");
  });

  it("persists dark mode preference to localStorage", async () => {
    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    await act(async () => {
      screen.getByText("Set Dark").click();
    });

    expect(localStorage.getItem(LS_KEY)).toBe("true");
  });

  it("persists light mode preference to localStorage", async () => {
    localStorage.setItem(LS_KEY, "true");

    render(
      <ThemeProvider>
        <TestConsumer />
      </ThemeProvider>,
    );

    await act(async () => {
      screen.getByText("Set Light").click();
    });

    expect(localStorage.getItem(LS_KEY)).toBe("false");
  });

  it("renders children", () => {
    render(
      <ThemeProvider>
        <div data-testid="child">hello</div>
      </ThemeProvider>,
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("default context set function is a no-op when called without provider", () => {
    const TestDefault = () => {
      const { set } = useTheme();
      return (
        <button
          onClick={() => {
            set(true);
          }}
        >
          call set
        </button>
      );
    };

    render(<TestDefault />);
    expect(() => {
      screen.getByText("call set").click();
    }).not.toThrow();
  });
});
