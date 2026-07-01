import type { FC } from "react";
import type { IdentityProvider } from "../..";
import { useAuthHandle } from "../..";
import ProviderForm from "../ProviderForm";
import LoadingState from "@/components/layout/LoadingState";

interface ProviderEditFormProps {
  readonly canBeDisabled: boolean;
  readonly provider: IdentityProvider;
}

const ProviderEditForm: FC<ProviderEditFormProps> = ({
  canBeDisabled,
  provider,
}) => {
  const { getSingleProviderQuery } = useAuthHandle();

  const {
    data: getSingleProviderQueryResult,
    isPending,
    error,
  } = getSingleProviderQuery(
    { providerId: provider.id },
    { enabled: provider.provider !== "ubuntu-one" },
  );

  if (provider.provider === "ubuntu-one") {
    return (
      <ProviderForm
        action="edit"
        provider={provider}
        initialValues={{
          client_id: "",
          client_secret: "",
          enabled: provider.enabled,
          issuer: "",
          name: "",
        }}
        canBeDisabled={canBeDisabled}
      />
    );
  }

  if (error) {
    throw error;
  }

  if (isPending) {
    return <LoadingState />;
  }

  return (
    <ProviderForm
      action="edit"
      provider={provider}
      initialValues={{
        client_id: getSingleProviderQueryResult.data.configuration.client_id,
        client_secret:
          getSingleProviderQueryResult.data.configuration.client_secret,
        enabled: getSingleProviderQueryResult.data.enabled,
        issuer: getSingleProviderQueryResult.data.configuration.issuer,
        name: getSingleProviderQueryResult.data.configuration.name,
      }}
      canBeDisabled={canBeDisabled}
      singleProvider={getSingleProviderQueryResult.data}
    />
  );
};

export default ProviderEditForm;
