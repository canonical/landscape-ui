import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter, useNavigate } from "react-router";
import { useContext } from "react";
import NotifyProvider, { NotifyContext } from "./notify";

const NavigateToLogin = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => {
        navigate("/login");
      }}
    >
      Go to login
    </button>
  );
};

const TestConsumer = () => (
  <MemoryRouter>
    <NotifyProvider>
      <NotifyContext.Consumer>
        {({ notify }) => (
          <div>
            {notify.notification && (
              <div data-testid="notification">
                {notify.notification.message?.toString()}
              </div>
            )}
            <button
              onClick={() => {
                notify.success({ title: "Done", message: "First success" });
              }}
            >
              Trigger Success A
            </button>
            <button
              onClick={() => {
                notify.success({ title: "Done", message: "Second success" });
              }}
            >
              Trigger Success B
            </button>
            <button
              onClick={() => {
                notify.error({ title: "Fail", message: "Error msg" });
              }}
            >
              Trigger Error
            </button>
            <button
              onClick={() => {
                notify.info({ title: "Info", message: "Info msg" });
              }}
            >
              Trigger Info
            </button>
            <button
              onClick={() => {
                notify.clear();
              }}
            >
              Clear
            </button>
            <NavigateToLogin />
          </div>
        )}
      </NotifyContext.Consumer>
    </NotifyProvider>
  </MemoryRouter>
);

describe("NotifyProvider", () => {
  it("shows success notification when notify.success is called", () => {
    render(<TestConsumer />);

    fireEvent.click(screen.getByText("Trigger Success A"));

    expect(screen.getByText("First success")).toBeInTheDocument();
  });

  it("shows an error notification when notify.error is called", () => {
    render(<TestConsumer />);

    fireEvent.click(screen.getByText("Trigger Error"));

    expect(screen.getByText("Error msg")).toBeInTheDocument();
  });

  it("clears notification when notify.clear is called", () => {
    render(<TestConsumer />);

    expect(screen.queryByTestId("notification")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Trigger Error"));
    expect(screen.getByTestId("notification")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Clear"));
    expect(screen.queryByTestId("notification")).not.toBeInTheDocument();
  });

  it("shows an info notification when notify.info is called", () => {
    render(<TestConsumer />);

    fireEvent.click(screen.getByText("Trigger Info"));

    expect(screen.getByText("Info msg")).toBeInTheDocument();
  });

  it("does not clear notification when navigating to /login", () => {
    render(<TestConsumer />);

    fireEvent.click(screen.getByText("Trigger Success A"));
    expect(screen.getByText("First success")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Go to login"));
    expect(screen.getByText("First success")).toBeInTheDocument();
  });

  it("exposes sidePanel open state and setOpen through context", () => {
    const SidePanelConsumer = () => (
      <MemoryRouter>
        <NotifyProvider>
          <NotifyContext.Consumer>
            {({ sidePanel }) => (
              <div>
                {sidePanel.open && <div data-testid="sidePanel" />}
                <button
                  onClick={() => {
                    sidePanel.setOpen(true);
                  }}
                >
                  Open
                </button>
                <button
                  onClick={() => {
                    sidePanel.setOpen(false);
                  }}
                >
                  Close
                </button>
              </div>
            )}
          </NotifyContext.Consumer>
        </NotifyProvider>
      </MemoryRouter>
    );

    render(<SidePanelConsumer />);

    expect(screen.queryByTestId("sidePanel")).not.toBeInTheDocument();

    fireEvent.click(screen.getByText("Open"));
    expect(screen.getByTestId("sidePanel")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close"));
    expect(screen.queryByTestId("sidePanel")).not.toBeInTheDocument();
  });

  it("default context functions are no-ops when used without provider", () => {
    const DefaultConsumer = () => {
      const { notify, sidePanel } = useContext(NotifyContext);
      return (
        <div>
          {notify.notification && (
            <div data-testid="notification">
              {notify.notification.message?.toString()}
            </div>
          )}
          {sidePanel.open && <div data-testid="sidePanel" />}
          <button
            onClick={() => {
              notify.error({ title: "t", message: "m" });
              notify.info({ title: "t", message: "m" });
              notify.success({ title: "t", message: "m" });
              notify.clear();
              sidePanel.setOpen(true);
            }}
          >
            call defaults
          </button>
        </div>
      );
    };

    render(<DefaultConsumer />);

    fireEvent.click(screen.getByText("call defaults"));

    expect(screen.queryByTestId("notification")).not.toBeInTheDocument();
    expect(screen.queryByTestId("sidePanel")).not.toBeInTheDocument();
  });

  describe("notification timeout", () => {
    const TIMEOUT_MS = 5000;

    beforeAll(() => {
      vi.useFakeTimers();
    });

    afterAll(() => {
      vi.useRealTimers();
    });

    it("auto-dismisses a success notification after the timeout", () => {
      render(<TestConsumer />);

      fireEvent.click(screen.getByText("Trigger Success A"));
      expect(screen.getByTestId("notification")).toBeInTheDocument();

      // Still visible right before the deadline.
      act(() => {
        vi.advanceTimersByTime(TIMEOUT_MS - 1);
      });
      expect(screen.getByTestId("notification")).toBeInTheDocument();

      // Cleared exactly at the deadline.
      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(screen.queryByTestId("notification")).not.toBeInTheDocument();
    });

    it("does not auto-dismiss an error notification", () => {
      render(<TestConsumer />);

      fireEvent.click(screen.getByText("Trigger Error"));
      expect(screen.getByTestId("notification")).toBeInTheDocument();

      // Errors have no duration, so no timer should ever clear them.
      act(() => {
        vi.advanceTimersByTime(TIMEOUT_MS * 2);
      });
      expect(screen.getByTestId("notification")).toBeInTheDocument();
    });

    it("resets the timeout when a second notification replaces the first", () => {
      render(<TestConsumer />);

      fireEvent.click(screen.getByText("Trigger Success A"));
      expect(screen.getByTestId("notification")).toHaveTextContent(
        "First success",
      );

      // Advance close to the first notification's deadline without reaching it.
      act(() => {
        vi.advanceTimersByTime(TIMEOUT_MS - 1000);
      });

      fireEvent.click(screen.getByText("Trigger Success B"));
      expect(screen.getByTestId("notification")).toHaveTextContent(
        "Second success",
      );

      // Pass the first notification's original deadline. If its timer had not
      // been cleared, the notification would already be gone here.
      act(() => {
        vi.advanceTimersByTime(TIMEOUT_MS - 1000);
      });
      expect(screen.getByTestId("notification")).toHaveTextContent(
        "Second success",
      );

      // Let the second notification's own timer elapse.
      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(screen.queryByTestId("notification")).not.toBeInTheDocument();
    });
  });
});
