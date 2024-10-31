import { describe } from "vitest";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import LoginMethods from "./LoginMethodsLayout";
import userEvent from "@testing-library/user-event";
import { allLoginMethods, noneLoginMethods } from "@/tests/mocks/loginMethods";

const EMPTY_MESSAGE =
  "It seems like you have no way to get in. Please contact our support team.";

const emptyMessageNotBeInTheDocument = () => {
  const emptyMessage = screen.queryByText(EMPTY_MESSAGE);

  expect(emptyMessage).not.toBeInTheDocument();
};

describe("LoginMethodsLayout", () => {
  it("should render no sign in methods", async () => {
    renderWithProviders(<LoginMethods methods={noneLoginMethods} />);

    expect(screen.queryAllByRole("button").length).toBe(0);

    expect(screen.getByText(EMPTY_MESSAGE)).toBeInTheDocument();
  });

  it("should render okta sign in method", async () => {
    const methods = {
      ...noneLoginMethods,
      oidc: {
        available: true,
        configurations: allLoginMethods.oidc.configurations,
      },
    };

    renderWithProviders(<LoginMethods methods={methods} />);

    expect(screen.getAllByRole("button").length).toBe(1);

    expect(screen.getByRole("button")).toHaveTextContent(
      "Sign in with Okta Enabled",
    );

    emptyMessageNotBeInTheDocument();
  });

  it("should render enterprise sign in method", async () => {
    const methods = {
      ...noneLoginMethods,
      standalone_oidc: {
        available: true,
        enabled: true,
      },
    };

    renderWithProviders(<LoginMethods methods={methods} />);

    expect(screen.getAllByRole("button").length).toBe(1);

    expect(screen.getByRole("button")).toHaveTextContent(
      "Sign in with Enterprise Login",
    );

    emptyMessageNotBeInTheDocument();
  });

  it("should render ubuntu one sign in method", async () => {
    const methods = {
      ...noneLoginMethods,
      ubuntu_one: {
        available: true,
        enabled: true,
      },
    };

    renderWithProviders(<LoginMethods methods={methods} />);

    expect(screen.getAllByRole("button").length).toBe(1);

    expect(screen.getByRole("button")).toHaveTextContent(
      "Sign in with Ubuntu One",
    );

    emptyMessageNotBeInTheDocument();
  });

  it("should render email and password sign in method", async () => {
    const methods = {
      ...noneLoginMethods,
      password: {
        available: true,
        enabled: true,
      },
    };

    renderWithProviders(<LoginMethods methods={methods} />);

    const buttons = screen.getAllByRole("button");

    expect(buttons.length).toBe(2);

    expect(buttons[0]).toHaveTextContent("Show");
    expect(buttons[1]).toHaveTextContent("Sign in");

    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    emptyMessageNotBeInTheDocument();
  });

  it("should not validate email with pam method enabled", async () => {
    const methods = {
      ...noneLoginMethods,
      pam: {
        available: true,
        enabled: true,
      },
    };

    renderWithProviders(<LoginMethods methods={methods} />);

    const inputLabel = screen.getByText(/identity/i);
    const emailInput = screen.getByRole("textbox", { name: /identity/i });

    expect(inputLabel).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();

    await userEvent.type(emailInput, "testinputvalue");

    await waitFor(() => {
      emailInput.blur();
    });

    expect(
      screen.queryByText("Please provide a valid email address"),
    ).not.toBeInTheDocument();

    emptyMessageNotBeInTheDocument();
  });

  it("should validate email with pam method disabled", async () => {
    const methods = {
      ...noneLoginMethods,
      password: {
        available: true,
        enabled: true,
      },
    };

    renderWithProviders(<LoginMethods methods={methods} />);

    const inputLabel = screen.getByText(/email/i);
    const emailInput = screen.getByRole("textbox", { name: /email/i });

    expect(inputLabel).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();

    await userEvent.type(emailInput, "testinputvalue");

    await waitFor(() => {
      emailInput.blur();
    });

    expect(
      screen.getByText("Please provide a valid email address"),
    ).toBeInTheDocument();

    emptyMessageNotBeInTheDocument();
  });

  it("should render all sign in method", async () => {
    renderWithProviders(<LoginMethods methods={allLoginMethods} />);

    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "Sign in with Okta Enabled" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign in with Ubuntu One" }),
    ).toBeInTheDocument();

    emptyMessageNotBeInTheDocument();
  });
});
