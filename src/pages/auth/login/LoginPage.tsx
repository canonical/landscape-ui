import { FC } from "react";
import LoadingState from "@/components/layout/LoadingState";
import { LoginMethodsLayout, useUnsigned } from "@/features/auth";
import AuthTemplate from "@/templates/auth";
import { CONTACT_SUPPORT_TEAM_MESSAGE } from "@/constants";

const LoginPage: FC = () => {
  const { getLoginMethodsQuery } = useUnsigned();

  const {
    data: getLoginMethodsQueryResult,
    isLoading,
    isError,
  } = getLoginMethodsQuery();

  return (
    <AuthTemplate title="Sign in to Landscape">
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <p className="u-no-margin--bottom">{CONTACT_SUPPORT_TEAM_MESSAGE}</p>
      ) : (
        <LoginMethodsLayout
          methods={getLoginMethodsQueryResult?.data ?? null}
        />
      )}
    </AuthTemplate>
  );
};

export default LoginPage;
