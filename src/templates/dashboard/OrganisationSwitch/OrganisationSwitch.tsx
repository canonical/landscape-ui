import InfoItem from "@/components/layout/InfoItem";
import useAuthAccounts from "@/hooks/useAuthAccounts";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import useSwitchAccount from "@/hooks/useSwitchAccount";
import { Select } from "@canonical/react-components";
import classNames from "classnames";
import type { ChangeEvent } from "react";
import classes from "./OrganisationSwitch.module.scss";

const OrganisationSwitch = () => {
  const { isOnSubdomain, options, currentAccount } = useAuthAccounts();
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const { switchAccount } = useSwitchAccount();

  if (isOnSubdomain || options.length === 1) {
    return (
      <div className={classNames(classes.container, classes.marginBottom)}>
        <InfoItem
          label="Organization"
          value={currentAccount.title}
          className={classes.organisation}
        />
      </div>
    );
  }

  const handleOrganisationChange = async (
    event: ChangeEvent<HTMLSelectElement>,
  ): Promise<void> => {
    try {
      await switchAccount(event.target.value);

      closeSidePanel();
    } catch (error) {
      debug(error);
    }
  };

  return (
    <div className={classes.container}>
      <Select
        label="Organization"
        labelClassName={classNames(
          classes.organisation,
          "p-text--small p-text--small-caps u-no-margin--bottom",
        )}
        options={options}
        value={currentAccount.name}
        onChange={handleOrganisationChange}
      />
    </div>
  );
};

export default OrganisationSwitch;
