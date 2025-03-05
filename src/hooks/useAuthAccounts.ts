import { useContext } from "react";
import { AccountsContext } from "@/context/accounts";

export default function useAuthAccounts() {
  return useContext(AccountsContext);
}
