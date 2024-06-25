import LoadingState from "@/components/layout/LoadingState";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import ApiCredentialsTables from "@/features/account-settings";
import useUserDetails from "@/hooks/useUserDetails";
import { FC } from "react";

const ApiCredentials: FC = () => {
  const { getUserDetails, getUserApiCredentials } = useUserDetails();
  const { data: userData, isLoading: isLoadingUserData } = getUserDetails();
  const { data: credentialsData, isLoading: isLoadingCredentialsData } =
    getUserApiCredentials();

  const user = userData?.data;
  const credentials = credentialsData?.data?.credentials;
  const loaded = user && credentials;
  const isLoading = isLoadingUserData || isLoadingCredentialsData;

  return (
    <PageMain>
      <PageHeader title="API credentials" />
      <PageContent>
        {isLoading && <LoadingState />}
        {loaded && (
          <ApiCredentialsTables user={user} credentials={credentials} />
        )}
      </PageContent>
    </PageMain>
  );
};

export default ApiCredentials;
