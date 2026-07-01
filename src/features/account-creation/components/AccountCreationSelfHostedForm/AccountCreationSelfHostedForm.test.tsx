import { HOMEPAGE_PATH } from "@/constants";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AccountCreationSelfHostedForm from "./AccountCreationSelfHostedForm";

const setUserMock = vi.fn();
const navigateMock = vi.fn();

vi.mock("react-router", async () => ({
  ...(await vi.importActual("react-router")),
  useNavigate: () => navigateMock,
}));

vi.mock("@/hooks/useAuth", () => ({
  default: () => ({ setUser: setUserMock }),
}));

describe("AccountCreationSelfHostedForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setEndpointStatus({
      status: "variant",
      path: "standalone-account",
      response: { exists: false },
    });
  });

  afterEach(() => {
    setEndpointStatus("default");
  });

  it("renders the form correctly", () => {
    renderWithProviders(<AccountCreationSelfHostedForm />);

    expect(
      screen.getByText("Create a new Landscape account"),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Full name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create account" }),
    ).toBeInTheDocument();
  });

  it("correctly disables button based on form validity", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AccountCreationSelfHostedForm />);

    const submitButton = screen.getByRole("button", { name: "Create account" });
    expect(submitButton).toHaveAttribute("aria-disabled", "true");

    await user.type(screen.getByLabelText("Full name"), "John Doe");
    await user.type(
      screen.getByLabelText("Email address"),
      "john.doe@example.com",
    );
    await user.type(screen.getByLabelText("Password"), "Password1234");

    expect(submitButton).not.toHaveAttribute("aria-disabled");
    expect(submitButton).toBeEnabled();
  });

  it("shows validation error for invalid email", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AccountCreationSelfHostedForm />);

    await user.type(screen.getByLabelText("Email address"), "invalid-email");

    await user.tab();

    expect(
      await screen.findByText("Invalid email address"),
    ).toBeInTheDocument();
  });

  it("submits the form calls create and login", async () => {
    const user = userEvent.setup();

    renderWithProviders(<AccountCreationSelfHostedForm />);

    await user.type(screen.getByLabelText("Full name"), "John Doe");
    await user.type(
      screen.getByLabelText("Email address"),
      "john.doe@example.com",
    );
    await user.type(screen.getByLabelText("Password"), "Password1234");

    const submitButton = screen.getByRole("button", { name: "Create account" });
    await user.click(submitButton);

    await vi.waitFor(() => {
      expect(setUserMock).toHaveBeenCalled();
      expect(navigateMock).toHaveBeenCalledWith(HOMEPAGE_PATH, {
        replace: true,
      });
    });
  });
});
