import { renderWithProviders } from "@/tests/render";
import { screen } from "@testing-library/react";
import { beforeEach } from "vitest";
import type { AccountsContextProps } from "@/context/accounts";
import useAuthAccounts from "@/hooks/useAuthAccounts";
import OrganisationSwitch from "./OrganisationSwitch";
import userEvent from "@testing-library/user-event";
import useSidePanel from "@/hooks/useSidePanel";
import { accountsDefault, accountsForSubdomain } from "@/tests/mocks/accounts";
import type { Account } from "@/features/auth";

vi.mock("@/hooks/useAuthAccounts");
vi.mock("@/hooks/useSidePanel");

const subdomainAccounts: AccountsContextProps = {
  currentAccount: accountsForSubdomain.find(
    ({ subdomain }) => !!subdomain,
  ) as Account,
  isOnSubdomain: true,
  options: [],
  handleAccountSwitch: vi.fn(),
};

const defaultAccounts: AccountsContextProps = {
  currentAccount: accountsDefault.find(
    (account) => !!account.default,
  ) as Account,
  isOnSubdomain: false,
  options: accountsDefault.map(({ name, title }) => ({
    label: title,
    value: name,
  })),
  handleAccountSwitch: vi.fn(),
};

const closeSidePanel = vi.fn();

const SECOND_ACCOUNT_INDEX = 1;

describe("OrganisationSwitch", () => {
  beforeEach(() => {
    vi.mocked(useSidePanel, { partial: true }).mockReturnValue({
      closeSidePanel,
    });
  });

  it("should render info item when on subdomain", () => {
    vi.mocked(useAuthAccounts).mockReturnValue(subdomainAccounts);

    renderWithProviders(<OrganisationSwitch />);

    expect(screen.queryByText(/organisation/i)).toBeInTheDocument();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("should render info item when one option", () => {
    vi.mocked(useAuthAccounts).mockReturnValue({
      ...defaultAccounts,
      options: [
        {
          label: defaultAccounts.currentAccount.title,
          value: defaultAccounts.currentAccount.name,
        },
      ],
    });

    renderWithProviders(<OrganisationSwitch />);

    expect(screen.queryByText(/organisation/i)).toBeInTheDocument();
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  describe("with multiple organisations", () => {
    beforeEach(() => {
      vi.mocked(useAuthAccounts).mockReturnValue(defaultAccounts);
      renderWithProviders(<OrganisationSwitch />);
    });

    it("should render select if there are multiple organisations", () => {
      expect(
        screen.getByRole("combobox", { name: /organisation/i }),
      ).toBeInTheDocument();
    });

    it("should set the initial organisation correctly", () => {
      const select = screen.getByRole("combobox");
      expect(select).toHaveValue(defaultAccounts.currentAccount.name);
    });

    it("should change the organisation and close side panel", async () => {
      await userEvent.selectOptions(
        screen.getByRole("combobox"),
        defaultAccounts.options[SECOND_ACCOUNT_INDEX].value,
      );

      expect(defaultAccounts.handleAccountSwitch).toHaveBeenCalledWith(
        `${defaultAccounts.options[SECOND_ACCOUNT_INDEX].value}-token`,
        defaultAccounts.options[SECOND_ACCOUNT_INDEX].value,
      );

      expect(closeSidePanel).toHaveBeenCalled();
    });
  });
});
