import { Account, useAuth } from '../AuthContext';
import { SelectOption } from '@landscape/types';
import type { FC, ReactNode } from 'react';
import { createContext, useMemo } from 'react';

export interface AccountsContextProps {
  currentAccount: Account;
  isOnSubdomain: boolean;
  options: SelectOption[];
  handleAccountSwitch: (newToken: string, newAccount: string) => void;
}

const initialState: AccountsContextProps = {
  currentAccount: {
    name: '',
    title: '',
    subdomain: '',
    classic_dashboard_url: '',
  },
  isOnSubdomain: false,
  options: [],
  handleAccountSwitch: () => undefined,
};

export const AccountsContext =
  createContext<AccountsContextProps>(initialState);

interface AccountsProviderProps {
  readonly children: ReactNode;
}

const AccountsProvider: FC<AccountsProviderProps> = ({ children }) => {
  const { user, setUser } = useAuth();

  const handleAccountSwitch = (newToken: string, newAccount: string) => {
    if (!user) {
      return;
    }

    const newUser = {
      ...user,
      current_account: newAccount,
      token: newToken,
    };

    setUser(newUser);
  };

  const currentAccount = useMemo<AccountsContextProps['currentAccount']>(() => {
    if (!user) {
      return initialState.currentAccount;
    }

    return (
      user.accounts.find(({ name }) => name === user.current_account) ??
      initialState.currentAccount
    );
  }, [user?.current_account, user?.accounts]);

  const isOnSubdomain = useMemo<AccountsContextProps['isOnSubdomain']>(() => {
    if (!user) {
      return false;
    }

    return user.accounts.some(
      ({ name, subdomain }) => !!subdomain && name === user.current_account,
    );
  }, [user?.accounts]);

  const options = useMemo<SelectOption[]>(() => {
    if (!user || isOnSubdomain) {
      return [];
    }

    return user.accounts
      .filter(({ subdomain }) => !subdomain)
      .map(({ title, name }) => ({
        label: title,
        value: name,
      }));
  }, [user, isOnSubdomain]);

  return (
    <AccountsContext.Provider
      value={{
        currentAccount,
        isOnSubdomain,
        options,
        handleAccountSwitch,
      }}
    >
      {children}
    </AccountsContext.Provider>
  );
};

export default AccountsProvider;
