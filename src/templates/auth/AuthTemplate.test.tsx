import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router";
import NotifyProvider from "@/context/notify";
import { GlobalShell } from "@/components/layout/GlobalShell";
import useDebug from "@/hooks/useDebug";
import AuthTemplate from "./AuthTemplate";

const ErrorTrigger = () => {
  const debug = useDebug();

  return (
    <button
      type="button"
      onClick={() => {
        debug(new Error("Invalid credentials", { cause: "test" }));
      }}
    >
      Submit
    </button>
  );
};

describe("AuthTemplate", () => {
  it.each([
    ["/login", "Sign in to Landscape"],
    ["/create-account", "Create a new Landscape account"],
    ["/create-account", "Create a new Landscape account with PAM"],
    ["/accept-invitation/test-invite", "Create a user to join Organization"],
  ])("shows useDebug errors below the heading on %s (%s)", (route, title) => {
    render(
      <MemoryRouter initialEntries={[route]}>
        <NotifyProvider>
          <GlobalShell>
            <AuthTemplate title={title}>
              <ErrorTrigger />
            </AuthTemplate>
          </GlobalShell>
        </NotifyProvider>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    const heading = screen.getByRole("heading", { level: 1, name: title });
    const message = screen.getByText("Invalid credentials");
    expect(screen.getAllByText("Invalid credentials")).toHaveLength(1);
    expect(heading.nextElementSibling).toContainElement(message);
    expect(message.closest(".p-notification--negative")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Close notification" }));
    expect(screen.queryByText("Invalid credentials")).not.toBeInTheDocument();
  });

  it("renders the title as the page heading alongside its children", () => {
    render(
      <AuthTemplate title="Sign in">
        <button type="button">Continue</button>
      </AuthTemplate>,
    );

    expect(
      screen.getByRole("heading", { level: 1, name: "Sign in" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Continue" }),
    ).toBeInTheDocument();
  });

  it("links the logo back to the application root", () => {
    const { container } = render(
      <AuthTemplate title="Sign in">
        <span>Content</span>
      </AuthTemplate>,
    );

    expect(container.querySelector("a[href='/'] img")).toBeInTheDocument();
  });
});
