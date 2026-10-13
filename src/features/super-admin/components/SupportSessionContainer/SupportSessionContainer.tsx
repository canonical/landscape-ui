import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import StaticLink from "@/components/layout/StaticLink";
import useAuth from "@/hooks/useAuth";
import useSwitchAccount from "@/hooks/useSwitchAccount";
import { ROUTES } from "@/libs/routes";
import SupportSessionTemplate from "@/templates/support-session";
import type { FC, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useGetStaffAccount } from "../../api";
import { getErrorMessage, getSupportSessionNavigation } from "../../helpers";
import { useExitSupportSession } from "../../hooks";

const NOT_FOUND_STATUS = 404;

interface SupportSessionContainerProps {
  readonly name: string;
  readonly children: ReactNode;
}

/** A refused entry, remembered with the account it was for. */
interface FailedEntry {
  readonly name: string;
  readonly error: unknown;
}

/**
 * Keeps the session in the account named `name` (entering it after a reload
 * or from a link) and frames `children`, the account's pages, as a support
 * session.
 */
const SupportSessionContainer: FC<SupportSessionContainerProps> = ({
  name,
  children,
}) => {
  const { user } = useAuth();
  const { switchAccount } = useSwitchAccount();
  const { staffAccount, staffAccountError, isGettingStaffAccount } =
    useGetStaffAccount(name);
  const { exitSupportSession } = useExitSupportSession(name);

  // Kept with its account name so that a change of `name` while mounted
  // (back/forward, an edited URL) tries the new account afresh.
  const [failedEntry, setFailedEntry] = useState<FailedEntry | null>(null);
  // A ref, not the mutation's pending flag: that flag only turns on in the
  // next render, after a doubled effect (StrictMode) has already switched twice.
  const isEntering = useRef(false);
  // Counted so that the entry effect runs again once a switch settles: the
  // URL may name another account by then, and a refused switch changes
  // nothing else the effect depends on.
  const [settledEntries, setSettledEntries] = useState(0);

  const hasUser = !!user;
  // Entered only once the account is known to exist: a switch must not go
  // out alongside a lookup that may fail.
  const hasStaffAccount = !!staffAccount;
  const isInAccount = user?.current_account === name;
  const enterError = failedEntry?.name === name ? failedEntry.error : null;

  useEffect(() => {
    if (
      !hasUser ||
      !hasStaffAccount ||
      isInAccount ||
      isEntering.current ||
      enterError
    ) {
      return;
    }

    isEntering.current = true;

    switchAccount(name)
      .catch((error: unknown) => {
        setFailedEntry({ name, error });
      })
      .finally(() => {
        isEntering.current = false;
        setSettledEntries((count) => count + 1);
      });
  }, [hasUser, hasStaffAccount, isInAccount, settledEntries, name]);

  if (staffAccountError?.response?.status === NOT_FOUND_STATUS) {
    return (
      <EmptyState
        title="Account not found"
        body={`There is no account named "${name}" in this deployment.`}
        cta={[
          <StaticLink key="accounts" to={ROUTES.superAdmin.accounts()}>
            Back to accounts
          </StaticLink>,
        ]}
      />
    );
  }

  if (staffAccountError) {
    throw staffAccountError;
  }

  if (enterError) {
    return (
      <EmptyState
        title={`Could not enter ${staffAccount?.company ?? name}`}
        body={getErrorMessage(enterError)}
        cta={[
          <StaticLink key="account" to={ROUTES.superAdmin.account(name)}>
            Back to the account
          </StaticLink>,
        ]}
      />
    );
  }

  if (isGettingStaffAccount || !staffAccount || !isInAccount) {
    return <LoadingState centerOnScreen />;
  }

  return (
    <SupportSessionTemplate
      accountTitle={staffAccount.company}
      navigation={getSupportSessionNavigation(name)}
      // The logo stays inside the session: the dashboard root would show the
      // entered account without the frame or the way out.
      logoPath={ROUTES.superAdmin.session(name)}
      onExit={exitSupportSession}
    >
      {children}
    </SupportSessionTemplate>
  );
};

export default SupportSessionContainer;
