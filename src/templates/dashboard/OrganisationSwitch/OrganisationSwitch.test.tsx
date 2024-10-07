import { AuthContextProps } from "@/context/auth";
import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import useAuth from "../../../hooks/useAuth";
import OrganisationSwitch from "./OrganisationSwitch";
import userEvent from "@testing-library/user-event";
import { authUser } from "@/tests/mocks/auth";

vi.mock("@/hooks/useAuth");

const authProps: AuthContextProps = {
  account: {
    switchable: false,
  },
  logout: vi.fn(),
  authorized: true,
  authLoading: false,
  setUser: vi.fn(),
  updateUser: vi.fn(),
  user: authUser,
  isOidcAvailable: true,
};

const authWithMultipleAccounts: AuthContextProps = {
  ...authProps,
  account: {
    current: "account1",
    options: [
      {
        label: "Account 1",
        value: "account1",
      },
      {
        label: "Account 2",
        value: "account2",
      },
    ],
    switch: vi.fn(),
    switchable: true,
  },
  user: {
    ...authUser,
    accounts: [
      {
        name: "account1",
        title: "Account 1",
        subdomain: null,
        classic_dashboard_url: "",
      },
      {
        name: "account2",
        title: "Account 2",
        subdomain: null,
        classic_dashboard_url: "",
      },
    ],
  },
};

describe("OrganisationSwitch", () => {
  it("renders the component when there are multiple organisations", () => {
    vi.mocked(useAuth).mockReturnValue(authWithMultipleAccounts);

    renderWithProviders(<OrganisationSwitch />);

    expect(screen.getByText(/organisation/i)).toBeInTheDocument();
  });

  it("does not render the component when there is only one organisation", () => {
    vi.mocked(useAuth).mockReturnValue(authProps);

    renderWithProviders(<OrganisationSwitch />);

    expect(screen.queryByText(/organisation/i)).not.toBeInTheDocument();
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

    await userEvent.selectOptions(screen.getByRole("combobox"), "account2");

    expect(
      authWithMultipleAccounts.account.switchable &&
        authWithMultipleAccounts.account.switch,
    ).toHaveBeenCalledWith("account2-token", "account2");
  });
});
