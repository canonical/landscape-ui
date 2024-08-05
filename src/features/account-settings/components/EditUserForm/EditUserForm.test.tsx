import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import EditUserForm from "./EditUserForm";
import useEnv from "@/hooks/useEnv";
import useAuth from "@/hooks/useAuth";
import { AuthContextProps } from "@/context/auth";

vi.mock("@/hooks/useEnv");
vi.mock("@/hooks/useAuth");

const props = {
  user: {
    name: "Test User",
    email: "test@example.com",
    timezone: "UTC",
    preferred_account: "test-account",
    allowable_emails: ["test@example.com", "another@example.com"],
    accounts: [
      { name: "test-account", title: "Test Account", roles: ["admin"] },
      { name: "another-account", title: "Another Account", roles: ["admin"] },
    ],
    identity: "",
    last_login_host: "",
    last_login_time: "",
  },
};

const authContextValues: AuthContextProps = {
  logout: vi.fn(),
  authorized: true,
  authLoading: false,
  setUser: vi.fn(),
  switchAccount: vi.fn(),
  updateUser: vi.fn(),
  user: {
    accounts: [{ name: "test-account", title: "Test Account" }],
    current_account: "test-account",
    email: "example@mail.com",
    name: "Test User",
    token: "test-token",
  },
};

const mockSelfHosted = {
  isSaas: false,
  isSelfHosted: true,
  packageVersion: "",
  revision: "",
};

const mockSaas = {
  isSaas: true,
  isSelfHosted: false,
  packageVersion: "",
  revision: "",
};

describe("EditUserForm", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(useEnv).mockReturnValue(mockSelfHosted);
    vi.mocked(useAuth).mockReturnValue(authContextValues);
  });

  describe("tests for saas and self-hosted", () => {
    it("renders correct form fields", () => {
      const { container } = renderWithProviders(<EditUserForm {...props} />);

      expect(container).toHaveTexts([
        "Name",
        "Email address",
        "Current",
        "Timezone",
        "Default organisation",
      ]);

      const saveButton = screen.getByRole("button", { name: /save changes/i });
      expect(saveButton).toBeInTheDocument();
      expect(saveButton).toBeDisabled();
    });

    it("enables save button when form values change", async () => {
      renderWithProviders(<EditUserForm {...props} />);

      const nameInput = screen.getByRole("textbox");
      await userEvent.type(nameInput, " Updated");

      const saveButton = screen.getByRole("button", { name: /save changes/i });
      expect(saveButton).toBeEnabled();
    });

    it("calls editUserDetails and setPreferredAccount when form is submitted", async () => {
      renderWithProviders(<EditUserForm {...props} />);

      const nameInput = screen.getByRole("textbox");
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, "Updated Name");

      const saveButton = screen.getByRole("button", { name: /save changes/i });
      await userEvent.click(saveButton);

      expect(saveButton).toBeDisabled();
    });
  });

  describe("Saas Environment", () => {
    beforeEach(() => {
      vi.mocked(useEnv).mockReturnValue(mockSaas);
    });

    it("renders Ubuntu One link when in SaaS environment", () => {
      renderWithProviders(<EditUserForm {...props} />);

      const ubuntuOneLinks = screen.getAllByText("Ubuntu One");
      expect(ubuntuOneLinks).toHaveLength(2);
    });

    it("doesn't render change password button in SaaS environment", () => {
      renderWithProviders(<EditUserForm {...props} />);

      const changePasswordButton = screen.queryByRole("button", {
        name: /change password/i,
      });
      expect(changePasswordButton).not.toBeInTheDocument();
    });

    it("renders disabled fields in SaaS environment", () => {
      const mockUser = {
        ...props.user,
        allowable_emails: ["test@example.com"],
      };
      renderWithProviders(<EditUserForm user={mockUser} />);

      const changePasswordButton = screen.queryByRole("button", {
        name: /change password/i,
      });
      expect(changePasswordButton).not.toBeInTheDocument();

      const emailInput = screen.getByDisplayValue(mockUser.email);
      expect(emailInput).toBeDisabled();

      const passwordInput = screen.getByDisplayValue("****************");
      expect(passwordInput).toBeDisabled();
    });
  });

  describe("Self-hosted environment", () => {
    beforeEach(() => {
      vi.mocked(useEnv).mockReturnValue(mockSelfHosted);
      renderWithProviders(<EditUserForm {...props} />);
    });

    it("renders change password button in self-hosted environment", async () => {
      const changePasswordButton = screen.getByRole("button", {
        name: /change password/i,
      });
      expect(changePasswordButton).toBeInTheDocument();

      await userEvent.click(changePasswordButton);

      const changePassword = await screen.findByRole("heading", {
        name: /change password/i,
      });
      expect(changePassword).toBeInTheDocument();
    });
  });
});
