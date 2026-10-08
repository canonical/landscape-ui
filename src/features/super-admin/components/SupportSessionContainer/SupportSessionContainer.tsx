import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import StaticLink from "@/components/layout/StaticLink";
import useAuth from "@/hooks/useAuth";
import useDebug from "@/hooks/useDebug";
import useSwitchAccount from "@/hooks/useSwitchAccount";
import { ROUTES } from "@/libs/routes";
import SupportSessionTemplate from "@/templates/support-session";
import type { FC, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { useGetStaffAccount } from "../../api";
import { getErrorMessage } from "../../helpers";
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
  const debug = useDebug();
  const { user } = useAuth();
  const { switchAccount } = useSwitchAccount();
  const { staffAccount, staffAccountError, isGettingStaffAccount } =
    useGetStaffAccount(name);
  const { exitSupportSession, isExitingSupportSession } =
    useExitSupportSession(name);

  // Kept with its account name so that a change of `name` while mounted
  // (back/forward, an edited URL) tries the new account afresh.
  const [failedEntry, setFailedEntry] = useState<FailedEntry | null>(null);
  // Leaving switches the session back before navigating away; the account
  // must not be re-entered in between.
  const [isLeaving, setIsLeaving] = useState(false);
  // A ref, not the mutation's pending flag: that flag only turns on in the
  // next render, after a doubled effect (StrictMode) has already switched twice.
  const isEntering = useRef(false);

  const hasUser = !!user;
  const isInAccount = user?.current_account === name;
  const enterError = failedEntry?.name === name ? failedEntry.error : null;

  useEffect(() => {
    if (
      !hasUser ||
      isInAccount ||
      isLeaving ||
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
      });
  }, [hasUser, isInAccount, isLeaving, name]);

  const exit = async () => {
    setIsLeaving(true);

    try {
      await exitSupportSession();
    } catch (error) {
      debug(error);
      setIsLeaving(false);
    }
  };

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
      accountName={name}
      accountTitle={staffAccount.company}
      onExit={exit}
      isExiting={isLeaving || isExitingSupportSession}
    >
      {children}
    </SupportSessionTemplate>
  );
};

export default SupportSessionContainer;
