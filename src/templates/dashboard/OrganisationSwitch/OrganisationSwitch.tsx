import useAuth from "@/hooks/useAuth";
import { Select } from "@canonical/react-components";
import classNames from "classnames";
import classes from "./OrganisationSwitch.module.scss";
import { useAuthHandle } from "@/features/auth";
import useDebug from "@/hooks/useDebug";
import { ChangeEvent } from "react";
import InfoItem from "@/components/layout/InfoItem";
import useSidePanel from "@/hooks/useSidePanel";

const OrganisationSwitch = () => {
  const { account } = useAuth();
  const debug = useDebug();
  const { closeSidePanel } = useSidePanel();
  const { switchAccountQuery } = useAuthHandle();

  if (account.options.length === 1) {
    return (
      <InfoItem
        label="Organisation"
        value={account.options[0].label}
        className={classes.organisation}
      />
    );
  }

  const { mutateAsync: switchAccount } = switchAccountQuery;

  const handleOrganisationChange = async (
    event: ChangeEvent<HTMLSelectElement>,
  ) => {
    const account_name = event.target.value;

    try {
      const { data } = await switchAccount({ account_name });

      account.switch(data.token, account_name);

      closeSidePanel();
    } catch (error) {
      debug(error);
    }
  };

  return (
    <div className={classes.container}>
      <Select
        label="Organisation"
        labelClassName={classNames(
          classes.organisation,
          "p-text--small p-text--small-caps u-no-margin--bottom",
        )}
        options={account.options}
        value={account.current}
        onChange={handleOrganisationChange}
      />
    </div>
  );
};

export default OrganisationSwitch;
