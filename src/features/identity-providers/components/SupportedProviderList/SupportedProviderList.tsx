import { FC } from "react";
import { Button, Icon } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import useSidePanel from "@/hooks/useSidePanel";
import { SUPPORTED_PROVIDERS } from "../../constants";
import { useIdentityProviders } from "../../hooks";
import { SupportedIdentityProvider } from "../../types";
import ProviderForm from "../ProviderForm";
import classes from "./SupportedProviderList.module.scss";

const SupportedProviderList: FC = () => {
  const { setSidePanelContent } = useSidePanel();
  const { getSupportedProvidersQuery } = useIdentityProviders();

  const { data: globalProviderList, isLoading } = getSupportedProvidersQuery();

  const handleIdentityProviderAdd = (provider: SupportedIdentityProvider) => {
    setSidePanelContent(
      `Add ${provider.provider_label} identity provider`,
      <ProviderForm action="add" provider={provider} />,
    );
  };

  return (
    <>
      {isLoading && <LoadingState />}
      {!isLoading &&
        globalProviderList &&
        globalProviderList.data.results.length > 0 && (
          <ul className="u-no-margin--left u-no-margin--right u-no-padding--left u-no-padding--right p-list">
            {globalProviderList.data.results
              .filter((provider) => provider.provider_slug !== "ubuntu-one")
              .map((provider) => (
                <li
                  key={provider.provider_slug}
                  className="p-list__item u-no-padding--bottom u-no-padding--top"
                >
                  <Button
                    type="button"
                    appearance="base"
                    hasIcon
                    onClick={() => handleIdentityProviderAdd(provider)}
                    className={classes.providerButton}
                  >
                    <span className={classes.iconContainer}>
                      <Icon
                        name={SUPPORTED_PROVIDERS[provider.provider_slug].icon}
                        className={classes.icon}
                      />
                      <span>{provider.provider_label}</span>
                    </span>
                    <Icon name="chevron-down" className={classes.arrow} />
                  </Button>
                </li>
              ))}
          </ul>
        )}
      <p className="p-text--small u-text--muted">
        More identity providers will be integrated in the future.
      </p>
    </>
  );
};

export default SupportedProviderList;
