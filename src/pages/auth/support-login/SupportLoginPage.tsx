import type { FC } from "react";
import { AvailableProviderList } from "@/features/auth";
import AuthTemplate from "@/templates/auth";

const SupportLoginPage: FC = () => {
  return (
    <AuthTemplate title="Sign in to Landscape">
      <AvailableProviderList
        isStandaloneOidcEnabled={false}
        isUbuntuOneEnabled
        oidcProviders={[]}
      />
    </AuthTemplate>
  );
};

export default SupportLoginPage;
