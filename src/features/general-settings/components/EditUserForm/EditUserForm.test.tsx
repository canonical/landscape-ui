import type { AuthContextProps } from "@/context/auth";
import type { EnvContextState } from "@/context/env";
import type { Account } from "@/features/auth";
import useAuth from "@/hooks/useAuth";
import useAuthAccounts from "@/hooks/useAuthAccounts";
import useEnv from "@/hooks/useEnv";
import { setEndpointStatus } from "@/tests/controllers/controller";
import { accountsDefault } from "@/tests/mocks/accounts";
import { authUser } from "@/tests/mocks/auth";
import { renderWithProviders } from "@/tests/render";
import { ENDPOINT_STATUS_API_ERROR_MESSAGE } from "@/tests/server/handlers/_constants";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import EditUserForm from "./EditUserForm";
import { MASKED_VALUE } from "@/constants";

vi.mock("@/hooks/useEnv");
vi.mock("@/hooks/useAuth");
vi.mock("@/hooks/useAuthAccounts");

vi.mocked(useAuthAccounts).mockReturnValue({
  currentAccount: accountsDefault.find(
    (account) => !!account.default,
  ) as Account,
  isOnSubdomain: false,
  options: accountsDefault.map(({ name, title }) => ({
    label: title,
    value: name,
  })),
  handleAccountSwitch: vi.fn(),
});

const props = {
  userDetails: {
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
    oidc_identities: [],
  },
};

const authContextValues: AuthContextProps = {
  logout: vi.fn(),
  authorized: true,
  authLoading: false,
  setUser: vi.fn(),
  user: authUser,
  redirectToExternalUrl: vi.fn(),
  safeRedirect: vi.fn(),
  isFeatureEnabled: vi.fn(),
  hasAccounts: true,
};

const mockSelfHosted: EnvContextState = {
  envLoading: false,
  isSaas: false,
  isSelfHosted: true,
  packageVersion: "",
  revision: "",
  displayDisaStigBanner: false,
};

const mockSaas: EnvContextState = {
  envLoading: false,
  isSaas: true,
  isSelfHosted: false,
  packageVersion: "",
  revision: "",
  displayDisaStigBanner: false,
};

describe("EditUserForm", () => {
  beforeEach(() => {
    setEndpointStatus("default");
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
        "Default organization",
      ]);

      const saveButton = screen.getByRole("button", { name: /save changes/i });
      expect(saveButton).toBeInTheDocument();
      expect(saveButton).toHaveAttribute("aria-disabled");
    });

    it("enables save button when form values change", async () => {
      renderWithProviders(<EditUserForm {...props} />);

      const nameInput = screen.getByRole("textbox");
      await userEvent.type(nameInput, " Updated");

      const saveButton = screen.getByRole("button", { name: /save changes/i });
      expect(saveButton).not.toHaveAttribute("aria-disabled");
      expect(saveButton).toBeEnabled();

      await userEvent.click(saveButton);

      expect(
        await screen.findByText("User details updated successfully"),
      ).toBeInTheDocument();
      expect(authContextValues.setUser).toHaveBeenCalledWith({
        ...authUser,
        email: props.userDetails.email,
        name: `${props.userDetails.name} Updated`,
      });
    });

    it("should show error notification if editUserDetails throws an error", async () => {
      setEndpointStatus({ status: "error", path: "person" });
      renderWithProviders(<EditUserForm {...props} />);

      const nameInput = screen.getByRole("textbox");
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, "error");

      const saveButton = screen.getByRole("button", { name: /save changes/i });
      expect(saveButton).not.toHaveAttribute("aria-disabled");
      expect(saveButton).toBeEnabled();

      await userEvent.click(saveButton);

      expect(
        await screen.findByText(ENDPOINT_STATUS_API_ERROR_MESSAGE),
      ).toBeInTheDocument();
    });

    it("calls editUserDetails and setPreferredAccount when form is submitted", async () => {
      renderWithProviders(<EditUserForm {...props} />);

      const nameInput = screen.getByRole("textbox");
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, "Updated Name");

      const saveButton = screen.getByRole("button", { name: /save changes/i });
      await userEvent.click(saveButton);

      expect(
        await screen.findByText("User details updated successfully"),
      ).toBeInTheDocument();
      expect(saveButton).toHaveAttribute("aria-disabled");
    });

    it("should show an empty option for default organisation select if user has not yet selected one", async () => {
      renderWithProviders(
        <EditUserForm
          userDetails={{ ...props.userDetails, preferred_account: null }}
        />,
      );

      const organisationSelect = screen.getByRole("combobox", {
        name: /default organization/i,
      });

      expect(organisationSelect).toHaveValue("");
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
        ...props.userDetails,
        allowable_emails: ["test@example.com"],
      };
      renderWithProviders(<EditUserForm userDetails={mockUser} />);

      const changePasswordButton = screen.queryByRole("button", {
        name: /change password/i,
      });
      expect(changePasswordButton).not.toBeInTheDocument();

      const emailInput = screen.getByDisplayValue(mockUser.email);
      expect(emailInput).toBeDisabled();

      const passwordInput = screen.getByDisplayValue(MASKED_VALUE);
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
