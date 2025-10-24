import InfoItem from "@/components/layout/InfoItem";
import { useAuthHandle } from "@/features/auth";
import useAuthAccounts from "@/hooks/useAuthAccounts";
import useDebug from "@/hooks/useDebug";
import useSidePanel from "@/hooks/useSidePanel";
import { Select } from "@canonical/react-components";
import classNames from "classnames";
import type { ChangeEvent } from "react";
import classes from "./OrganisationSwitch.module.scss";

const OrganisationSwitch = () => {
  const { isOnSubdomain, options, handleAccountSwitch, currentAccount } =
    useAuthAccounts();
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const { switchAccountQuery } = useAuthHandle();

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

  const { mutateAsync: switchAccount } = switchAccountQuery;

  const handleOrganisationChange = async (
    event: ChangeEvent<HTMLSelectElement>,
  ): Promise<void> => {
    const account_name = event.target.value;

    try {
      const { data } = await switchAccount({ account_name });

      handleAccountSwitch(data.token, account_name);

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
