import { screen, waitFor } from "@testing-library/react";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { useContext } from "react";
import { MemoryRouter } from "react-router";
import { renderWithProviders } from "@/tests/render";
import SidePanelProvider, { SidePanelContext } from "./sidePanel";
import { NotifyContext } from "./notify";

const TestConsumer = () => (
  <SidePanelContext.Consumer>
    {({
      setSidePanelContent,
      closeSidePanel,
      changeSidePanelSize,
      changeSidePanelTitleLabel,
    }) => (
      <div>
        <button
          onClick={() => {
            setSidePanelContent("Test Title", <div>Panel Body</div>);
          }}
        >
          Open Panel
        </button>
        <button
          onClick={() => {
            closeSidePanel();
          }}
        >
          Close Panel
        </button>
        <button
          onClick={() => {
            changeSidePanelSize("medium");
          }}
        >
          Make Medium
        </button>
        <button
          onClick={() => {
            changeSidePanelTitleLabel("subtitle");
          }}
        >
          Set Title Label
        </button>
      </div>
    )}
  </SidePanelContext.Consumer>
);

describe("SidePanelProvider", () => {
  const user = userEvent.setup();

  it("renders children", () => {
    renderWithProviders(
      <SidePanelProvider>
        <div data-testid="child">hello</div>
      </SidePanelProvider>,
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("opens side panel with title and body on setSidePanelContent", async () => {
    renderWithProviders(
      <SidePanelProvider>
        <TestConsumer />
      </SidePanelProvider>,
    );

    await user.click(screen.getByText("Open Panel"));

    await waitFor(() => {
      expect(screen.getByText("Test Title")).toBeInTheDocument();
      expect(screen.getByText("Panel Body")).toBeInTheDocument();
    });
  });

  it("closes side panel on closeSidePanel", async () => {
    renderWithProviders(
      <SidePanelProvider>
        <TestConsumer />
      </SidePanelProvider>,
    );

    await user.click(screen.getByText("Open Panel"));
    await waitFor(() => {
      expect(screen.getByText("Panel Body")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Close Panel"));
    await waitFor(() => {
      expect(screen.queryByText("Panel Body")).not.toBeInTheDocument();
    });
  });

  it("closes side panel when clicking the close button in the header", async () => {
    renderWithProviders(
      <SidePanelProvider>
        <TestConsumer />
      </SidePanelProvider>,
    );

    await user.click(screen.getByText("Open Panel"));
    await waitFor(() => {
      expect(screen.getByText("Panel Body")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /close side panel/i }));
    await waitFor(() => {
      expect(screen.queryByText("Panel Body")).not.toBeInTheDocument();
    });
  });

  it("changes size when changeSidePanelSize is called", async () => {
    renderWithProviders(
      <SidePanelProvider>
        <TestConsumer />
      </SidePanelProvider>,
    );

    await user.click(screen.getByText("Open Panel"));
    await waitFor(() => {
      expect(screen.getByText("Panel Body")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Make Medium"));
    expect(screen.getByText("Panel Body")).toBeInTheDocument();
  });

  it("changes title label when changeSidePanelTitleLabel is called", async () => {
    renderWithProviders(
      <SidePanelProvider>
        <TestConsumer />
      </SidePanelProvider>,
    );

    await user.click(screen.getByText("Open Panel"));
    await waitFor(() => {
      expect(screen.getByText("Panel Body")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Set Title Label"));
    expect(screen.getByText("subtitle")).toBeInTheDocument();
  });

  it("initialState functions are no-ops when used without provider", () => {
    const TestDefault = () => {
      const ctx = useContext(SidePanelContext);
      return (
        <button
          onClick={() => {
            ctx.changeSidePanelSize("small");
            ctx.changeSidePanelTitleLabel("title");
            ctx.closeSidePanel();
            ctx.setSidePanelContent("t", null);
            ctx.setSidePanelTitle("t");
          }}
        >
          call defaults
        </button>
      );
    };

    render(
      <MemoryRouter>
        <TestDefault />
      </MemoryRouter>,
    );
    screen.getByText("call defaults").click();
  });

  it("shows error notification inside the side panel", async () => {
    const TestConsumerWithError = () => (
      <SidePanelContext.Consumer>
        {({ setSidePanelContent }) => (
          <NotifyContext.Consumer>
            {({ notify }) => (
              <div>
                <button
                  onClick={() => {
                    setSidePanelContent("Title", <div>Panel Content</div>);
                  }}
                >
                  Open
                </button>
                <button
                  onClick={() => {
                    notify.error({ title: "Error", message: "Error message" });
                  }}
                >
                  Trigger Error
                </button>
              </div>
            )}
          </NotifyContext.Consumer>
        )}
      </SidePanelContext.Consumer>
    );

    renderWithProviders(
      <SidePanelProvider>
        <TestConsumerWithError />
      </SidePanelProvider>,
    );

    await user.click(screen.getByText("Open"));
    await waitFor(() => {
      expect(screen.getByText("Panel Content")).toBeInTheDocument();
    });

    await user.click(screen.getByText("Trigger Error"));
    await waitFor(() => {
      expect(screen.getAllByText("Error message").length).toBeGreaterThan(0);
    });
  });
});
