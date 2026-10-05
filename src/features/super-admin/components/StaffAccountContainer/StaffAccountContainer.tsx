import EmptyState from "@/components/layout/EmptyState";
import LoadingState from "@/components/layout/LoadingState";
import StaticLink from "@/components/layout/StaticLink";
import { ROUTES } from "@/libs/routes";
import type { FC } from "react";
import { useGetStaffAccount } from "../../api";
import StaffAccountTabs from "../StaffAccountTabs";

const NOT_FOUND_STATUS = 404;

interface StaffAccountContainerProps {
  readonly name: string;
}

const StaffAccountContainer: FC<StaffAccountContainerProps> = ({ name }) => {
  const { staffAccount, staffAccountError, isGettingStaffAccount } =
    useGetStaffAccount(name);

  if (isGettingStaffAccount) {
    return <LoadingState />;
  }

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

  if (!staffAccount) {
    return null;
  }

  return <StaffAccountTabs staffAccount={staffAccount} />;
};

export default StaffAccountContainer;
