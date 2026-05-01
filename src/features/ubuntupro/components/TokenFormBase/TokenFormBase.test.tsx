import { setEndpointStatus } from "@/tests/controllers/controller";
import { instances } from "@/tests/mocks/instance";
import { renderWithProviders } from "@/tests/render";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import TokenFormBase from "./TokenFormBase";

const selectedInstances = instances.slice(0, 3);

// instances[1] and instances[2] are returned as "invalid" by the handler
// (query includes "has-pro-management:false")
const allInvalidInstances = instances.slice(1, 3);

// Find the instance with an attached Ubuntu Pro token (result:success, attached:true)
const instanceWithToken = instances.find(
  (i) => i.ubuntu_pro_info?.result === "success" && i.ubuntu_pro_info?.attached,
);

describe("TokenFormBase", () => {
  const user = userEvent.setup();

  afterEach(() => {
    setEndpointStatus("default");
  });

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

  it("shows confirmation modal when some selected instances are invalid", async () => {
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

  it("shows instances that will be attached to token in confirmation modal", async () => {
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
    await user.type(tokenInput, "test-token");
    await user.click(screen.getByRole("button", { name: /attach token/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/will be attached to this token/i),
      ).toBeInTheDocument();
    });
  });

  it("shows instances that will override existing token in confirmation modal", async () => {
    assert(instanceWithToken, "Expected instance with token at index 11");
    renderWithProviders(
      <TokenFormBase
        selectedInstances={[instanceWithToken, ...allInvalidInstances]}
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
    await user.type(tokenInput, "test-token");
    await user.click(screen.getByRole("button", { name: /attach token/i }));

    await waitFor(() => {
      expect(screen.getByText(/attach ubuntu pro token/i)).toBeInTheDocument();
    });

    const listItems = screen.getAllByRole("listitem");
    expect(
      listItems.some((li) => li.textContent?.includes("will override")),
    ).toBe(true);
  });

  it("shows error modal when all selected instances are invalid", async () => {
    renderWithProviders(
      <TokenFormBase
        selectedInstances={allInvalidInstances}
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
    await user.type(tokenInput, "test-token");
    await user.click(screen.getByRole("button", { name: /attach token/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/token attachment unavailable/i),
      ).toBeInTheDocument();
      expect(
        screen.queryByText(/confirming this action means/i),
      ).not.toBeInTheDocument();
    });
  });

  it("closes error modal when Close button is clicked", async () => {
    renderWithProviders(
      <TokenFormBase
        selectedInstances={allInvalidInstances}
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
    await user.type(tokenInput, "test-token");
    await user.click(screen.getByRole("button", { name: /attach token/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/token attachment unavailable/i),
      ).toBeInTheDocument();
    });

    const [closeButton] = screen.getAllByRole("button", { name: /close/i });

    assert(closeButton);

    await user.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByText(/token attachment unavailable/i),
      ).not.toBeInTheDocument();
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

  it("confirms attachment and shows success notification", async () => {
    renderWithProviders(
      <TokenFormBase
        selectedInstances={selectedInstances}
        submitButtonText="Attach token"
        notification={{
          title: "Token attached",
          message: "Token was attached successfully.",
        }}
      >
        <p>Test children content</p>
      </TokenFormBase>,
    );

    const tokenInput = screen.getByLabelText(/token/i);
    await user.type(tokenInput, "test-token");
    await user.click(screen.getByRole("button", { name: /attach token/i }));

    await waitFor(() => {
      expect(screen.getByText(/attach ubuntu pro token/i)).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => {
      expect(screen.getByText("Token attached")).toBeInTheDocument();
    });
  });

  it("shows info notification when no valid instances remain after confirming", async () => {
    renderWithProviders(
      <TokenFormBase
        selectedInstances={[]}
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
    await user.type(tokenInput, "test-token");
    await user.click(screen.getByRole("button", { name: /attach token/i }));

    await waitFor(() => {
      expect(screen.getByText(/attach ubuntu pro token/i)).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => {
      expect(screen.getByText(/no instances to attach/i)).toBeInTheDocument();
    });
  });

  it("attaches directly without showing modal when no instances are invalid", async () => {
    setEndpointStatus({ status: "empty", path: "computers-pro-empty" });

    renderWithProviders(
      <TokenFormBase
        selectedInstances={selectedInstances}
        submitButtonText="Attach token"
        notification={{
          title: "Token attached",
          message: "Token was attached successfully.",
        }}
      >
        <p>Test children content</p>
      </TokenFormBase>,
    );

    const tokenInput = screen.getByLabelText(/token/i);
    await user.type(tokenInput, "test-token");
    await user.click(screen.getByRole("button", { name: /attach token/i }));

    await waitFor(() => {
      expect(screen.getByText("Token attached")).toBeInTheDocument();
    });

    expect(
      screen.queryByText(/attach ubuntu pro token/i),
    ).not.toBeInTheDocument();
  });

  it("shows View details button in notification and allows clicking it", async () => {
    renderWithProviders(
      <TokenFormBase
        selectedInstances={selectedInstances}
        submitButtonText="Attach token"
        notification={{
          title: "Token attached",
          message: "Token was attached successfully.",
        }}
      >
        <p>Test children content</p>
      </TokenFormBase>,
    );

    const tokenInput = screen.getByLabelText(/token/i);
    await user.type(tokenInput, "test-token");
    await user.click(screen.getByRole("button", { name: /attach token/i }));

    await waitFor(() => {
      expect(screen.getByText(/attach ubuntu pro token/i)).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => {
      expect(screen.getByText("Token attached")).toBeInTheDocument();
    });

    const viewDetailsButton = screen.getByRole("button", {
      name: /view details/i,
    });
    expect(viewDetailsButton).toBeInTheDocument();
    await user.click(viewDetailsButton);
  });
});
