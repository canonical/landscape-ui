import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import StaticLink from "@/components/layout/StaticLink";
import useAuth from "@/hooks/useAuth";
import useSwitchAccount from "@/hooks/useSwitchAccount";
import { ROUTES } from "@/libs/routes";
import type { ApiError } from "@/types/api/ApiError";
import SupportSessionTemplate from "@/templates/support-session";
import type { AxiosError } from "axios";
import { isAxiosError } from "axios";
import type { FC, ReactNode } from "react";
import { useEffect, useState } from "react";
import { useGetStaffAccount } from "../../api";
import { useExitSupportSession } from "../../hooks";

const NOT_FOUND_STATUS = 404;

interface SupportSessionContainerProps {
  readonly name: string;
  readonly children: ReactNode;
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
  const { switchAccount, isSwitchingAccount } = useSwitchAccount();
  const { staffAccount, staffAccountError, isGettingStaffAccount } =
    useGetStaffAccount(name);
  const { exitSupportSession, isExitingSupportSession } =
    useExitSupportSession(name);

  const [enterError, setEnterError] = useState<AxiosError<ApiError> | null>(
    null,
  );
  // Leaving switches the session back before navigating away; the account
  // must not be re-entered in between.
  const [isLeaving, setIsLeaving] = useState(false);

  const hasUser = !!user;
  const isInAccount = user?.current_account === name;

  useEffect(() => {
    if (
      !hasUser ||
      isInAccount ||
      isLeaving ||
      isSwitchingAccount ||
      enterError
    ) {
      return;
    }

    switchAccount(name).catch((error: unknown) => {
      if (isAxiosError<ApiError>(error)) {
        setEnterError(error);
      }
    });
  }, [hasUser, isInAccount, isLeaving, name]);

  const exit = async () => {
    setIsLeaving(true);

    await exitSupportSession();
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
        body={enterError.response?.data.message ?? enterError.message}
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
