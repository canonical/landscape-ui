import { FC } from "react";
import LoadingState from "@/components/layout/LoadingState";
import {
  ProviderList,
  ProvidersEmptyState,
  useIdentityProviders,
} from "@/features/identity-providers";
import useAuth from "@/hooks/useAuth";

const IdentityProvidersContainer: FC = () => {
  const { user } = useAuth();
  const { getProvidersQuery, deleteProviderQuery } = useIdentityProviders();

  const { data: identityProviders, isLoading } = getProvidersQuery({
    account_name: user?.current_account ?? "",
  });

  const { mutateAsync } = deleteProviderQuery;

  if (!user) {
    console.log(mutateAsync);
  }

  // useEffect(() => {
  //   if (!identityProviders || !identityProviders.data.results.length) {
  //     return;
  //   }
  //
  //   const provider = identityProviders.data.results[0];
  //
  //   console.log("provider", provider);
  //
  //   (async () => {
  //     await mutateAsync({ provider });
  //   })();
  // }, [identityProviders]);

  return (
    <>
      {isLoading && <LoadingState />}
      {!isLoading &&
        (!identityProviders || !identityProviders.data.results.length) && (
          <ProvidersEmptyState />
        )}
      {!isLoading &&
        identityProviders &&
        identityProviders.data.results.length > 0 && (
          <ProviderList providers={identityProviders.data.results} />
        )}
    </>
  );
};

export default IdentityProvidersContainer;
