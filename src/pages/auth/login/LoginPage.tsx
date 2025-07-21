import type { FC } from "react";
import LoadingState from "@/components/layout/LoadingState";
import { LoginMethodsLayout, useUnsigned } from "@/features/auth";
import AuthTemplate from "@/templates/auth";
import { CONTACT_SUPPORT_TEAM_MESSAGE } from "@/constants";
import useEnv from "@/hooks/useEnv";
import ConsentBannerModal from "../../../features/auth/components/consent-banner";
import { useBoolean } from "usehooks-ts";

const LoginPage: FC = () => {
  const { getLoginMethodsQuery } = useUnsigned();
  const { displayDisaStigBanner } = useEnv();
  const { value: bannerHidden, setTrue: hideBanner } = useBoolean();

  const {
    data: getLoginMethodsQueryResult,
    isLoading,
    isError,
  } = getLoginMethodsQuery();

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
