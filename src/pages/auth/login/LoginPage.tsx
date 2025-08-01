import type { FC } from "react";
import LoadingState from "@/components/layout/LoadingState";
import {
  ConsentBannerModal,
  LoginMethodsLayout,
  useGetLoginMethods,
} from "@/features/auth";
import AuthTemplate from "@/templates/auth";
import { CONTACT_SUPPORT_TEAM_MESSAGE } from "@/constants";
import useEnv from "@/hooks/useEnv";
import { useBoolean } from "usehooks-ts";

const LoginPage: FC = () => {
  const { displayDisaStigBanner } = useEnv();
  const { value: bannerHidden, setTrue: hideBanner } = useBoolean();

  const { loginMethods, loginMethodsLoading, isLoginMethodsError } =
    useGetLoginMethods();

  return (
    <>
      {!bannerHidden && displayDisaStigBanner && (
        <ConsentBannerModal onClose={hideBanner} />
      )}
      <AuthTemplate title="Sign in to Landscape">
        {loginMethodsLoading ? (
          <LoadingState />
        ) : isLoginMethodsError ? (
          <p className="u-no-margin--bottom">{CONTACT_SUPPORT_TEAM_MESSAGE}</p>
        ) : (
          <LoginMethodsLayout methods={loginMethods} />
        )}
      </AuthTemplate>
    </>
  );
};

export default LoginPage;
