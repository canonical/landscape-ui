import { useContext } from 'react';
import { AccountsContext } from '../AccountContext';

export default function useAuthAccounts() {
  return useContext(AccountsContext);
}
