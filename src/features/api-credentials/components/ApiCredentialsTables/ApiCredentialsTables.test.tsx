import type { UserDetails } from "@/features/general-settings";
import { resetScreenSize, setScreenSize } from "@/tests/helpers";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import type { Credential } from "../../types";
import ApiCredentialsTables from "./ApiCredentialsTables";

const mockUser: UserDetails = {
  name: "test-name",
  email: "test-email@email.com",
  allowable_emails: ["test-email@email.com"],
  identity: "test-identity",
  last_login_host: "test-host",
  last_login_time: "test-time",
  preferred_account: "account1",
  timezone: "test-timezone",
  oidc_identities: [],
  accounts: [
    {
      name: "account1",
      title: "Account 1",
      roles: ["role1", "role2"],
    },
    {
      name: "account2",
      title: "Account 2",
      roles: ["role3"],
    },
  ],
};

const mockCredentials: Credential[] = [
  {
    account_title: "Account 1",
    account_name: "account1",
    endpoint: "https://api.example.com/account1",
    access_key: "",
    secret_key: "",
    exports: "",
  },
  {
    account_title: "Account 2",
    account_name: "account2",
    endpoint: "https://api.example.com/account2",
    access_key: "access-key-2",
    secret_key: "secret-key-2",
    exports: "",
  },
];

describe("ApiCredentialsTables", () => {
  afterEach(() => {
    resetScreenSize();
  });

  it("renders the table in desktop view", () => {
    setScreenSize("large");

    renderWithProviders(
      <ApiCredentialsTables user={mockUser} credentials={mockCredentials} />,
    );

    expect(screen.getAllByRole("table")).toHaveLength(mockUser.accounts.length);
    mockUser.accounts.forEach((account) => {
      expect(screen.getByText(account.name)).toBeInTheDocument();
      expect(screen.getByText(account.roles.join(", "))).toBeInTheDocument();
    });
  });

  it("renders the mobile view when screen is small", () => {
    setScreenSize("small");

    renderWithProviders(
      <ApiCredentialsTables user={mockUser} credentials={mockCredentials} />,
    );

    const tables = screen.queryAllByRole("table");
    expect(tables).toHaveLength(0);

    mockUser.accounts.forEach((account) => {
      expect(screen.getByText(account.name)).toBeInTheDocument();
      expect(screen.getByText(account.roles.join(", "))).toBeInTheDocument();
    });
  });

  it("displays 'Generate API credentials' button when no credentials exist", () => {
    setScreenSize("large");

    renderWithProviders(
      <ApiCredentialsTables user={mockUser} credentials={mockCredentials} />,
    );

    const generateButton = screen.getByText("Generate API credentials");
    expect(generateButton).toBeInTheDocument();
  });

  it("displays 'Regenerate API credentials' button when credentials exist", () => {
    setScreenSize("large");

    renderWithProviders(
      <ApiCredentialsTables user={mockUser} credentials={mockCredentials} />,
    );

    const regenerateButtons = screen.getByText("Regenerate API credentials");
    expect(regenerateButtons).toBeInTheDocument();
  });

  it("handles generate/regenerate button click", async () => {
    setScreenSize("large");

    renderWithProviders(
      <ApiCredentialsTables user={mockUser} credentials={mockCredentials} />,
    );

    const regenerateButton = screen.getAllByText(
      "Regenerate API credentials",
    )[0];
    await userEvent.click(regenerateButton);
  });
});
