import { AuthTemplate, LoadingState } from "@landscape/ui";
import type { FC } from "react";
import { useUnsigned } from "../../../../../libs/shared/context/src/AuthContext/api";

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
        <p className="u-no-margin--bottom">error todo change</p>
      ) : (
        <LoginMethodsLayout
          methods={getLoginMethodsQueryResult?.data ?? null}
        />
      )}
    </AuthTemplate>
  );
};

export default LoginPage;
