import { AuthContextProps, AuthUser } from "@/context/auth";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import useAuth from "../../../hooks/useAuth";
import OrganisationSwitch from "./OrganisationSwitch";
import userEvent from "@testing-library/user-event";

vi.mock("@/hooks/useAuth");

const mockUser: AuthUser = {
  accounts: [{ name: "test-account", title: "Test Account" }],
  current_account: "test-account",
  email: "example@mail.com",
  name: "Test User",
  token: "test-token",
};

const authProps: AuthContextProps = {
  logout: vi.fn(),
  authorized: true,
  authLoading: false,
  setUser: vi.fn(),
  switchAccount: vi.fn(),
  updateUser: vi.fn(),
  user: mockUser,
};

const authWithMultipleAccounts = {
  ...authProps,
  user: {
    ...mockUser,
    accounts: [
      { name: "account1", title: "Account 1" },
      { name: "account2", title: "Account 2" },
    ],
  },
};

describe("OrganisationSwitch", () => {
  it("renders the component when there are multiple organisations", () => {
    vi.mocked(useAuth).mockReturnValue(authWithMultipleAccounts);

    renderWithProviders(<OrganisationSwitch />);

    expect(screen.getByText("organisation")).toBeInTheDocument();
  });

  it("does not render the component when there is only one organisation", () => {
    vi.mocked(useAuth).mockReturnValue(authProps);

    renderWithProviders(<OrganisationSwitch />);

    expect(screen.queryByText("organisation")).not.toBeInTheDocument();
  });

  it("sets the initial account state correctly", () => {
    vi.mocked(useAuth).mockReturnValue(authWithMultipleAccounts);

    renderWithProviders(<OrganisationSwitch />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("account1");
  });

  it("changes the organisation", async () => {
    vi.mocked(useAuth).mockReturnValue(authWithMultipleAccounts);

    renderWithProviders(<OrganisationSwitch />);

    const select = screen.getByRole("combobox");
    await userEvent.selectOptions(select, "account2");
    expect(select).toHaveValue("account2");
  });
});
