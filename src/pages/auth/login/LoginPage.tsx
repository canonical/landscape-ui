import { FC } from "react";
import LoadingState from "@/components/layout/LoadingState";
import { LoginMethodsLayout, useUnsigned } from "@/features/auth";
import AuthTemplate from "@/templates/auth";

const LoginPage: FC = () => {
  const { getLoginMethodsQuery } = useUnsigned();

  const {
    data: getLoginMethodsQueryResult,
    isLoading,
    isError,
    error,
  } = getLoginMethodsQuery();

  return (
    <AuthTemplate title="Sign in to Landscape">
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <div>
          <h1>Error</h1>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      ) : (
        <LoginMethodsLayout
          methods={getLoginMethodsQueryResult?.data ?? null}
        />
      )}
    </AuthTemplate>
  );
};

export default LoginPage;
