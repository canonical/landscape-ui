import { AccountSettingsTabs } from "@/features/account-settings";
import { FC } from "react";
import PageContent from "@/components/layout/PageContent";
import PageHeader from "@/components/layout/PageHeader";
import PageMain from "@/components/layout/PageMain";
import useUserDetails from "@/hooks/useUserDetails";
import LoadingState from "@/components/layout/LoadingState";
import EmptyState from "@/components/layout/EmptyState";
import { Button } from "@canonical/react-components";
import useDebug from "@/hooks/useDebug";

const UserPage: FC = () => {
  const debug = useDebug();
  const { getUserDetails, getUserApiCredentials } = useUserDetails();
  const {
    data: userData,
    isLoading: isLoadingUserData,
    refetch: refetchUserData,
    error: userDataError,
  } = getUserDetails();
  const {
    data: credentialsData,
    isLoading: isLoadingCredentialsData,
    refetch: refetchUserCredentials,
    error: credentialsError,
  } = getUserApiCredentials();

  if (userDataError) {
    debug(userDataError);
  }
  if (credentialsError) {
    debug(credentialsError);
  }

  const user = userData?.data;
  const credentials = credentialsData?.data?.credentials;
  const loaded = user && credentials;
  const isLoading = isLoadingUserData || isLoadingCredentialsData;

  const handleRefetch = () => {
    refetchUserData();
    refetchUserCredentials();
  };

  return (
    <PageMain>
      <PageHeader title="Account settings" />
      <PageContent>
        {isLoading && <LoadingState />}
        {!isLoading && !loaded && (
          <EmptyState
            title="Could not load account information"
            icon="connected"
            cta={[
              <Button
                key="refetch"
                appearance="positive"
                onClick={handleRefetch}
              >
                Try again
              </Button>,
            ]}
          />
        )}
        {loaded && (
          <AccountSettingsTabs user={user} credentials={credentials} />
        )}
      </PageContent>
    </PageMain>
  );
};

export default UserPage;
