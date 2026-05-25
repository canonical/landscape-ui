import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router";
import { useContext } from "react";
import NotifyProvider, { NotifyContext } from "./notify";

const TestConsumer = () => (
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
            notify.success({ title: "Done", message: "Success msg" });
          }}
        >
          Trigger Success
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
            notify.clear();
          }}
        >
          Clear
        </button>
      </div>
    )}
  </NotifyContext.Consumer>
);

describe("NotifyProvider", () => {
  const user = userEvent.setup();

  it("renders children", () => {
    render(
      <MemoryRouter>
        <NotifyProvider>
          <div data-testid="child">hello</div>
        </NotifyProvider>
      </MemoryRouter>,
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("shows a notification when notify.success is called", async () => {
    render(
      <MemoryRouter>
        <NotifyProvider>
          <TestConsumer />
        </NotifyProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getByText("Trigger Success"));

    await waitFor(() => {
      expect(screen.getByTestId("notification")).toBeInTheDocument();
    });
  });

  it("shows an error notification when notify.error is called", async () => {
    render(
      <MemoryRouter>
        <NotifyProvider>
          <TestConsumer />
        </NotifyProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getByText("Trigger Error"));

    await waitFor(() => {
      expect(screen.getByTestId("notification")).toBeInTheDocument();
    });
  });

  it("clears notification when notify.clear is called", async () => {
    render(
      <MemoryRouter>
        <NotifyProvider>
          <TestConsumer />
        </NotifyProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getByText("Trigger Success"));
    await waitFor(() => {
      expect(screen.getByTestId("notification")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Clear"));
    await waitFor(() => {
      expect(screen.queryByTestId("notification")).not.toBeInTheDocument();
    });
  });

  it("shows an info notification when notify.info is called", async () => {
    const InfoConsumer = () => (
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
                notify.info({ title: "Info", message: "Info msg" });
              }}
            >
              Trigger Info
            </button>
          </div>
        )}
      </NotifyContext.Consumer>
    );

    render(
      <MemoryRouter>
        <NotifyProvider>
          <InfoConsumer />
        </NotifyProvider>
      </MemoryRouter>,
    );

    await user.click(screen.getByText("Trigger Info"));

    await waitFor(() => {
      expect(screen.getByTestId("notification")).toBeInTheDocument();
    });
  });

  it("does not clear notification when navigating to /login", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <NotifyProvider>
          <div data-testid="child">hello</div>
        </NotifyProvider>
      </MemoryRouter>,
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("exposes sidePanel open state and setOpen through context", async () => {
    const SidePanelConsumer = () => (
      <NotifyContext.Consumer>
        {({ sidePanel }) => (
          <div>
            <span data-testid="open">{sidePanel.open ? "open" : "closed"}</span>
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
    );

    render(
      <MemoryRouter>
        <NotifyProvider>
          <SidePanelConsumer />
        </NotifyProvider>
      </MemoryRouter>,
    );

    expect(screen.getByTestId("open")).toHaveTextContent("closed");

    await user.click(screen.getByText("Open"));
    expect(screen.getByTestId("open")).toHaveTextContent("open");

    await user.click(screen.getByText("Close"));
    expect(screen.getByTestId("open")).toHaveTextContent("closed");
  });

  it("default context functions are no-ops when used without provider", async () => {
    const DefaultConsumer = () => {
      const { notify, sidePanel } = useContext(NotifyContext);
      return (
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
      );
    };

    render(<DefaultConsumer />);
    await user.click(screen.getByText("call defaults"));
  });
});
