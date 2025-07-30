import type { FC } from "react";
import LoadingState from "@/components/layout/LoadingState";
import { LoginMethodsLayout, useUnsigned } from "@/features/auth";
import AuthTemplate from "@/templates/auth";
import { CONTACT_SUPPORT_TEAM_MESSAGE } from "@/constants";
import useEnv from "@/hooks/useEnv";
import { ConsentBannerModal } from "@/features/auth";
import { useBoolean } from "usehooks-ts";
import { useGetEmployeeLoginMethods } from "@/features/attach";
import usePageParams from "@/hooks/usePageParams";

const LoginPage: FC = () => {
  const { code } = usePageParams();
  const { getLoginMethodsQuery } = useUnsigned();
  const { displayDisaStigBanner } = useEnv();
  const { value: bannerHidden, setTrue: hideBanner } = useBoolean();

  const isEmployeeLogin = code !== "";

  const regularLoginQuery = getLoginMethodsQuery({
    enabled: !isEmployeeLogin,
  });

  const employeeLoginQuery = useGetEmployeeLoginMethods({
    enabled: isEmployeeLogin,
  });

  const {
    data: getLoginMethodsQueryResult,
    isLoading,
    isError,
  } = isEmployeeLogin ? employeeLoginQuery : regularLoginQuery;

  return (
    <>
      {!bannerHidden && displayDisaStigBanner && (
        <ConsentBannerModal onClose={hideBanner} />
      )}
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
    </>
  );
};

export default LoginPage;
