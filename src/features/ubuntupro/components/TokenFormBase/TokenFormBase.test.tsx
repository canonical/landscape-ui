import { instances } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import TokenFormBase from "./TokenFormBase";

const selectedInstances = instances.slice(0, 3);

describe("TokenFormBase", () => {
  const user = userEvent.setup();

  it("renders token input field", () => {
    renderWithProviders(
      <TokenFormBase
        selectedInstances={selectedInstances}
        submitButtonText="Attach token"
        notification={{
          title: "Test notification",
          message: "Test message",
        }}
      >
        <p>Test children content</p>
      </TokenFormBase>,
    );

    expect(screen.getByLabelText(/token/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your token/i)).toBeInTheDocument();
  });

  it("renders submit button with provided text", () => {
    renderWithProviders(
      <TokenFormBase
        selectedInstances={selectedInstances}
        submitButtonText="Replace"
        notification={{
          title: "Test notification",
          message: "Test message",
        }}
      >
        <p>Test children content</p>
      </TokenFormBase>,
    );

    expect(
      screen.getByRole("button", { name: /replace/i }),
    ).toBeInTheDocument();
  });

  it("renders children content", () => {
    renderWithProviders(
      <TokenFormBase
        selectedInstances={selectedInstances}
        submitButtonText="Attach token"
        notification={{
          title: "Test notification",
          message: "Test message",
        }}
      >
        <p>Custom warning message</p>
      </TokenFormBase>,
    );

    expect(screen.getByText(/custom warning message/i)).toBeInTheDocument();
  });

  it("disables submit button when form is pristine", () => {
    renderWithProviders(
      <TokenFormBase
        selectedInstances={selectedInstances}
        submitButtonText="Attach token"
        notification={{
          title: "Test notification",
          message: "Test message",
        }}
      >
        <p>Test children content</p>
      </TokenFormBase>,
    );

    const submitButton = screen.getByRole("button", { name: /attach token/i });
    expect(submitButton).toHaveAttribute("aria-disabled", "true");
  });

  it("enables submit button when token is entered", async () => {
    renderWithProviders(
      <TokenFormBase
        selectedInstances={selectedInstances}
        submitButtonText="Attach token"
        notification={{
          title: "Test notification",
          message: "Test message",
        }}
      >
        <p>Test children content</p>
      </TokenFormBase>,
    );

    const tokenInput = screen.getByLabelText(/token/i);
    const submitButton = screen.getByRole("button", { name: /attach token/i });

    await user.type(tokenInput, "test-token");
    expect(submitButton).not.toHaveAttribute("aria-disabled");
    expect(submitButton).toBeEnabled();
  });

  it("shows confirmation modal when there are invalid instances", async () => {
    renderWithProviders(
      <TokenFormBase
        selectedInstances={selectedInstances}
        submitButtonText="Attach token"
        notification={{
          title: "Test notification",
          message: "Test message",
        }}
      >
        <p>Test children content</p>
      </TokenFormBase>,
    );

    const tokenInput = screen.getByLabelText(/token/i);
    const submitButton = screen.getByRole("button", { name: /attach token/i });

    await user.type(tokenInput, "test-token");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/attach ubuntu pro token/i)).toBeInTheDocument();
      expect(
        screen.getByText(/confirming this action means/i),
      ).toBeInTheDocument();
    });
  });

  it("closes confirmation modal when cancel is clicked", async () => {
    renderWithProviders(
      <TokenFormBase
        selectedInstances={selectedInstances}
        submitButtonText="Attach token"
        notification={{
          title: "Test notification",
          message: "Test message",
        }}
      >
        <p>Test children content</p>
      </TokenFormBase>,
    );

    const tokenInput = screen.getByLabelText(/token/i);
    const submitButton = screen.getByRole("button", { name: /attach token/i });

    await user.type(tokenInput, "test-token");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/attach ubuntu pro token/i)).toBeInTheDocument();
    });

    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByText(/attach ubuntu pro token/i),
      ).not.toBeInTheDocument();
    });
  });
});
