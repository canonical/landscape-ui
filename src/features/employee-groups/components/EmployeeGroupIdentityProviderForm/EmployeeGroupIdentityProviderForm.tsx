import { supportedProviders } from "@/tests/mocks/identityProviders";
import { Button, Icon } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense } from "react";
import classes from "./EmployeeGroupIdentityProviderForm.module.scss";
import useSidePanel from "@/hooks/useSidePanel";
import LoadingState from "@/components/layout/LoadingState";
import type { SupportedIdentityProvider } from "@/features/auth";
import { getProviderIcon } from "@/features/auth";

const ImportEmployeeGroupsForm = lazy(
  () => import("../ImportEmployeeGroupsForm"),
);

const EmployeeGroupIdentityProviderForm: FC = () => {
  const { setSidePanelContent } = useSidePanel();

  const handleSelectProviderSource = (provider: SupportedIdentityProvider) => {
    setSidePanelContent(
      //TODO change
      `Import employee groups from ${provider.provider_label}`,
      <Suspense fallback={<LoadingState />}>
        <ImportEmployeeGroupsForm providerId={1} />
      </Suspense>,
    );
  };

  return (
    <>
      <ul className="u-no-margin--left u-no-margin--right u-no-padding--left u-no-padding--right p-list">
        {supportedProviders
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
                onClick={() => handleSelectProviderSource(provider)}
                className={classes.providerButton}
              >
                <span className={classes.iconContainer}>
                  <Icon
                    name={getProviderIcon(provider.provider_slug)}
                    className={classes.icon}
                  />
                  <span>{provider.provider_label}</span>
                </span>
                <Icon name="chevron-down" className={classes.arrow} />
              </Button>
            </li>
          ))}
      </ul>

      <p className="p-text--small u-text--muted">
        More identity providers will be integrated in the future.
      </p>
    </>
  );
};

export default EmployeeGroupIdentityProviderForm;
