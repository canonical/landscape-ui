import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AccountCreationSelfHostedForm from "./AccountCreationSelfHostedForm";

const createStandaloneAccountMock = vi.fn();
const signInMock = vi.fn();
const setUserMock = vi.fn();
const navigateMock = vi.fn();

vi.mock("react-router", async () => ({
  ...(await vi.importActual("react-router")),
  useNavigate: () => navigateMock,
}));

vi.mock("@/hooks/useAuth", () => ({
  default: () => ({ setUser: setUserMock }),
}));

vi.mock("../../api", () => ({
  useCreateStandaloneAccount: () => ({
    createStandaloneAccount: createStandaloneAccountMock,
    isCreatingStandaloneAccount: false,
  }),
}));

vi.mock("@/features/auth", async () => {
  const actual = await vi.importActual("@/features/auth");
  return {
    ...actual,
    useLogin: () => ({
      login: signInMock,
      isLoggingIn: false,
    }),
  };
});

describe("AccountCreationSelfHostedForm", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
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
    renderWithProviders(<AccountCreationSelfHostedForm />);

    const submitButton = screen.getByRole("button", { name: "Create account" });
    expect(submitButton).toBeDisabled();

    await user.type(screen.getByLabelText("Full name"), "John Doe");
    await user.type(
      screen.getByLabelText("Email address"),
      "john.doe@example.com",
    );
    await user.type(screen.getByLabelText("Password"), "Password1234");

    expect(submitButton).toBeEnabled();
  });

  it("shows validation error for invalid email", async () => {
    renderWithProviders(<AccountCreationSelfHostedForm />);

    await user.type(screen.getByLabelText("Email address"), "invalid-email");

    await user.tab();

    expect(
      await screen.findByText("Invalid email address"),
    ).toBeInTheDocument();
  });

  it("submits the form calls create and login", async () => {
    createStandaloneAccountMock.mockResolvedValue({});
    signInMock.mockResolvedValue({ data: { current_account: "test" } });

    renderWithProviders(<AccountCreationSelfHostedForm />);

    await user.type(screen.getByLabelText("Full name"), "John Doe");
    await user.type(
      screen.getByLabelText("Email address"),
      "john.doe@example.com",
    );
    await user.type(screen.getByLabelText("Password"), "Password1234");

    const submitButton = screen.getByRole("button", { name: "Create account" });
    await user.click(submitButton);

    expect(createStandaloneAccountMock).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john.doe@example.com",
      password: "Password1234",
    });

    await vi.waitFor(() => {
      expect(signInMock).toHaveBeenCalledWith({
        email: "john.doe@example.com",
        password: "Password1234",
      });
    });
  });
});
